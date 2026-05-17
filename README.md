AI-Powered Chat-Based Layout Agent

An intelligent web application that allows users to modify design layouts through natural language conversation. The application uses a hybrid architecture where the LLM performs semantic intent extraction while deterministic backend functions safely execute geometric layout transformations.

Architecture

This project is built using a strict Hybrid Architecture:

Frontend (React/Vite): Handles the UI, chat history, live wireframe rendering, and JSON visualization.

LLM Engine (OpenAI): Processes natural language, understands context (e.g., "Make it bigger"), and maps intent to strict structured JSON actions. It never calculates raw coordinates.

Deterministic Backend Engine: Receives structured actions (e.g., MOVE_ELEMENT to top), queries a Semantic Map to find standard node IDs, and performs mathematical updates on Normalized Coordinates (nx, ny, nw, nh).

Why Normalized Coordinates?

We use nx, ny (normalized x, y anchored at center) and nw, nh (normalized width, height) scaling from 0.0 to 1.0 relative to the parent canvas. This makes Aspect Ratio conversions entirely seamless. If the aspect ratio changes from 1:1 to 9:16, the engine simply updates the canvas dimensions and applies x = nx * new_width, keeping layout composition mathematically perfect without LLM hallucination.

Tech Stack

Frontend: React.js, Vite, TailwindCSS, Lucide React

Backend Model: Node.js, Express.js (Architecture ready)

AI Integration: OpenAI API (gpt-4o-mini for fast structured JSON generation)

Project Setup (Local VS Code Assignment)

The code generated in this sandbox is structured so that you can easily split it into your requested folder structure.

mkdir ai-layout-agent && cd ai-layout-agent

Set up the frontend:

npm create vite@latest frontend -- --template react
cd frontend
npm install tailwindcss postcss autoprefixer lucide-react
npx tailwindcss init -p


Extract the parts of App.jsx cleanly into the backend/ directory using the provided comment headers (e.g., --- backend/services/transformationEngine.js ---).

Set up the backend:

cd ../backend
npm init -y
npm install express cors dotenv


Example Prompts

"Convert this design to 9:16"

"Move headline to top"

"Make headline smaller"

"Keep product large"

"Move offer badge higher"

"Center the product"

"Make discount badge bigger"

"Change headline color to red"

"Make it smaller" (Tests follow-up context!)