# Text2Reel: AI Cinematic Storyboarder

Text2Reel is a high-fidelity platform designed for the intelligent generation of cinematic video scenes from natural language prompts. By bridging the gap between imagination and rhythmic visual reality, it enables creators to transform concepts into frame-perfect storyboards with dynamic text overlays and choreographed animations.

![Text2Reel Banner](./public/text2reel.png)

## Overview

Originally conceptualized as a modular component, Text2Reel has evolved into a standalone production environment focused on cinematic depth and seamless AI collaboration. It leverages cutting-edge LLMs and advanced browser-based rendering to deliver a professional-grade creative workflow.

### Core Capabilities

*   **Neural Scene Generation**: Utilizing Llama 3.3 (via Groq) to intelligently decompose narrative prompts into granular, actionable scene definitions.
*   **Live Cinematic Preview**: An integrated high-performance rendering engine built on Remotion for real-time, frame-accurate previews.
*   **High-Fidelity Editor**: A specialized interface for fine-tuning scene attributes, including typography, timing, and visual transition logic.
*   **Performance Engineering**: Optimized with Zustand for zero-latency state management and Tailwind CSS for responsive, performant layouts.

## Branding

![Text2Reel Logo](./public/logo.png)

*A premium product designed by the Context Engineering team.*

## Deployment & Getting Started

### Prerequisites

*   Node.js 18+
*   Groq API Key (for neural processing)

### Local Development

1.  **Clone the Repository and Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Configure Environment Variables**:
    Create a `.env.local` file in the root directory:
    ```env
    GROQ_API_KEY=your_processing_key_here
    ```

3.  **Synchronize Database (Prisma)**:
    ```bash
    npx prisma generate
    ```

4.  **Initialize Development Server**:
    ```bash
    npm run dev
    ```

### Production Build

The production build automatically synchronizes the database schema before compilation:
```bash
npm run build
```

## Technical Architecture

*   **Framework**: Next.js 15 (App Router)
*   **Rendering Engine**: Remotion
*   **Inference**: Groq SDK (Llama 3.3)
*   **Design System**: MUI Core + Tailwind CSS + Framer Motion
*   **State Management**: Zustand

---

Developed by **Shakiran**
*Systems & Experience Engineer*
