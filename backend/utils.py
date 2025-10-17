import time, random, string, os

ALLOWED = {"wav","mp3","m4a","webm","ogg"}

def allowed_file(filename):
    ext = filename.split(".")[-1].lower()
    return ext in ALLOWED

def make_id(prefix="ID"):
    suffix = ''.join(random.choices(string.ascii_uppercase+string.digits, k=6))
    return f"{prefix}_{suffix}"
