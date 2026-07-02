"use client";

/**
 * KTX2Provider — Configures GLTFLoader to support KTX2 compressed textures.
 * 
 * This provider sets up KTX2Loader with Basis Universal transcoder for all
 * useGLTF() calls in the app. Required for loading models compressed with
 * gltf-transform etc1s/uastc commands.
 * 
 * Usage: Wrap your Canvas or entire app with this provider.
 */

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { KTX2Loader } from "three-stdlib";
import * as THREE from "three";

export function KTX2LoaderProvider({ children }: { children: React.ReactNode }) {
  const { gl } = useThree();

  useEffect(() => {
    // Create a single KTX2Loader instance
    const ktx2Loader = new KTX2Loader();
    
    // Set the path to the Basis Universal transcoder files
    ktx2Loader.setTranscoderPath("/basis/");
    
    // Detect GPU capabilities and configure optimal texture formats
    ktx2Loader.detectSupport(gl);

    // Configure the global GLTFLoader to use our KTX2Loader
    // This ensures all useGLTF() calls can handle KTX2 textures
    THREE.DefaultLoadingManager.addHandler(/\.ktx2$/i, ktx2Loader);

    // Store the loader globally so useGLTF can access it
    (globalThis as any).__ktx2Loader = ktx2Loader;

    console.log("✅ KTX2Loader configured with transcoder path: /basis/");

    // Cleanup on unmount
    return () => {
      ktx2Loader.dispose();
      delete (globalThis as any).__ktx2Loader;
    };
  }, [gl]);

  return <>{children}</>;
}
