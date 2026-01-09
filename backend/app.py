from langchain_core.messages import AIMessage
from langchain_ollama import ChatOllama
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import MessagesState

llm = ChatOllama(model="llama3")

def llm_node(state: MessagesState):
    
    response = llm.invoke(state["messages"])
    return {"messages": [response]}

graph = StateGraph(MessagesState)
graph.add_node("llm_node", llm_node)
graph.add_edge(START, "llm_node")
graph.add_edge("llm_node", END)
app = graph.compile()

if __name__ == "__main__":
    result = app.invoke(
        {"messages": [{"role": "user", "content": "who are you!"}]}
    )
    print(result)
