import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Stripe from "stripe";
import type { CartItem } from "shared"; // This path won't work out of the box

// TODO: Fix the import path for 'shared'. For now, we will define the type locally.
// This is a common issue in monorepos with separate projects (e.g. a `functions` folder).
// A better setup would involve a build step that makes the shared package available.
interface LocalCartItem {
  sku: string;
  title: string;
  priceAtAdd: number;
  quantity: number;
}

admin.initializeApp();

// It's best practice to initialize Stripe with the key from environment variables.
// The key should be set in the Firebase environment configuration.
// `firebase functions:config:set stripe.secret="your_stripe_secret_key"`
const stripe = new Stripe(functions.config().stripe.secret, {
  apiVersion: "2024-06-20",
});

export const createCheckoutSession = functions.https.onCall(async (data, context) => {
  const items = data.items as LocalCartItem[];

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with an array of cart items."
    );
  }

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(item => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          metadata: {
            sku: item.sku,
          }
        },
        unit_amount: Math.round(item.priceAtAdd * 100), // Stripe expects the amount in cents
      },
      quantity: item.quantity,
    };
  });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${functions.config().app.url}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${functions.config().app.url}/cart`,
    });

    return { id: session.id };
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    throw new functions.https.HttpsError(
      "internal",
      "An error occurred while creating the checkout session."
    );
  }
});

// A local Order type to avoid cross-package import issues for now.
interface LocalOrder {
  orderId: string;
  userId?: string; // May not have a user ID for guest checkouts
  items: LocalCartItem[];
  total: number;
  currency: string;
  paymentStatus: 'paid';
  shippingStatus: 'pending';
  stripePaymentIntentId: string;
  createdAt: admin.firestore.FieldValue;
}

export const stripeWebhook = functions.https.onRequest(async (request, response) => {
  const sig = request.headers["stripe-signature"] as string;
  const webhookSecret = functions.config().stripe.webhook_secret;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(request.rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Retrieve line items to get the full product details
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ["data.price.product"],
    });

    const orderItems: LocalCartItem[] = lineItems.data.map(item => {
      const product = item.price?.product as Stripe.Product;
      return {
        sku: product.metadata.sku,
        title: product.name,
        priceAtAdd: item.price!.unit_amount! / 100,
        quantity: item.quantity!,
      };
    });

    const orderData: LocalOrder = {
      orderId: session.id,
      userId: session.client_reference_id || undefined, // Pass user ID here
      total: session.amount_total! / 100,
      currency: session.currency!,
      paymentStatus: 'paid',
      shippingStatus: 'pending',
      stripePaymentIntentId: session.payment_intent as string,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      items: orderItems,
    };

    try {
      // Save the new order to Firestore
      const orderRef = admin.firestore().collection("orders").doc(session.id);
      await orderRef.set(orderData);
      console.log(`Order ${session.id} successfully created.`);
    } catch (error) {
      console.error("Error saving order to Firestore:", error);
      // We don't want to send a 400 back to Stripe here, as the payment was successful.
      // We should log this for manual intervention.
    }
  }

  // Acknowledge receipt of the event
  response.status(200).send({ received: true });
});
