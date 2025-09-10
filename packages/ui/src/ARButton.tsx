'use client';

import React, from 'react';
import { Product } from 'shared';
import styles from './ARButton.module.css';

interface ARButtonProps {
  product: Product;
}

export const ARButton = ({ product }: ARButtonProps) => {
  const [os, setOs] = React.useState<'iOS' | 'Android' | 'Other'>('Other');

  React.useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      setOs('iOS');
    } else if (/android/i.test(userAgent)) {
      setOs('Android');
    }
  }, []);

  if (os === 'iOS' && product.usdz_url) {
    return (
      <a href={product.usdz_url} rel="ar" className={styles.arButton}>
        View in Your Space (AR)
      </a>
    );
  }

  if (os === 'Android' && product.glb_urls.lod0) {
    const modelUrl = product.glb_urls.lod0;
    // Note: The model URL must be absolute and publicly accessible for Scene Viewer.
    // We assume the placeholder URL is relative and needs to be resolved.
    const absoluteModelUrl = new URL(modelUrl, window.location.origin).href;
    const intent = `intent://arvr.google.com/scene-viewer/1.0?file=${absoluteModelUrl}&mode=ar_only&title=${encodeURIComponent(product.title)}#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;end;`;
    return (
      <a href={intent} className={styles.arButton}>
        View in Your Space (AR)
      </a>
    );
  }

  // Render nothing if AR is not supported
  return null;
};
