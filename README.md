# 3D Bazaar

This repository contains the source code for **3D Bazaar**, a full-stack e-commerce platform with an interactive 3D product viewer.

## Project Overview

This is a monorepo containing:
- `/apps/web`: The main Next.js web application.
- `/apps/mobile`: The Flutter mobile application.
- `/packages/ui`: Shared React components.
- `/packages/shared`: Shared types, API clients, and utilities.
- `/tools`: Scripts for development and deployment.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the web application (development):**
   ```bash
   npm run dev
   ```

3. **Build the web application (production):**
   ```bash
   npm run build
   ```

## Milestones

- [x] **M1: Monorepo scaffold + Next.js app + Firebase project setup + CI base**
- [ ] M2: Product model + Firestore schema + seed data + product list page
- [ ] M3: 3D viewer + AR + GLB pipeline + asset CDN + LOD & Draco compression
- [ ] M4: Cart + Checkout + Stripe + Order management
- [ ] M5: Auth (email, Google, guest) + Profile + Reviews + Wishlist
- [ ] M6: Admin dashboard (product CRUD, upload) + role based access
- [ ] M7: Mobile app skeleton + 3D viewer integration (Unity or WebView)
- [ ] M8: Performance & accessibility polish + RTL/Localization + deploy
