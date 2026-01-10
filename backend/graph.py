import os
import re
from typing import TypedDict, List, Literal
from langgraph.graph import StateGraph, END
from langchain_chroma import Chroma
from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from tavily import TavilyClient
from dotenv import load_dotenv

from llm import get_llm, get_embeddings
from llm import LEGAL_ASSISTANT_PROMPT, SCORING_PROMPT

load_dotenv()

# ---------------- STATE ---------------- #

class GraphState(TypedDict):
    question: str
    documents: List[str]
    web_results: List[str]
    answer: str
    needs_web: bool
    relevance_scores: List[float]

# ---------------- VECTOR STORE ---------------- #

def init_vectorstore():
    embeddings = get_embeddings()
    persist_dir = "./chroma_db"

    if os.path.exists(persist_dir):
        return Chroma(
            persist_directory=persist_dir,
            embedding_function=embeddings
        )

    loader = DirectoryLoader(
        "./data/legal_docs",
        glob="**/*.pdf",
        loader_cls=PyPDFLoader
    )

    docs = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    splits = splitter.split_documents(docs)

    return Chroma.from_documents(
        documents=splits,
        embedding=embeddings,
        persist_directory=persist_dir
    )

vectorstore = init_vectorstore()
tavily = TavilyClient(api_key=os.getenv("TAVILY_KEY"))

# ---------------- NODES ---------------- #

def retrieve_documents(state: GraphState):
    docs = vectorstore.similarity_search(state["question"], k=4)
    return {
        "documents": [d.page_content for d in docs]
    }

def score_documents(state: GraphState):
    llm = get_llm(temperature=0)
    scores = []

    for doc in state.get("documents", []):
        prompt = SCORING_PROMPT.format(
            query=state["question"],
            document=doc[:500]
        )

        raw = llm.invoke(prompt)
        match = re.search(r"\d+(\.\d+)?", raw)

        score = float(match.group()) if match else 5.0
        score = min(max(score, 0.0), 10.0)
        scores.append(score)

    needs_web = max(scores) < 7.0 if scores else True

    return {
        "relevance_scores": scores,
        "needs_web": needs_web
    }

def web_search(state: GraphState):
    if not state["needs_web"]:
        return {"web_results": []}

    query = f"site:wansomai.com {state['question']}"

    results = tavily.search(
        query=query,
        search_depth="advanced",
        max_results=5
    )

    snippets = [
        r.get("content", "")
        for r in results.get("results", [])
    ]

    return {"web_results": snippets}

def generate_answer(state: GraphState):
    llm = get_llm()

    context_parts = []

    for doc, score in zip(
        state.get("documents", []),
        state.get("relevance_scores", [])
    ):
        if score >= 7.0:
            context_parts.append(f"[Score {score}/10]\n{doc}")

    if state.get("web_results"):
        context_parts.append(
            "Web Results (WansomAI):\n" +
            "\n".join(state["web_results"])
        )

    context = "\n\n---\n\n".join(context_parts) or "No reliable legal sources found."

    prompt = LEGAL_ASSISTANT_PROMPT.format(
        context=context,
        question=state["question"]
    )

    return {
        "answer": llm.invoke(prompt)
    }

# ---------------- ROUTER ---------------- #

def web_router(state: GraphState) -> Literal["web_search", "generate"]:
    return "web_search" if state["needs_web"] else "generate"

# ---------------- GRAPH ---------------- #

def create_watson_graph():
    workflow = StateGraph(GraphState)

    workflow.add_node("retrieve", retrieve_documents)
    workflow.add_node("score", score_documents)
    workflow.add_node("web_search", web_search)
    workflow.add_node("generate", generate_answer)

    workflow.set_entry_point("retrieve")
    workflow.add_edge("retrieve", "score")

    workflow.add_conditional_edges(
        "score",
        web_router
    )

    workflow.add_edge("web_search", "generate")
    workflow.add_edge("generate", END)

    return workflow.compile()

graph = create_watson_graph()
