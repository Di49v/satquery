import os
from dotenv import load_dotenv
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langchain_core.messages import SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI

from agents.state import AgentState
from agents.tools import registry_tools

load_dotenv()

# Initialize Gemini as the orchestrator and fusion engine
llm = ChatGoogleGenerativeAI(model="gemini-3.7-flash", temperature=0)
llm_with_tools = llm.bind_tools(registry_tools)

def router_node(state: AgentState):
    messages = state["messages"]
    lat = state.get("lat")
    lng = state.get("lng")
    
    # The prompt instructs Gemini to execute the MoE workflow sequentially
    system_prompt = SystemMessage(
        content=(
            "You are the SatQuery AI Router and Evidence Fusion Agent. "
            f"The user is querying coordinates: [LAT: {lat}, LON: {lng}].\n\n"
            "Workflow Instructions:\n"
            "1. If you do not have STAC metadata, call fetch_stac_metadata first.\n"
            "2. Once you have the preview_url, route the query to the appropriate specialist tool "
            "(GeoChat, EarthDial, TEOChat, DeltaVLM, or MM-OVSeg) based on the image modality and task.\n"
            "3. After the specialist returns evidence, synthesize a final textual answer.\n"
            "Do not hallucinate evidence. Always preserve model attribution in your final response."
        )
    )
    
    response = llm_with_tools.invoke([system_prompt] + messages)
    return {"messages": [response]}

def should_continue(state: AgentState):
    """Determines whether to execute a tool or end the graph."""
    last_message = state["messages"][-1]
    
    if last_message.tool_calls:
        return "tools"
    return END

# Build the graph
workflow = StateGraph(AgentState)

# Add the AI node and the execution node
workflow.add_node("router", router_node)
workflow.add_node("tools", ToolNode(registry_tools))

# Define the flow
workflow.set_entry_point("router")
workflow.add_conditional_edges("router", should_continue, ["tools", END])
workflow.add_edge("tools", "router")

# Compile into an executable application
app = workflow.compile()