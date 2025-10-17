import os
import json

# Try to import google speech lib if available
try:
    from google.cloud import speech_v1p1beta1 as speech
    GOOGLE_AVAILABLE = True
except Exception:
    GOOGLE_AVAILABLE = False

def transcribe_audio_file(path):
    """
    If google creds configured and google lib installed, uses real Google STT.
    Otherwise, returns a mock transcription (for dev).
    Returns (transcription_text, metadata)
    """
    # Use Google if configured and library available
    if GOOGLE_AVAILABLE and os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"):
        client = speech.SpeechClient()
        with open(path, "rb") as f:
            content = f.read()
        audio = speech.RecognitionAudio(content=content)
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.ENCODING_UNSPECIFIED,
            sample_rate_hertz=16000,
            language_code="en-US",
            enable_automatic_punctuation=True
        )
        response = client.recognize(config=config, audio=audio)
        transcripts = []
        for result in response.results:
            transcripts.append(result.alternatives[0].transcript)
        full = " ".join(transcripts)
        meta = {"provider":"google", "results": len(response.results)}
        return full, meta

    # Mock fallback: return placeholder
    filename = os.path.basename(path)
    text = f"[Mock transcription for {filename}] Patient: I have a mild headache since morning. Took paracetamol. No vomiting. Blood pressure normal."
    meta = {"provider":"mock", "note":"Set GOOGLE_APPLICATION_CREDENTIALS env var and install google-cloud-speech for real transcription"}
    return text, meta
