# 🎬 CodeCinematic

> **Programmatic video generation engine powered by React & Remotion.** Transform code into broadcast-ready motion graphics, product teasers, and cinematic showreels at 60 FPS.

## 📺 Preview

<video src="out/showreel.mp4" autoplay loop muted controls width="100%"></video>

*(If video doesn't play directly, check out [out/showreel.mp4](out/showreel.mp4))*

---

## ✨ Features

- **Pure TypeScript & React**: Build complex motion graphics using familiar component architecture and state.
- **Spring Physics**: Organic, bouncy animations without manual timeline keyframing.
- **Live Code Editor Scene**: Simulated IDE window with live syntax highlighting and component rendering output.
- **DOOM Eternal HUD Vibe**: High-energy gaming simulation scene complete with health, armor, crosshair, and kill feed.
- **Vector Animations**: Smooth SVG icon animations powered by `react-useanimations`.
- **60 FPS Hardware Export**: Render broadcast-quality MP4 videos directly from your codebase using FFmpeg.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run Remotion Studio for browser preview
npx remotion studio src/index.ts

# Render final MP4 video
npx remotion render Showreel out/showreel.mp4
```

---

## 🛠️ Tech Stack

- [Remotion](https://www.remotion.dev/) — Create videos programmatically in React
- [React 18](https://react.dev/) — UI library
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [react-useanimations](https://github.com/Coder1000/react-useanimations) — Animated SVG vector icons

---

## 📜 License

MIT License — Feel free to use and adapt for your own projects!
