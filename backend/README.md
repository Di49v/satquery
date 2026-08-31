# SatQuery API & Agent Backend

This directory houses the FastAPI server and the LangGraph multi-agent state machine.

## Directory Structure
- `main.py`: FastAPI application entry point and CORS configuration.
- `api/routes.py`: Endpoint definitions handling frontend requests (e.g., `POST /api/v1/chat`).
- `agents/`:
  - `state.py`: Defines the `TypedDict` for the LangGraph state.
  - `graph.py`: Compiles the nodes and edges for the routing and fusion pipeline.
  - `tools.py`: Contains API wrappers for Hugging Face VLMs and `pystac_client` logic.
- `services/`: (Legacy/Utility) Contains raw logic decoupled from LangGraph if needed for testing.

## Dependency Management
This project uses `uv` for ultra-fast dependency resolution.
- Add packages: `uv add <package>`
- Run server: `uv run uvicorn main:app --reload`