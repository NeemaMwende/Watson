from langgraph.graph import StateGraph, END
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from typing import TypedDict, List, Annotated
import operator
from llm import get_llm, get_embeddings, LEGAL_ASSISTANT_PROMPT, SCORING_PROMPT
import httpx
from bs4 import BeautifulSoup
import os

# State definition
class GraphState(TypedDict):
    question: str
    documents: List[str]
    web_results: List[str]
    answer: str
    needs_web: bool
    relevance_scores: List[float]

# Initialize vector store
def init_vectorstore(doc_path: str = "./data/legal_docs"):
    """Initialize or load the vector store from legal documents"""
    persist_dir = "./chroma_db"
    embeddings = get_embeddings()
    
    if os.path.exists(persist_dir):
        return Chroma(persist_directory=persist_dir, embedding_function=embeddings)
    
    # Load and process documents
    if os.path.exists(doc_path):
        loader = DirectoryLoader(
            doc_path, 
            glob="**/*.pdf", 
            loader_cls=PyPDFLoader
        )
        docs = loader.load()
        
        # Split documents
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        splits = splitter.split_documents(docs)
        
        # Create vectorstore
        vectorstore = Chroma.from_documents(
            documents=splits,
            embedding=embeddings,
            persist_directory=persist_dir
        )
        return vectorstore
    
    # Return empty vectorstore if no docs
    return Chroma(embedding_function=embeddings, persist_directory=persist_dir)

vectorstore = init_vectorstore()

# Node functions
def retrieve_documents(state: GraphState) -> GraphState:
    """Retrieve relevant documents from vector store"""
    question = state["question"]
    docs = vectorstore.similarity_search(question, k=4)
    state["documents"] = [doc.page_content for doc in docs]
    return state

def score_documents(state: GraphState) -> GraphState:
    """Score document relevance"""
    llm = get_llm(temperature=0)
    scores = []
    
    for doc in state["documents"]:
        try:
            prompt = SCORING_PROMPT.format(query=state["question"], document=doc[:500])
            score_str = llm.invoke(prompt).strip()
            score = float(score_str)
            scores.append(score)
        except:
            scores.append(5.0)  # Default score
    
    state["relevance_scores"] = scores
    # Check if we need web search (low scores)
    state["needs_web"] = max(scores) < 7.0 if scores else True
    return state

def web_search(state: GraphState) -> GraphState:
    """Perform web search for additional context"""
    if not state["needs_web"]:
        state["web_results"] = []
        return state
    
    query = state["question"] + " Indian law case"
    search_url = f"https://www.google.com/search?q={query}"
    
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        response = httpx.get(search_url, headers=headers, timeout=5)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract snippets
        results = []
        for g in soup.find_all('div', class_='BNeawe')[:3]:
            results.append(g.get_text())
        
        state["web_results"] = results
    except:
        state["web_results"] = []
    
    return state

def generate_answer(state: GraphState) -> GraphState:
    """Generate final answer using all context"""
    llm = get_llm()
    
    # Combine all context
    context_parts = []
    
    # Add high-scoring documents
    for doc, score in zip(state["documents"], state["relevance_scores"]):
        if score >= 5.0:
            context_parts.append(f"[Relevance: {score}/10]\n{doc}")
    
    # Add web results
    if state["web_results"]:
        context_parts.append("\nWeb Search Results:\n" + "\n".join(state["web_results"]))
    
    context = "\n\n---\n\n".join(context_parts) if context_parts else "No specific documents found."
    
    # Generate response
    prompt = LEGAL_ASSISTANT_PROMPT.format(
        context=context,
        question=state["question"]
    )
    
    state["answer"] = llm.invoke(prompt)
    return state

# Build the graph
def create_watson_graph():
    """Create the LangGraph workflow"""
    workflow = StateGraph(GraphState)
    
    # Add nodes
    workflow.add_node("retrieve", retrieve_documents)
    workflow.add_node("score", score_documents)
    workflow.add_node("web_search", web_search)
    workflow.add_node("generate", generate_answer)
    
    # Add edges
    workflow.set_entry_point("retrieve")
    workflow.add_edge("retrieve", "score")
    workflow.add_edge("score", "web_search")
    workflow.add_edge("web_search", "generate")
    workflow.add_edge("generate", END)
    
    return workflow.compile()

# Create the graph instance
graph = create_watson_graph()