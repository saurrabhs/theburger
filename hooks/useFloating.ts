import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";

interface UseFloatingOptions {
  amplitude?: number;
  speed?: number;
  offset?: number;
}

export function useFloating({
  amplitude = 0.2,
  speed = 1.5,
  offset = 0,
}: UseFloatingOptions = {}) {
  const ref = useRef<Group>(null);

  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.getElapsedTime();
      ref.current.position.y += Math.sin(time * speed + offset) * amplitude * 0.001;
    }
  });

  return ref;
}
