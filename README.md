# SatQuery AI (GovRS Observation Portal)

SatQuery AI is a multi-tier spatial data infrastructure project designed for advanced geographical analysis and environmental monitoring. It bridges live AWS Earth Search STAC telemetry with a Mixture of Experts (MoE) Vision-Language Model (VLM) architecture.

## System Architecture

The application operates on a decoupled full-stack architecture:
- **Frontend (Next.js / React):** A secure, government-styled dashboard featuring an interactive Leaflet map, a dynamic Data Query Interface (DQI), and a spatial communication widget (GeoChat Comms). State is managed via Zustand.
- **Backend (FastAPI / Python):** A high-concurrency API server executing a LangGraph multi-agent workflow. 

## The Mixture of Experts (MoE) Pipeline

The backend utilizes an agentic routing pattern driven by Google's `gemini-3.7-flash` acting as the cognitive engine. It does not perform spatial analysis directly; instead, it routes tasks to specialized remote-sensing models.

1. **Input/Geo Checker:** Parses coordinates and fetches the corresponding AWS STAC scene.
2. **Router Agent (Gemini):** Analyzes the user's natural language query and STAC metadata to determine the required analysis type (e.g., Single Image VQA, Temporal Change, Optical/SAR fusion).
3. **Specialist Execution:** The system invokes the appropriate domain-specific model:
   - `GeoChat-7B`: Region grounding, optical VQA, and captioning.
   - `EarthDial-4B (RGB/MS)`: Multispectral and standard scene understanding.
   - `TEOChat` & `DeltaVLM`: Bi-temporal change reasoning and description.
   - `MM-OVSeg`: Paired Optical + SAR multimodal segmentation.
4. **Evidence Fusion Agent (Gemini):** Synthesizes outputs from the specialists with cloud cover metadata into a final, highly accurate natural language report, preserving model attribution.

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+ (managed via `uv`)
- Hugging Face API Token (for GeoChat inference)
- Google Gemini API Key (for LangGraph Router/Fusion)

### Environment Setup
Create a `.env` file in the `backend/` directory:
```env
GOOGLE_API_KEY="your_gemini_key"
HUGGINGFACE_API_TOKEN="your_hf_token"

```

### Running the Stack

1. **Start the Frontend:**
```bash
cd frontend
npm install
npm run dev

```


2. **Start the Backend:**
```bash
cd backend
uv sync
uvicorn main:app --reload --port 8000

```