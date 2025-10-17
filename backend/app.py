from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from auth import auth_required, create_token, signup_user, login_user, get_doctor_from_token
import storage
from services.speech_to_text import transcribe_audio_file
from services.llama_adapter import generate_prescription_with_llama
from utils import allowed_file, make_id
import datetime

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY", "dev-secret")

# Ensure data dir
os.makedirs("data", exist_ok=True)

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status":"ok","time": datetime.datetime.utcnow().isoformat()}), 200


# -------------------------
# Auth endpoints
# -------------------------
@app.route("/api/auth/signup", methods=["POST"])
def signup():
    body = request.json
    if not body:
        return jsonify({"error":"Missing JSON body"}), 400
    name = body.get("name")
    email = body.get("email")
    password = body.get("password")
    specialization = body.get("specialization","General")
    if not (name and email and password):
        return jsonify({"error":"name, email and password are required"}), 400
    doctor = signup_user(name, email, password, specialization)
    token = create_token(doctor["id"])
    return jsonify({"token": token, "doctor": doctor}), 201

@app.route("/api/auth/login", methods=["POST"])
def login():
    body = request.json
    email = body.get("email")
    password = body.get("password")
    doctor = login_user(email, password)
    if not doctor:
        return jsonify({"error":"Invalid credentials"}), 401
    token = create_token(doctor["id"])
    return jsonify({"token": token, "doctor": doctor}), 200

# -------------------------
# Transcription (audio file upload)
# -------------------------
@app.route("/api/transcribe", methods=["POST"])
@auth_required(optional=True)  # optional auth in demo; set to auth_required() in production
def transcribe():
    """
    Expects multipart/form-data with file key 'audio'
    """
    if 'audio' not in request.files:
        return jsonify({"error":"No audio file uploaded under 'audio' key"}), 400
    file = request.files['audio']
    if file.filename == "":
        return jsonify({"error":"Empty filename"}), 400
    if not allowed_file(file.filename):
        return jsonify({"error":"Unsupported file type"}), 400

    tmp_dir = "data/tmp"
    os.makedirs(tmp_dir, exist_ok=True)
    filename = f"{make_id('audio')}_{file.filename}"
    path = os.path.join(tmp_dir, filename)
    file.save(path)

    # Call speech-to-text service
    try:
        transcription, meta = transcribe_audio_file(path)
    except Exception as e:
        transcription = ""
        meta = {"error": str(e)}

    return jsonify({"transcription": transcription, "metadata": meta}), 200


# -------------------------
# Generate prescription (LLM)
# -------------------------
@app.route("/api/generate-prescription", methods=["POST"])
@auth_required()
def generate_prescription():
    """
    Body: { transcription, patientId (optional), doctorNotes (optional) }
    """
    body = request.json or {}
    transcription = body.get("transcription", "")
    patient_id = body.get("patientId")
    doctor_notes = body.get("doctorNotes","")
    doctor = get_doctor_from_token(request)  # for personalization

    if not transcription:
        return jsonify({"error":"transcription is required"}), 400

    # Prepare prompt / context object we feed to LlamaIndex adapter
    prompt_context = {
        "transcription": transcription,
        "patient_id": patient_id,
        "doctor_notes": doctor_notes,
        "doctor": doctor
    }

    try:
        result = generate_prescription_with_llama(prompt_context)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    # Optionally persist to patient record in data store (if patientId provided)
    if patient_id:
        patient = storage.get_patient(patient_id)
        if not patient:
            # create a simple patient stub
            patient = {
                "id": patient_id,
                "name": "Unknown",
                "age": None,
                "gender": None,
                "consultations": []
            }
        consult = {
            "id": make_id("cons"),
            "date": datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
            "transcription": transcription,
            "prescription": result.get("prescription"),
            "aiSummary": result.get("aiSummary"),
            "insights": result.get("metadata", {})
        }
        patient.setdefault("consultations", []).append(consult)
        storage.save_patient(patient)

    return jsonify(result), 200


# -------------------------
# Patients endpoints
# -------------------------
@app.route("/api/patients", methods=["GET"])
@auth_required()
def list_patients():
    patients = storage.get_all_patients()
    return jsonify({"patients": patients}), 200

@app.route("/api/patients", methods=["POST"])
@auth_required()
def create_patient():
    body = request.json or {}
    name = body.get("name")
    age = body.get("age")
    gender = body.get("gender")
    if not name:
        return jsonify({"error":"name required"}), 400
    patient = {
        "id": make_id("PAT"),
        "name": name,
        "age": age,
        "gender": gender,
        "consultations": []
    }
    storage.save_patient(patient)
    return jsonify({"patient": patient}), 201

@app.route("/api/patients/<pid>", methods=["GET"])
@auth_required()
def get_patient(pid):
    patient = storage.get_patient(pid)
    if not patient:
        return jsonify({"error":"not found"}), 404
    return jsonify({"patient": patient}), 200

@app.route("/api/patients/<pid>", methods=["PUT"])
@auth_required()
def update_patient(pid):
    body = request.json or {}
    patient = storage.get_patient(pid)
    if not patient:
        return jsonify({"error":"not found"}), 404
    patient.update(body)
    storage.save_patient(patient)
    return jsonify({"patient": patient}), 200

@app.route("/api/patients/<pid>/consultations", methods=["GET"])
@auth_required()
def get_consultations(pid):
    patient = storage.get_patient(pid)
    if not patient:
        return jsonify({"error":"not found"}), 404
    return jsonify({"consultations": patient.get("consultations", [])}), 200

@app.route("/api/patients/<pid>/consultations", methods=["POST"])
@auth_required()
def add_consultation(pid):
    body = request.json or {}
    patient = storage.get_patient(pid)
    if not patient:
        return jsonify({"error":"not found"}), 404
    consult = {
        "id": make_id("CONS"),
        "date": body.get("date") or datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "transcription": body.get("transcription",""),
        "prescription": body.get("prescription",""),
        "aiSummary": body.get("aiSummary",""),
        "insights": body.get("insights", {})
    }
    patient.setdefault("consultations", []).append(consult)
    storage.save_patient(patient)
    return jsonify({"consultation": consult}), 201


# -------------------------
# Insights
# -------------------------
@app.route("/api/patients/<pid>/insights", methods=["GET"])
@auth_required()
def patient_insights(pid):
    patient = storage.get_patient(pid)
    if not patient:
        return jsonify({"error":"not found"}), 404
    cons = patient.get("consultations", [])
    total = len(cons)
    last_visit = cons[-1]["date"] if cons else None
    # average duration if available in insights.duration (string like "15 mins") -> parse numeric
    durations = []
    for c in cons:
        d = c.get("insights", {}).get("duration")
        if d:
            try:
                # simple parse: '15 mins' -> 15
                durations.append(float(d.split()[0]))
            except:
                pass
    avg_duration = sum(durations)/len(durations) if durations else None
    return jsonify({
        "total_visits": total,
        "last_visit": last_visit,
        "average_duration_minutes": avg_duration
    }), 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)

