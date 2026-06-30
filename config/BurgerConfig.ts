import { Vector3, Euler } from "three";

export interface IngredientConfig {
  position: Vector3;
  rotation: Euler;
  scale: Vector3;
  explodedPosition: Vector3;
  name: string;
  displayName: string;
  description: string;
  color: string;
}

export const BURGER_CONFIG: Record<string, IngredientConfig> = {
  topBun: {
    position: new Vector3(0.0759, 2.2519, 0.0898),
    rotation: new Euler(-0.3563, 0.7054, 0.2331),
    scale: new Vector3(0.4, 0.4, 0.4),
    explodedPosition: new Vector3(0, 6, 0),
    name: "top bu",
    displayName: "Brioche Top",
    description: "Golden, toasted, perfectly soft",
    color: "#FFB627",
  },
  lettuce: {
    position: new Vector3(0, 3.137, 0.0996),
    rotation: new Euler(0.193, 0.06, 3.088),
    scale: new Vector3(0.4, 0.4, 0.4),
    explodedPosition: new Vector3(0, 4.5, 0),
    name: "lettuc",
    displayName: "Fresh Lettuce",
    description: "Crisp, vibrant, garden fresh",
    color: "#90EE90",
  },
  tomato: {
    position: new Vector3(-0.0436, 1.7618, 0.2795),
    rotation: new Euler(-0.5132, -0.0256, -0.0016),
    scale: new Vector3(0.31, 0.31, 0.31),
    explodedPosition: new Vector3(0, 3.2, 0),
    name: "tomato",
    displayName: "Heirloom Tomato",
    description: "Ripe, juicy, vine-ripened",
    color: "#FF6347",
  },
  cheese: {
    position: new Vector3(-0.0141, 1.9596, 0.0232),
    rotation: new Euler(-0.0009, 0, 0),
    scale: new Vector3(0.36, 0.36, 0.36),
    explodedPosition: new Vector3(0, 2.2, 0),
    name: "cheese",
    displayName: "Aged Cheddar",
    description: "Rich, creamy, perfect melt",
    color: "#FFD700",
  },
  patty: {
    position: new Vector3(-0.02, 1.1479, 0.3262),
    rotation: new Euler(-0.4643, -0.1723, -0.0424),
    scale: new Vector3(0.35, 0.35, 0.35),
    explodedPosition: new Vector3(0, 1.2, 0),
    name: "petty",
    displayName: "Prime Beef Patty",
    description: "Grass-fed, flame-grilled, perfection",
    color: "#8B4513",
  },
  pickles: {
    position: new Vector3(-0.1, 1.2285, 0.0099),
    rotation: new Euler(-0.2469, 0, 0),
    scale: new Vector3(0.34, 0.17, 0.44),
    explodedPosition: new Vector3(0, 0.2, 0),
    name: "pickle slice",
    displayName: "Kosher Pickles",
    description: "Tangy, crunchy, house-made",
    color: "#9ACD32",
  },
  onions: {
    position: new Vector3(0, 0.9232, 0.1),
    rotation: new Euler(-0.3763, 0.0024, 0.0593),
    scale: new Vector3(0.35, 0.3, 0.51),
    explodedPosition: new Vector3(0, -0.3, 0),
    name: "onions",
    displayName: "Caramelized Onions",
    description: "Sweet, savory, slow-cooked",
    color: "#DEB887",
  },
  bottomBun: {
    position: new Vector3(-0.06, 1.7263, -0.2105),
    rotation: new Euler(2.8724, 0, 0),
    scale: new Vector3(0.39, 0.39, 0.39),
    explodedPosition: new Vector3(0, -1.5, 0),
    name: "top bu",
    displayName: "Brioche Bottom",
    description: "Sturdy, toasted, holds it all",
    color: "#FFB627",
  },
};

// Camera settings — tuned for burger Y range ~0.9 to ~3.1 (center ~2.0)
export const CAMERA_CONFIG = {
  position: new Vector3(0, 2.0, 7),
  fov: 42,
  near: 0.1,
  far: 1000,
};

// Lighting settings
export const LIGHTING_CONFIG = {
  ambient: {
    intensity: 0.4,
    color: "#ffffff",
  },
  directional: {
    intensity: 1.2,
    position: new Vector3(5, 5, 5),
    color: "#ffffff",
  },
  spotlight: {
    intensity: 0.8,
    position: new Vector3(0, 10, 0),
    color: "#FFB627",
  },
};

// Animation settings
export const ANIMATION_CONFIG = {
  floatingAmplitude: 0.2,
  floatingSpeed: 1.5,
  rotationSpeed: 0.3,
  explosionDuration: 2,
  explosionEase: "power2.inOut",
};
