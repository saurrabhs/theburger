"use client";

import Ingredient from "./Ingredient";
import { BURGER_CONFIG } from "@/config/BurgerConfig";

export default function Burger() {
  return (
    <group>
      <Ingredient config={BURGER_CONFIG.topBun} />
      <Ingredient config={BURGER_CONFIG.lettuce} />
      <Ingredient config={BURGER_CONFIG.tomato} />
      <Ingredient config={BURGER_CONFIG.cheese} />
      <Ingredient config={BURGER_CONFIG.patty} />
      <Ingredient config={BURGER_CONFIG.pickles} />
      <Ingredient config={BURGER_CONFIG.onions} />
      <Ingredient config={BURGER_CONFIG.bottomBun} />
    </group>
  );
}
