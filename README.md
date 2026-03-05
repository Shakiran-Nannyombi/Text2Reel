# 🎬 Text2Reel: AI Cinematic Storyboarder

> "Turning text into rhythmic visual narratives, one prompt at a time."

**Text2Reel** is a high-fidelity AI video scene generator. It transforms natural language descriptions into a sequence of choreographed scenes, complete with synced text overlays, dynamic background animations, and custom icons.

![Text2Reel Preview](/text2reel.png)

## 🌌 The Sanctuary
Originally part of *The Arcade*, Text2Reel has now evolved into its own standalone sanctuary. It's built for speed, cinematic depth, and seamless AI collaboration.

### ✨ Key Features
- **🧠 Neural Scene Generation**: Powered by **Llama 3.3 (via Groq)** to intelligently break down your vision into specific scenes.
- **🎬 Live Cinematic Preview**: Built on **Remotion**, providing a frame-perfect rendering engine within the browser.
- **🛠️ High-FID Editor**: A granular scene table to tweak animations, colors, icons, and timing.
- **⚡ Performance First**: Zero-latency state management with **Zustand** and optimized layouts with **Tailwind v4**.

## 🚀 Getting Started

1. **Clone & Install**:
   ```bash
   npm install
   ```

2. **Fuel the AI**:
   Create a `.env.local` file and add your Groq API key:
   ```env
   GROQ_API_KEY=your_key_here
   ```

3. **Launch the Engine**:
   ```bash
   npm run dev
   ```

## 🧪 Technical DNA
- **Framework**: Next.js 15+
- **Video Engine**: Remotion
- **AI**: Groq SDK (Llama 3.3)
- **UI Architecture**: MUI + Tailwind CSS v4 + Framer Motion
- **State**: Zustand + React Table & Form

---

Created with passion by **Shakiran**.  
*UI Gardener • Cinematic Engineer*
