from typing import Annotated, TypedDict, Sequence, Optional
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages

class AgentState(TypedDict):
    # The `add_messages` function appends new messages to the existing list rather than overwriting
    messages: Annotated[Sequence[BaseMessage], add_messages]
    
    # Spatial parameters synced from the frontend map
    lat: Optional[float]
    lng: Optional[float]
    zoom: Optional[int]