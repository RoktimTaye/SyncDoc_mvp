import json, os, hashlib, datetime, jwt
from functools import wraps
from flask import request, jsonify
DATA_FILE = "data/doctors.json"
SECRET = os.environ.get("SECRET_KEY", "dev-secret")

def _load():
    if not os.path.exists(DATA_FILE):
        return []
    return json.load(open(DATA_FILE,"r",encoding="utf-8"))

def _save(data):
    open(DATA_FILE,"w",encoding="utf-8").write(json.dumps(data, indent=2))

def hash_pw(password):
    return hashlib.sha256(password.encode()).hexdigest()

def signup_user(name, email, password, specialization="General"):
    docs = _load()
    if any(d["email"]==email for d in docs):
        raise Exception("Email already exists")
    doc = {
        "id": f"DR{len(docs)+1:03d}",
        "name": name,
        "email": email,
        "password": hash_pw(password),
        "specialization": specialization,
        "created_at": datetime.datetime.utcnow().isoformat()
    }
    docs.append(doc)
    _save(docs)
    safe = {k:v for k,v in doc.items() if k!="password"}
    return safe

def login_user(email, password):
    docs = _load()
    hp = hash_pw(password)
    for d in docs:
        if d["email"]==email and d["password"]==hp:
            safe = {k:v for k,v in d.items() if k!="password"}
            return safe
    return None

def create_token(doctor_id):
    payload = {
        "doctor_id": doctor_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    return jwt.encode(payload, SECRET, algorithm="HS256")

def decode_token(token):
    try:
        return jwt.decode(token, SECRET, algorithms=["HS256"])
    except Exception as e:
        return None

def get_doctor_from_token(request):
    auth = request.headers.get("Authorization","")
    if not auth:
        return None
    token = auth.replace("Bearer ","")
    data = decode_token(token)
    if not data:
        return None
    docs = _load()
    for d in docs:
        if d["id"] == data.get("doctor_id"):
            safe = {k:v for k,v in d.items() if k!="password"}
            return safe
    return None

def auth_required(optional=False):
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            auth = request.headers.get("Authorization","")
            if not auth:
                if optional:
                    return f(*args, **kwargs)
                return jsonify({"error":"missing auth token"}), 401
            token = auth.replace("Bearer ","")
            data = decode_token(token)
            if not data:
                return jsonify({"error":"invalid token"}), 401
            return f(*args, **kwargs)
        return wrapped
    return decorator
