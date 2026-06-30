"use client";

/**
 * DEVELOPER MODE BURGER EDITOR
 * Press "D" to toggle on/off. Zero impact on production behaviour.
 */

import { useState, useEffect, useRef, useCallback, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { TransformControls, OrbitControls, PerspectiveCamera, useGLTF, Environment, Line } from "@react-three/drei";
import { Group } from "three";
import { BURGER_CONFIG, CAMERA_CONFIG, IngredientConfig } from "@/config/BurgerConfig";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Transform {
  position: [number, number, number];
  rotation: [number, number, number];
  scale:    [number, number, number];
}

type IngredientKey = keyof typeof BURGER_CONFIG;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function round(n: number, d = 4) { return parseFloat(n.toFixed(d)); }
function toDeg(r: number)        { return round((r * 180) / Math.PI, 2); }
function toRad(d: number)        { return round((d * Math.PI) / 180, 6); }

function configToTransform(cfg: IngredientConfig): Transform {
  return {
    position: [cfg.position.x, cfg.position.y, cfg.position.z],
    rotation: [cfg.rotation.x, cfg.rotation.y, cfg.rotation.z],
    scale:    [cfg.scale.x,    cfg.scale.y,    cfg.scale.z],
  };
}

const INITIAL_TRANSFORMS: Record<IngredientKey, Transform> = Object.fromEntries(
  Object.entries(BURGER_CONFIG).map(([k, v]) => [k, configToTransform(v)])
) as Record<IngredientKey, Transform>;

const INGREDIENT_KEYS = Object.keys(BURGER_CONFIG) as IngredientKey[];

const LABELS: Record<IngredientKey, string> = {
  topBun: "Top Bun", lettuce: "Lettuce", tomato: "Tomato", cheese: "Cheese",
  patty: "Patty", pickles: "Pickles", onions: "Onions", bottomBun: "Bottom Bun",
};

// ─── Editable ingredient ──────────────────────────────────────────────────────

interface EditableIngredientProps {
  ingredientKey: IngredientKey;
  transform: Transform;
  selected: boolean;
  mode: "translate" | "rotate";
  onTransformChange: (key: IngredientKey, t: Transform) => void;
  onSelect: (key: IngredientKey) => void;
  orbitRef: React.MutableRefObject<any>;
}

function EditableIngredient({ ingredientKey, transform, selected, mode, onTransformChange, onSelect, orbitRef }: EditableIngredientProps) {
  const cfg = BURGER_CONFIG[ingredientKey];
  const { scene } = useGLTF(`/models/${cfg.name}.glb`);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  const groupRef = useRef<Group>(null);
  const tcRef = useRef<any>(null);
  const isDragging = useRef(false);

  // Apply full transform (pos + rot + scale) from state
  useEffect(() => {
    if (!groupRef.current) return;
    groupRef.current.position.set(...transform.position);
    groupRef.current.rotation.set(...transform.rotation);
    groupRef.current.scale.set(...transform.scale);
  }, [transform]);

  // Disable OrbitControls while dragging gizmo
  useEffect(() => {
    if (!selected) return;
    const tc = tcRef.current;
    if (!tc) return;
    const onDraggingChanged = (e: { value: boolean }) => {
      isDragging.current = e.value;
      if (orbitRef.current) orbitRef.current.enabled = !e.value;
    };
    tc.addEventListener("dragging-changed", onDraggingChanged);
    return () => {
      tc.removeEventListener("dragging-changed", onDraggingChanged);
      if (orbitRef.current) orbitRef.current.enabled = true;
    };
  }, [selected, orbitRef]);

  // Stream live values to panel while dragging
  useFrame(() => {
    if (!groupRef.current || !selected || !isDragging.current) return;
    const p = groupRef.current.position;
    const r = groupRef.current.rotation;
    const s = groupRef.current.scale;
    onTransformChange(ingredientKey, {
      position: [+p.x.toFixed(4), +p.y.toFixed(4), +p.z.toFixed(4)],
      rotation: [+r.x.toFixed(4), +r.y.toFixed(4), +r.z.toFixed(4)],
      scale:    [+s.x.toFixed(4), +s.y.toFixed(4), +s.z.toFixed(4)],
    });
  });

  return (
    <>
      <group
        ref={groupRef}
        onClick={(e) => { e.stopPropagation(); onSelect(ingredientKey); }}
      >
        <primitive object={cloned} />
      </group>
      {selected && groupRef.current && (
        <TransformControls ref={tcRef} object={groupRef.current} mode={mode} size={0.7} />
      )}
    </>
  );
}

// ─── Canvas scene ─────────────────────────────────────────────────────────────

interface EditorSceneProps {
  transforms: Record<IngredientKey, Transform>;
  selected: IngredientKey;
  mode: "translate" | "rotate";
  onTransformChange: (key: IngredientKey, t: Transform) => void;
  onSelect: (key: IngredientKey) => void;
}

function EditorScene({ transforms, selected, mode, onTransformChange, onSelect }: EditorSceneProps) {
  const orbitRef = useRef<any>(null);
  return (
    <>
      <PerspectiveCamera makeDefault
        position={[CAMERA_CONFIG.position.x, CAMERA_CONFIG.position.y, CAMERA_CONFIG.position.z]}
        fov={CAMERA_CONFIG.fov} near={CAMERA_CONFIG.near} far={CAMERA_CONFIG.far}
      />
      <ambientLight intensity={1.2} color="#ffffff" />
      <directionalLight position={[5, 8, 5]}   intensity={2.0} color="#ffffff" castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={1.0} color="#ffffff" />
      <pointLight position={[-5, 3, -5]} intensity={0.8} color="#FF6B35" />
      <pointLight position={[5, 3, -5]}  intensity={0.8} color="#FFB627" />
      <pointLight position={[0, -3, 5]}  intensity={0.5} color="#ffffff" />
      <Environment preset="studio" />

      {/* Horizontal reference line (X axis) — red */}
      <Line points={[[-10,0,0],[10,0,0]]} color="#ff4444" lineWidth={1} opacity={0.6} transparent />
      {/* Vertical reference line (Y axis) — green */}
      <Line points={[[0,-10,0],[0,10,0]]} color="#44ff44" lineWidth={1} opacity={0.6} transparent />

      <OrbitControls ref={orbitRef} makeDefault={false} enableZoom enablePan={false} />

      <Suspense fallback={null}>
        {INGREDIENT_KEYS.map((key) => (
          <EditableIngredient
            key={key}
            ingredientKey={key}
            transform={transforms[key]}
            selected={selected === key}
            mode={mode}
            onTransformChange={onTransformChange}
            onSelect={onSelect}
            orbitRef={orbitRef}
          />
        ))}
      </Suspense>
    </>
  );
}

// ─── Nudge row UI component ───────────────────────────────────────────────────

function NudgeRow({ label, color, value, onMinus, onPlus, display }: {
  label: string; color: string; value: number;
  onMinus: () => void; onPlus: () => void;
  display?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-4 font-bold ${color}`}>{label}</span>
      <button onClick={onMinus} className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded text-center leading-none">−</button>
      <span className="flex-1 text-center bg-gray-800 rounded px-1 py-0.5 text-xs">
        {display ?? value.toFixed(4)}
      </span>
      <button onClick={onPlus} className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded text-center leading-none">+</button>
    </div>
  );
}

// ─── Main DevEditor ───────────────────────────────────────────────────────────

export default function DevEditor() {
  const [active, setActive]   = useState(false);
  const [selected, setSelected] = useState<IngredientKey>("topBun");
  const [mode, setMode]       = useState<"translate" | "rotate">("translate");
  const [transforms, setTransforms] = useState<Record<IngredientKey, Transform>>(
    () => JSON.parse(JSON.stringify(INITIAL_TRANSFORMS))
  );

  // D key toggle
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "d" || e.key === "D") setActive(v => !v); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const handleTransformChange = useCallback((key: IngredientKey, t: Transform) => {
    setTransforms(prev => ({ ...prev, [key]: t }));
  }, []);

  const currentT   = transforms[selected];
  const selectedIdx = INGREDIENT_KEYS.indexOf(selected);

  const P_STEP = 0.01;
  const R_STEP = toRad(1);   // 1°
  const S_STEP = 0.01;

  const nudge = (axis: string, delta: number) => {
    setTransforms(prev => {
      const t: Transform = JSON.parse(JSON.stringify(prev[selected]));
      if (axis === "px") t.position[0] = round(t.position[0] + delta);
      if (axis === "py") t.position[1] = round(t.position[1] + delta);
      if (axis === "pz") t.position[2] = round(t.position[2] + delta);
      if (axis === "rx") t.rotation[0] = round(t.rotation[0] + delta);
      if (axis === "ry") t.rotation[1] = round(t.rotation[1] + delta);
      if (axis === "rz") t.rotation[2] = round(t.rotation[2] + delta);
      if (axis === "sx") t.scale[0] = round(Math.max(0.01, t.scale[0] + delta));
      if (axis === "sy") t.scale[1] = round(Math.max(0.01, t.scale[1] + delta));
      if (axis === "sz") t.scale[2] = round(Math.max(0.01, t.scale[2] + delta));
      // Uniform scale shortcut
      if (axis === "su") {
        const ns = round(Math.max(0.01, t.scale[0] + delta));
        t.scale = [ns, ns, ns];
      }
      return { ...prev, [selected]: t };
    });
  };

  const resetSelected = () => setTransforms(prev => ({
    ...prev, [selected]: JSON.parse(JSON.stringify(INITIAL_TRANSFORMS[selected]))
  }));

  const copyTransform = () => {
    const t = transforms[selected];
    const text = `${selected}: {\n  position: [${t.position.join(", ")}],\n  rotation: [${t.rotation.join(", ")}],\n  scale:    [${t.scale.join(", ")}]\n}`;
    navigator.clipboard.writeText(text);
  };

  const exportConfig = () => {
    const lines = INGREDIENT_KEYS.map(key => {
      const t   = transforms[key];
      const cfg = BURGER_CONFIG[key];
      return `  ${key}: {
    position: new Vector3(${t.position.join(", ")}),
    rotation: new Euler(${t.rotation.join(", ")}),
    scale: new Vector3(${t.scale.join(", ")}),
    explodedPosition: new Vector3(${cfg.explodedPosition.x}, ${cfg.explodedPosition.y}, ${cfg.explodedPosition.z}),
    name: "${cfg.name}",
    displayName: "${cfg.displayName}",
    description: "${cfg.description}",
    color: "${cfg.color}",
  }`;
    });
    const output = `import { Vector3, Euler } from "three";\n\nexport const BURGER_CONFIG = {\n${lines.join(",\n")}\n};\n`;
    const blob = new Blob([output], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "BurgerConfig.ts"; a.click();
    URL.revokeObjectURL(url);
  };

  if (process.env.NODE_ENV === "production") return null;

  if (!active) return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <button onClick={() => setActive(true)}
        className="px-3 py-1.5 bg-yellow-500 text-black text-xs font-bold rounded-lg shadow-lg hover:bg-yellow-400 transition">
        DEV MODE (D)
      </button>
    </div>
  );

  const axisColors = ["text-red-400", "text-green-400", "text-blue-400"];
  const axisLabels = ["X", "Y", "Z"];

  return (
    <div className="fixed inset-0 z-[9999] flex" style={{ fontFamily: "monospace" }}>

      {/* 3D Canvas */}
      <div className="flex-1 bg-[#0a0a0a]">
        <Canvas frameloop="always" shadows dpr={[1, 2]}>
          <EditorScene transforms={transforms} selected={selected} mode={mode}
            onTransformChange={handleTransformChange} onSelect={setSelected} />
        </Canvas>
      </div>

      {/* Side Panel */}
      <div className="w-80 bg-[#111] text-white overflow-y-auto flex flex-col gap-3 p-4 border-l border-gray-700"
        style={{ fontSize: 12 }}>

        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-yellow-400 font-bold text-sm">🍔 BURGER EDITOR</span>
          <button onClick={() => setActive(false)} className="text-gray-400 hover:text-white text-lg leading-none">✕</button>
        </div>

        {/* Mode */}
        <div className="flex gap-2">
          {(["translate", "rotate"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-1.5 rounded text-xs font-bold uppercase transition ${
                mode === m ? "bg-yellow-500 text-black" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}>
              {m}
            </button>
          ))}
        </div>

        {/* Ingredient selector */}
        <div className="grid grid-cols-2 gap-1">
          {INGREDIENT_KEYS.map(key => (
            <button key={key} onClick={() => setSelected(key)}
              className={`py-1.5 px-2 rounded text-left text-xs transition ${
                selected === key ? "bg-yellow-500 text-black font-bold" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}>
              {LABELS[key]}
            </button>
          ))}
        </div>

        {/* Prev / Next */}
        <div className="flex gap-2">
          <button onClick={() => setSelected(INGREDIENT_KEYS[(selectedIdx - 1 + 8) % 8])}
            className="flex-1 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-xs">← Prev</button>
          <button onClick={() => setSelected(INGREDIENT_KEYS[(selectedIdx + 1) % 8])}
            className="flex-1 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-xs">Next →</button>
        </div>

        {/* Transform panel */}
        <div className="bg-gray-900 rounded p-3 flex flex-col gap-2">
          <div className="text-yellow-400 font-bold mb-1">{LABELS[selected]}</div>

          {/* Position */}
          <div className="text-gray-400 text-xs mb-0.5">POSITION</div>
          {(["px","py","pz"] as const).map((ax, i) => (
            <NudgeRow key={ax} label={axisLabels[i]} color={axisColors[i]}
              value={currentT.position[i]}
              onMinus={() => nudge(ax, -P_STEP)} onPlus={() => nudge(ax, P_STEP)} />
          ))}

          {/* Rotation */}
          <div className="text-gray-400 text-xs mt-2 mb-0.5">ROTATION (rad / °)</div>
          {(["rx","ry","rz"] as const).map((ax, i) => (
            <NudgeRow key={ax} label={axisLabels[i]} color={axisColors[i]}
              value={currentT.rotation[i]}
              onMinus={() => nudge(ax, -R_STEP)} onPlus={() => nudge(ax, R_STEP)}
              display={`${currentT.rotation[i].toFixed(4)} / ${toDeg(currentT.rotation[i])}°`} />
          ))}

          {/* Scale */}
          <div className="text-gray-400 text-xs mt-2 mb-0.5">SCALE</div>

          {/* Uniform scale */}
          <div className="flex items-center gap-2">
            <span className="w-4 font-bold text-yellow-400">∀</span>
            <button onClick={() => nudge("su", -S_STEP)} className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded text-center leading-none">−</button>
            <span className="flex-1 text-center bg-gray-800 rounded px-1 py-0.5 text-xs">
              {currentT.scale[0].toFixed(4)} <span className="text-gray-500">(uniform)</span>
            </span>
            <button onClick={() => nudge("su", S_STEP)} className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded text-center leading-none">+</button>
          </div>

          {/* Per-axis scale */}
          {(["sx","sy","sz"] as const).map((ax, i) => (
            <NudgeRow key={ax} label={axisLabels[i]} color={axisColors[i]}
              value={currentT.scale[i]}
              onMinus={() => nudge(ax, -S_STEP)} onPlus={() => nudge(ax, S_STEP)} />
          ))}
        </div>

        {/* Actions */}
        <button onClick={resetSelected}
          className="py-1.5 bg-red-900 hover:bg-red-800 rounded text-xs text-red-300 font-bold">
          Reset {LABELS[selected]}
        </button>
        <button onClick={copyTransform}
          className="py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-xs text-green-400 font-bold">
          📋 Copy Transform
        </button>
        <button onClick={exportConfig}
          className="py-1.5 bg-yellow-500 hover:bg-yellow-400 rounded text-xs text-black font-bold">
          💾 Export BurgerConfig.ts
        </button>

        <div className="text-gray-600 text-xs mt-2 leading-relaxed">
          Press <kbd className="bg-gray-800 px-1 rounded">D</kbd> to toggle.<br />
          Click ingredient in 3D view to select.<br />
          <span className="text-yellow-600">∀</span> = uniform scale all axes.<br />
          Export downloads updated config file.
        </div>
      </div>
    </div>
  );
}
