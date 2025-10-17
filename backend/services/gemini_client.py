# import os, requests, json

# GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

# def call_gemini_prompt(prompt, max_tokens=512, temperature=0.2):
#     """
#     Minimal HTTP wrapper to call Gemini-like REST API.
#     Replace endpoint & payload according to the Gemini API you have access to.
#     If GEMINI_API_KEY not provided, raise exception or return mock.
#     """
#     if not GEMINI_API_KEY:
#         # Return mock response for dev
#         return {
#             "text": "[Mock LLM response] Based on the transcription: probable diagnosis: tension headache. Prescribe paracetamol 500mg twice daily. Follow up in 7 days."
#         }

#     # Example pseudo-endpoint - adapt to your provider's actual endpoint:
#     # NOTE: You must replace endpoint/path/payload to match the Gemini Pro API spec you have.
#     url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"  # <<-- replace with actual endpoint
#     headers = {"Authorization": f"Bearer {GEMINI_API_KEY}", "Content-Type": "application/json"}
#     payload = {
#         "prompt": prompt,
#         "max_tokens": max_tokens,
#         "temperature": temperature
#     }
#     resp = requests.post(url, headers=headers, json=payload, timeout=30)
#     if resp.status_code != 200:
#         raise Exception(f"Gemini call failed: {resp.status_code} {resp.text}")
#     data = resp.json()
#     # adapt as required; here we assume returned field 'text'
#     return data

import os, requests, json

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

def call_gemini_prompt(prompt):
    """
    Calls Gemini Pro REST API to generate text from a prompt.
    Returns the generated text.
    """

    if not GEMINI_API_KEY:
        # Return mock response for dev
        return {
            "text": "[Mock LLM response] Based on the transcription: probable diagnosis: tension headache. Prescribe paracetamol 500mg twice daily. Follow up in 7 days."
        }

    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
    headers = {
        "x-goog-api-key": GEMINI_API_KEY,
        "Content-Type": "application/json"
    }
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }

    resp = requests.post(url, headers=headers, json=payload, timeout=30)
    if resp.status_code != 200:
        raise Exception(f"Gemini call failed: {resp.status_code} {resp.text}")

    data = resp.json()
    # Extract generated text (depends on actual API response structure)
    try:
        text = data["candidates"][0]["content"]  # example; adjust if response differs
    except (KeyError, IndexError):
        text = "[No response text found]"
    return {"text": text}
