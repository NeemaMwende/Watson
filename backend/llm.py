from langchain_community.llms import Ollama
from langchain_community.embeddings import OllamaEmbeddings
from langchain.prompts import ChatPromptTemplate
import os
from dotenv import load_dotenv

load_dotenv()

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
MODEL_NAME = os.getenv("MODEL_NAME", "llama3.1")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "nomic-embed-text")

def get_llm(temperature: float = 0.2):
    """Get configured Ollama LLM instance"""
    return Ollama(
        base_url=OLLAMA_BASE_URL,
        model=MODEL_NAME,
        temperature=temperature
    )

def get_embeddings():
    """Get configured Ollama embeddings"""
    return OllamaEmbeddings(
        base_url=OLLAMA_BASE_URL,
        model=EMBEDDING_MODEL
    )

# Prompt templates
LEGAL_ASSISTANT_PROMPT = ChatPromptTemplate.from_messages([
    ("system", """You are Watson, an expert legal assistant specializing in Kenyan law.

Your capabilities:
- Answer legal questions with citations
- Search legal databases and case law
- Provide relevant precedents
- Explain complex legal concepts clearly

Always:
1. Be accurate and cite sources
2. Clarify when something requires a licensed attorney
3. Provide relevant case law when available
4. Use clear, professional language

Current context: {context}
"""),
    ("user", "{question}")
])

SCORING_PROMPT = ChatPromptTemplate.from_messages([
    ("system", """You are a relevance scorer. Rate how relevant the following document is to the query.
Score from 0-10 where:
- 0-3: Not relevant
- 4-6: Somewhat relevant
- 7-10: Highly relevant

Return ONLY a number from 0-10."""),
    ("user", "Query: {query}\n\nDocument: {document}")
])