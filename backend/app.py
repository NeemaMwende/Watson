from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from rag_agent import chat_bp, upload_bp

load_dotenv()

app = Flask(__name__)
CORS(app)

app.register_blueprint(chat_bp, url_prefix="/api/chat") 
app.register_blueprint(upload_bp, url_prefix="/api/upload")

if __name__=="__main__":
    app.run(debug=True, port=8000)
