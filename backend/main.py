from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from graph import graph, GraphState
from typing import Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Watson Legal Assistant API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class QueryRequest(BaseModel):
    question: str
    session_id: Optional[str] = None

class QueryResponse(BaseModel):
    answer: str
    sources: list[str]
    relevance_scores: list[float]
    used_web_search: bool

@app.get("/")
def read_root():
    return {
        "service": "Watson Legal Assistant",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    """
    Process a legal query through the Watson AI pipeline
    """
    try:
        logger.info(f"Processing query: {request.question}")
        
        # Initialize state
        initial_state: GraphState = {
            "question": request.question,
            "documents": [],
            "web_results": [],
            "answer": "",
            "needs_web": False,
            "relevance_scores": []
        }
        
        # Run the graph
        result = graph.invoke(initial_state)
        
        # Prepare response
        response = QueryResponse(
            answer=result["answer"],
            sources=result["documents"][:3],  # Return top 3 sources
            relevance_scores=result["relevance_scores"],
            used_web_search=result["needs_web"] and len(result["web_results"]) > 0
        )
        
        logger.info("Query processed successfully")
        return response
        
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

@app.post("/upload-document")
async def upload_document():
    """
    Endpoint for uploading legal documents to the vector store
    """
    return {"message": "Document upload endpoint - to be implemented"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)