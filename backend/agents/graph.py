from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode

from agents.state import AgentState
from agents.tools import registry_tools
from agents.nodes import router_node, synthesis_node, should_continue

# Build the graph
workflow = StateGraph(AgentState)

# Add the AI nodes and the tool execution node
workflow.add_node("router", router_node)
workflow.add_node("tools", ToolNode(registry_tools))
workflow.add_node("synthesize", synthesis_node)

# Define the flow
workflow.set_entry_point("router")

# The router either calls tools or moves to synthesis
workflow.add_conditional_edges("router", should_continue, ["tools", "synthesize"])

# Tools always return their output back to the router to evaluate next steps
workflow.add_edge("tools", "router")

# Synthesis is the final step before the graph completes
workflow.add_edge("synthesize", END)

# Compile into an executable application
app = workflow.compile()