import os
from dotenv import load_dotenv
from langchain_core.messages import SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI

from agents.state import AgentState
from agents.tools import registry_tools
from agents.schema import SatQueryResponse

load_dotenv()

# Initialize LLMs
llm = ChatGoogleGenerativeAI(model="gemini-3.7-flash", temperature=0)
llm_with_tools = llm.bind_tools(registry_tools)

# Bind the final synthesis LLM to the strict Pydantic JSON schema expected by your Next.js UI
structured_llm = llm.with_structured_output(SatQueryResponse)

def router_node(state: AgentState):
    """Handles the reasoning and routing to specific MoE tools."""
    messages = state["messages"]
    lat = state.get("lat")
    lng = state.get("lng")
    
    system_prompt = SystemMessage(
        content=(
            "You are the SatQuery AI Router and Evidence Fusion Agent. "
            f"The user is querying coordinates: [LAT: {lat}, LON: {lng}].\n\n"
            "Workflow Instructions:\n"
            "1. If you do not have STAC metadata, call fetch_stac_metadata first.\n"
            "2. Once you have the preview_url, route the query to the appropriate specialist tool "
            "(GeoChat, EarthDial, TEOChat, DeltaVLM, or MM-OVSeg) based on the image modality and task.\n"
            "3. Do not format the final output yet; just execute the necessary tools."
        )
    )
    
    response = llm_with_tools.invoke([system_prompt] + messages)
    return {"messages": [response]}

def synthesis_node(state: AgentState):
    """Runs after all tools finish to package the history into strict JSON."""
    synthesis_prompt = SystemMessage(
        content=(
            "You are the SatQuery Synthesis Agent. Review the conversation history and tool outputs above. "
            "Extract the final answer into the 'text' field. "
            "If spatial data, stats, or image URLs were generated, put them in the 'evidence' field. "
            "Write a brief summary of the steps taken into the 'trace' array."
        )
    )
    
    messages_to_synthesize = [synthesis_prompt] + state["messages"]
    result = structured_llm.invoke(messages_to_synthesize)
    
    # structured_llm returns a Pydantic object. Dump it to a dict to append to AgentState.
    return {"final_parsed_response": result.model_dump()}

def should_continue(state: AgentState):
    """Determines whether to execute a tool or proceed to JSON synthesis."""
    last_message = state["messages"][-1]
    
    if last_message.tool_calls:
        return "tools"
    # If no more tools are needed, move to the synthesis node instead of END
    return "synthesize"