import os
from dotenv import load_dotenv
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langchain_core.messages import SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI

from agents.state import AgentState
from agents.tools import spatial_tools

# Load environment variables (reads your .env file)
load_dotenv()

# 1. Initialize the Gemini LLM and bind our tools
llm = ChatGoogleGenerativeAI(model="gemini-3.7-flash", temperature=0)
llm_with_tools = llm.bind_tools(spatial_tools)

# 2. Define the Agent Node
def call_model(state: AgentState):
    messages = state["messages"]
    lat = state.get("lat")
    lng = state.get("lng")
    
    # Inject a system prompt dynamically containing the user's current map coordinates
    system_prompt = SystemMessage(
        content=(
            "You are a highly capable spatial analysis AI for the GovRS platform. "
            "You assist analysts with remote sensing data, telemetry, and GIS queries. "
            f"The user's map is currently locked at coordinates: [LAT: {lat}, LON: {lng}]. "
            "If they ask 'what am I looking at', use the location tool with these coordinates. "
            "Always be concise, professional, and authoritative."
        )
    )
    
    # Prepend the system prompt to the message history
    response = llm_with_tools.invoke([system_prompt] + messages)
    
    # Return the response to be appended to the state's message list
    return {"messages": [response]}

# 3. Define the routing logic (Does it use a tool, or is it done?)
def should_continue(state: AgentState):
    last_message = state["messages"][-1]
    
    # If the LLM decided to call a tool, route to the 'tools' node
    if last_message.tool_calls:
        return "tools"
    
    # Otherwise, end the graph
    return END

# 4. Build and Compile the Graph
workflow = StateGraph(AgentState)

# Add the nodes
workflow.add_node("agent", call_model)
workflow.add_node("tools", ToolNode(spatial_tools))

# Define the edges
workflow.set_entry_point("agent")
workflow.add_conditional_edges("agent", should_continue, ["tools", END])
workflow.add_edge("tools", "agent")

# Compile into an executable application
app = workflow.compile()