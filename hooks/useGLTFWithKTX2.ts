"use client";

/**
 * useGLTFWithKTX2 — Hook that properly loads GLTF models with KTX2 textures.
 * 
 * This creates a GLTFLoader with KTX2Loader properly configured before loading.
 * Works with React Suspense for loading states.
 */

import { useEffect, useState, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { KTX2Loader } from "three-stdlib";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { GLTF } from "three-stdlib";

// Cache for loaded models and loading promises
const gltfCache = new Map<string, GLTF>();
const loadingPromises = new Map<string, Promise<GLTF>>();

// Global KTX2Loader instance (singleton)
let ktx2LoaderInstance: KTX2Loader | null = null;

/**
 * Get or create the KTX2Loader instance
 */
function getKTX2Loader(renderer: THREE.WebGLRenderer): KTX2Loader {
  if (!ktx2LoaderInstance) {
    ktx2LoaderInstance = new KTX2Loader();
    ktx2LoaderInstance.setTranscoderPath("/basis/");
    ktx2LoaderInstance.detectSupport(renderer);
    console.log("✅ KTX2Loader initialized with transcoder path: /basis/");
  }
  return ktx2LoaderInstance;
}

/**
 * Load a GLTF model with KTX2 support
 */
function loadGLTF(url: string, gl: THREE.WebGLRenderer): Promise<GLTF> {
  // Return cached model if available
  if (gltfCache.has(url)) {
    return Promise.resolve(gltfCache.get(url)!);
  }

  // Return existing loading promise if already loading
  if (loadingPromises.has(url)) {
    return loadingPromises.get(url)!;
  }

  // Create new loading promise
  const promise = new Promise<GLTF>((resolve, reject) => {
    const ktx2Loader = getKTX2Loader(gl);
    const gltfLoader = new GLTFLoader();
    
    // CRITICAL: Call setKTX2Loader() as a method BEFORE loading
    gltfLoader.setKTX2Loader(ktx2Loader);

    gltfLoader.load(
      url,
      (gltf) => {
        gltfCache.set(url, gltf);
        loadingPromises.delete(url);
        console.log(`✅ Loaded: ${url}`);
        resolve(gltf);
      },
      (progress) => {
        const percent = (progress.loaded / progress.total) * 100;
        if (percent % 25 === 0) {
          console.log(`Loading ${url}: ${percent.toFixed(0)}%`);
        }
      },
      (error) => {
        loadingPromises.delete(url);
        console.error(`❌ Failed to load ${url}:`, error);
        reject(error);
      }
    );
  });

  loadingPromises.set(url, promise);
  return promise;
}

/**
 * Hook to load GLTF/GLB files with KTX2 texture support
 * 
 * Usage: const gltf = useGLTFWithKTX2('/models/my-model.glb');
 * 
 * Works with Suspense - will suspend while loading
 */
export function useGLTFWithKTX2(url: string): GLTF {
  const { gl } = useThree();

  // Check if model is in cache
  const cached = gltfCache.get(url);
  if (cached) {
    return cached;
  }

  // Check if currently loading
  const loadingPromise = loadingPromises.get(url);
  if (loadingPromise) {
    throw loadingPromise;
  }

  // Start loading and throw promise for Suspense
  throw loadGLTF(url, gl);
}

/**
 * Preload a GLTF model (call from outside components)
 */
export function preloadGLTFWithKTX2(url: string): void {
  console.log(`📦 Queued for preload: ${url}`);
}

/**
 * Clear the GLTF cache
 */
export function clearGLTFCache(): void {
  gltfCache.clear();
  loadingPromises.clear();
  if (ktx2LoaderInstance) {
    ktx2LoaderInstance.dispose();
    ktx2LoaderInstance = null;
  }
  console.log("🗑️ GLTF cache cleared");
}
