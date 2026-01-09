from flask import Flask, request, jsonify
from langchain_core.messages import AIMessage, HumanMessage
from langchain_community.chat_models import ChatOllama
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import MessagesState

app = Flask(__name__)

llm = ChatOllama(model="llama3")

def llm_node(state: MessagesState):

    response = llm.invoke(state["messages"])
    return {"messages": [response]}

graph = StateGraph(MessagesState)
graph.add_node("llm_node", llm_node)
graph.add_edge(START, "llm_node")
graph.add_edge("llm_node", END)
compiled_graph = graph.compile()

# Flask endpoint to call the graph
@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    if not data or "messages" not in data:
        return jsonify({"error": "Please provide 'messages' in request body"}), 400

    # Invoke LangGraph
    result = compiled_graph.invoke({"messages": data["messages"]})

    # Convert output to simple dicts for JSON response
    output = []
    for msg in result["messages"]:
        output.append({
            "role": "user" if isinstance(msg, HumanMessage) else "assistant",
            "content": msg.content
        })

    return jsonify({"messages": output})
s
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
