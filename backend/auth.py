from jose import jwt 
from passlib.hash import bcrypt 
import os 
from dotenv import load_dotenv 

load_dotenv() 
JWT_SECRET = os.getenv("JWT_SECRET")

def verify_token(token: str): 
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload.get("user_id")
    except:
        return None 
    
def hash_password(password: str) -> str:
    return bcrypt.hash(password) 

def verify_password(password: str, hashed: str) -> bool: 
    return bcrypt.verify(password, hashed)