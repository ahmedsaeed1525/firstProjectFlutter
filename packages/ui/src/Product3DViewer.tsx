import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Detailed, Environment, Html } from '@react-three/drei';
import type { Product } from 'shared';

// This component handles the actual loading and displaying of a single GLB model.
function Model({ url }: { url: string }) {
  // useGLTF will use DRACOLoader automatically if the model is compressed.
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

interface Product3DViewerProps {
  product: Product;
}

export const Product3DViewer = ({ product }: Product3DViewerProps) => {
  const { glb_urls } = product;
  const ref = useRef();

  return (
    <Canvas ref={ref} camera={{ fov: 45, position: [0, 0, 5] }} style={{ background: '#f0f0f0', borderRadius: '8px' }}>
      <Suspense fallback={<Html center>Loading 3D model...</Html>}>
        <Environment preset="studio" />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <Detailed distances={[0, 10, 20]}>
          <Model url={glb_urls.lod0} />
          <Model url={glb_urls.lod1} />
          <Model url={glb_urls.lod2} />
        </Detailed>

        <OrbitControls enablePan={false} minDistance={2} maxDistance={30} />
      </Suspense>
    </Canvas>
  );
};
