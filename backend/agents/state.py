from typing import Annotated, Sequence, TypedDict, Any, Dict, Optional
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages

class AgentState(TypedDict):
    # Appends new messages rather than overwriting the history
    messages: Annotated[Sequence[BaseMessage], add_messages]
    
    # Spatial parameters from the frontend map
    lat: float
    lng: float
    zoom: int
    
    # Optional metadata populated by the STAC fetcher tool
    stac_metadata: Optional[Dict[str, Any]]