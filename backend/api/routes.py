from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from langchain_core.messages import HumanMessage
from agents.graph import app as langgraph_app

router = APIRouter()

# --- Data Models ---
class ChatRequest(BaseModel):
    text: str
    sender: str
    lat: Optional[float] = None
    lng: Optional[float] = None
    zoom: Optional[int] = None

class ChatResponse(BaseModel):
    text: str
    sender: str = "GOVRS_BOT"
    # The backend can optionally return coordinates to move the user's map
    lat: Optional[float] = None
    lng: Optional[float] = None
    zoom: Optional[int] = None

# --- Endpoints ---
@router.post("/chat", response_model=ChatResponse)
async def process_chat(request: ChatRequest):
    """
    Receives frontend state, passes it through the Gemini LangGraph pipeline,
    and returns the AI's final analytical response.
    """
    
    # 1. Prepare the state input for LangGraph
    # We wrap the user's raw text in a LangChain HumanMessage
    inputs = {
        "messages": [HumanMessage(content=request.text)],
        "lat": request.lat,
        "lng": request.lng,
        "zoom": request.zoom
    }

    # 2. Invoke the multi-agent graph
    # This runs the LLM, triggers tools if needed, and loops until finished
    result = langgraph_app.invoke(inputs)

    # 3. Extract the final message content from the graph's state
    final_message = result["messages"][-1].content

    return ChatResponse(
        text=final_message,
        sender="GOVRS_AGENT",
        lat=request.lat,
        lng=request.lng,
        zoom=request.zoom
    )