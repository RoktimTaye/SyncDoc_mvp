import json, os
DATA_FILE = "data/patients.json"
os.makedirs("data", exist_ok=True)

def _load():
    if not os.path.exists(DATA_FILE):
        return []
    try:
        return json.load(open(DATA_FILE,"r",encoding="utf-8"))
    except:
        return []

def _save(data):
    open(DATA_FILE,"w",encoding="utf-8").write(json.dumps(data, indent=2))

def get_all_patients():
    return _load()

def get_patient(pid):
    patients = _load()
    for p in patients:
        if p.get("id")==pid:
            return p
    return None

def save_patient(patient):
    patients = _load()
    found = False
    for i,p in enumerate(patients):
        if p.get("id")==patient.get("id"):
            patients[i] = patient
            found = True
            break
    if not found:
        patients.append(patient)
    _save(patients)
