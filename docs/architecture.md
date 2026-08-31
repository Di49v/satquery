# Multi-Agent Architecture & LangGraph Implementation

## Overview
The SatQuery backend uses `LangGraph` to manage the state and control flow of the remote-sensing analysis pipeline. The state machine ensures that data strictly follows the ingestion, routing, execution, and fusion path without hallucinating capabilities.

## State Definition (`AgentState`)
The core state dictionary passed between nodes:
- `messages`: Standard LangChain message sequence.
- `lat` / `lng`: Target coordinates.
- `stac_metadata`: JSON payload containing scene ID, datetime, and asset URLs.
- `selected_specialists`: List of models determined by the Router.
- `specialist_outputs`: Dictionary holding the raw inferences from the VLM models.

## Node Execution Flow

1. **`fetch_stac_node`**:
   Connects to `https://earth-search.aws.element84.com/v1`. Retrieves the latest Sentinel-2 (Optical) or Sentinel-1 (SAR) item intersecting the coordinates. Appends `stac_metadata` to the state.

2. **`router_node`**:
   Invokes `gemini-3.7-flash` with a strict system prompt. The LLM reads the user query and the `stac_metadata` modality, outputting a structured tool call selecting one or more models (e.g., `["GeoChat", "MM-OVSeg"]`).

3. **`specialist_execution_node` (Parallelizable)**:
   A conditional edge routes the state to the designated API wrappers.
   - Example: If `GeoChat` is selected, the node POSTs the query and the STAC preview URL to the Hugging Face Inference API (`MBZUAI/geochat-7B`).

4. **`fusion_node`**:
   Invokes `gemini-3.7-flash` a second time. It receives the `specialist_outputs`, the original query, and the `stac_metadata`. It synthesizes the findings, checks for contradictions, and formats the response for the frontend.

## Adding a New Specialist Model
To integrate a new VLM (e.g., a new local SAR-specific model):
1. Define the API wrapper in `backend/agents/tools.py`.
2. Update the Router's system prompt in `backend/agents/graph.py` to include the new model in its registry choices.
3. Add the conditional mapping logic to the `specialist_execution_node`.