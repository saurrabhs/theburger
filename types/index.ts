// Global type definitions

export interface NavigationLink {
  name: string;
  href: string;
}

export interface SocialLink {
  icon: React.ComponentType;
  href: string;
  label: string;
}

export interface FooterSection {
  title: string;
  links: string[];
}

// Animation types
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  ease?: string | number[];
}

// 3D Scene types (for Phase 2)
export interface SceneProps {
  children?: React.ReactNode;
}

export interface BurgerProps {
  exploded?: boolean;
  rotation?: number;
  scale?: number;
}

export interface IngredientProps {
  modelPath: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  onClick?: () => void;
  onHover?: (hovered: boolean) => void;
}
