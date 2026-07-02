# 🍔 Premium Burger Experience

<div align="center">

![Burger Hero](https://img.shields.io/badge/3D-WebGL-orange?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![React Three Fiber](https://img.shields.io/badge/R3F-8.16-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=for-the-badge&logo=typescript)

**A stunning, scroll-driven 3D burger experience built with Next.js and React Three Fiber**

[View Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## ✨ Features

### 🎨 **Immersive 3D Experience**
- **Interactive 3D Burger Model** - Photorealistic burger with 8 meticulously crafted layers
- **Scroll-Driven Animations** - Smooth, physics-based animations tied to scroll position
- **Cinematic Camera Movement** - Dynamic camera angles that enhance the storytelling
- **Premium Studio Lighting** - HDR lighting setup with multiple light sources for photorealistic rendering

### 🚀 **Performance Optimized**
- **KTX2 Texture Compression** - 50-70% smaller textures using Basis Universal
- **Efficient Model Loading** - Smart caching and lazy loading strategies
- **Smooth Scrolling** - Lenis integration for premium scroll experience
- **Mobile Responsive** - Optimized for all devices with adaptive scaling

### 📖 **Interactive Storytelling**
- **Layer-by-Layer Reveal** - Each ingredient gets its spotlight moment
- **Rich Editorial Content** - Detailed descriptions and stats for each ingredient
- **Explosion Animation** - Watch the burger assemble and disassemble
- **Dynamic Text Overlays** - Synchronized text animations with 3D scene

### 🎭 **Modern UI/UX**
- **Glass Morphism Design** - Frosted glass effects and modern aesthetics
- **Smooth Navigation** - Intelligent scroll-to-section navigation
- **Responsive Typography** - Fluid type scaling with clamp()
- **Dark Theme** - Premium dark theme with orange accents

---

## 🛠️ Tech Stack

### **Core Framework**
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://react.dev/)** - UI library with concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development

### **3D Graphics**
- **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber)** - React renderer for Three.js
- **[Three.js](https://threejs.org/)** - WebGL 3D library
- **[@react-three/drei](https://github.com/pmndrs/drei)** - Useful helpers for R3F
- **[KTX2 / Basis Universal](https://github.com/BinomialLLC/basis_universal)** - Texture compression

### **Animation & Interaction**
- **[Framer Motion](https://www.framer.com/motion/)** - Production-ready animation library
- **[Lenis](https://lenis.studiofreight.com/)** - Smooth scroll library

### **Styling**
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **Custom CSS** - Advanced effects and animations

---

## 📦 Project Structure

```
modern-website/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
│
├── components/
│   ├── burger/                  # Burger 3D components
│   │   ├── Ingredient.tsx       # Individual ingredient mesh
│   │   └── DevEditor.tsx        # Developer mode editor
│   │
│   ├── experience/              # Main 3D experience
│   │   ├── CinematicExperience.tsx  # Scroll controller
│   │   ├── CinematicScene.tsx       # 3D scene with burger
│   │   └── TextOverlay.tsx          # Scroll-driven text
│   │
│   ├── layout/                  # Layout components
│   │   ├── Navbar.tsx           # Navigation bar
│   │   └── Footer.tsx           # Footer with CTA
│   │
│   ├── providers/               # Context providers
│   │   └── SmoothScrollProvider.tsx  # Lenis integration
│   │
│   └── ui/                      # UI components
│       └── PageLoader.tsx       # Loading screen
│
├── config/
│   └── BurgerConfig.ts          # 3D model configuration
│
├── hooks/
│   ├── useGLTFWithKTX2.ts       # KTX2 model loader hook
│   └── useScrollProgress.ts      # Scroll progress tracker
│
├── public/
│   ├── models/                  # 3D models (.glb)
│   │   ├── *-compressed.glb    # KTX2 compressed models
│   │   └── *.glb               # Original models
│   │
│   └── basis/                   # Basis Universal transcoder
│       ├── basis_transcoder.js
│       └── basis_transcoder.wasm
│
└── types/
    └── index.ts                 # TypeScript type definitions
```

---

## 🚀 Getting Started

### **Prerequisites**

- Node.js 18+ and npm/yarn/pnpm
- Modern browser with WebGL 2.0 support

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/premium-burger-experience.git
   cd premium-burger-experience
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### **Build for Production**

```bash
npm run build
npm start
```

---

## 🎮 Developer Mode

Press **`D`** key to toggle Developer Mode with:
- Real-time ingredient position/rotation/scale editing
- Transform controls (translate, rotate, scale)
- Export configuration to console
- Visual debugging tools

---

## 🎨 Customization

### **Burger Configuration**

Edit `config/BurgerConfig.ts` to customize:
- Ingredient positions, rotations, and scales
- Explosion animations
- Colors and names
- Model file paths

```typescript
export const BURGER_CONFIG: Record<string, IngredientConfig> = {
  topBun: {
    position: new Vector3(0.0759, 2.2519, 0.0898),
    rotation: new Euler(-0.3563, 0.7054, 0.2331),
    scale: new Vector3(0.4, 0.4, 0.4),
    explodedPosition: new Vector3(0, 6, 0),
    name: "top bu-compressed",
    displayName: "Brioche Top",
    description: "Golden, toasted, perfectly soft",
    color: "#FFB627",
  },
  // ... more ingredients
};
```

### **Scroll Timing**

Adjust scroll phases in `CinematicScene.tsx` and `TextOverlay.tsx`:

```typescript
const HERO_END      = 0.04;  // Hero section ends
const OPEN_END      = 0.10;  // Burger opens
const STORY_START   = 0.12;  // Ingredient story begins
const STORY_END     = 0.88;  // Story ends
const ASSEMBLE_END  = 0.90;  // Assembly complete
```

### **Text Content**

Edit ingredient stories in `TextOverlay.tsx`:

```typescript
const INGREDIENT_COPY: Record<string, {
  label: string;
  headline: string;
  sub: string;
  detail: string;
  stat?: string;
}> = {
  // ... your content
};
```

---

## 🖼️ Adding New 3D Models

### **1. Prepare Your Model**

- Export from Blender/Maya as `.glb`
- Optimize geometry (< 50k polygons recommended)
- Bake textures (2K max resolution)

### **2. Compress Textures with KTX2**

```bash
npm install -g @gltf-transform/cli

gltf-transform etc1s input.glb output-compressed.glb
```

### **3. Add to Project**

1. Place `output-compressed.glb` in `public/models/`
2. Add configuration to `BurgerConfig.ts`
3. Add to `KEYS` array in `CinematicScene.tsx`

---

## 📱 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 90+     | ✅ Full Support |
| Firefox | 88+     | ✅ Full Support |
| Safari  | 14+     | ✅ Full Support |
| Edge    | 90+     | ✅ Full Support |
| Mobile Safari | 14+ | ✅ Full Support |
| Chrome Android | 90+ | ✅ Full Support |

**Requirements:**
- WebGL 2.0 support
- JavaScript enabled
- Minimum 2GB RAM recommended

---

## ⚡ Performance Tips

### **For Development**
- Use `npm run dev` for hot reload
- Press `D` to access DevEditor for tweaking
- Monitor FPS in browser DevTools

### **For Production**
- Run `npm run build` for optimized bundle
- Enable gzip/brotli compression on server
- Use CDN for static assets
- Consider lazy loading for non-critical components

### **Model Optimization**
- Keep polygon count under 50k per model
- Use power-of-two texture dimensions (512, 1024, 2048)
- Compress textures with KTX2/Basis Universal
- Remove unused vertices and materials

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[Three.js](https://threejs.org/)** - Amazing 3D library
- **[Poimandres](https://pmnd.rs/)** - React Three Fiber and Drei
- **[Lenis](https://lenis.studiofreight.com/)** - Smooth scrolling
- **[Khronos Group](https://www.khronos.org/)** - Basis Universal compression
- **[Vercel](https://vercel.com/)** - Deployment platform

---

## 📧 Contact

**Your Name** - [@yourtwitter](https://twitter.com/yourtwitter)

**Project Link:** [https://github.com/yourusername/premium-burger-experience](https://github.com/yourusername/premium-burger-experience)

---

<div align="center">

**Made with ❤️ and 🍔**

[⬆ Back to Top](#-premium-burger-experience)

</div>
