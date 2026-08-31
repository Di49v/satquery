from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from langchain_core.messages import HumanMessage
from agents.graph import app as langgraph_app

router = APIRouter()

# --- Data Models matching Frontend Payload ---
class ChatRequest(BaseModel):
    text: str
    sender: str
    lat: Optional[float] = None
    lng: Optional[float] = None
    zoom: Optional[int] = None

class ChatResponse(BaseModel):
    text: str
    sender: str = "GOVRS_AGENT"
    # The backend can optionally return coordinates to move the user's map
    lat: Optional[float] = None
    lng: Optional[float] = None
    zoom: Optional[int] = None

# --- Endpoints ---
@router.post("/chat", response_model=ChatResponse)
async def process_chat(request: ChatRequest):
    """
    Receives frontend chat payloads and spatial context, runs the LangGraph 
    multi-agent workflow with Gemini and our MoE tool registry, and returns the final answer.
    """
    
    # 1. Package frontend request into the LangGraph AgentState format
    inputs = {
        "messages": [HumanMessage(content=request.text)],
        "lat": request.lat if request.lat is not None else 31.6340,  # Default fallback coordinate (Amritsar)
        "lng": request.lng if request.lng is not None else 74.8723,
        "zoom": request.zoom if request.zoom is not None else 11,
        "stac_metadata": None
    }

    try:
        # 2. Invoke the compiled LangGraph application
        # This will trigger Gemini to fetch STAC data, call the VLM tools, and fuse the response.
        result = langgraph_app.invoke(inputs)

        # 3. Extract the final AI message from the state history
        final_message = result["messages"][-1].content

        return ChatResponse(
            text=final_message,
            sender="GOVRS_AGENT",
            lat=request.lat,
            lng=request.lng,
            zoom=request.zoom
        )
        
    except Exception as e:
        # Graceful error handling ensuring the UI does not crash if an API token or model fails
        return ChatResponse(
            text=f"System Exception during MoE execution pipeline: {str(e)}",
            sender="SYSTEM_ERR",
            lat=request.lat,
            lng=request.lng,
            zoom=request.zoom
        )