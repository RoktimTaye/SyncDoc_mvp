"""
Adapter that shapes prompts and uses either LlamaIndex (if available) or
the simple gemini_client wrapper above. This gives you a single function
generate_prescription_with_llama(prompt_context) used by Flask.
"""
import os
from services import gemini_client

# Try to import llama_index to show how you might wire it up.
try:
    from llama_index import LLMPredictor, PromptHelper, ServiceContext, GPTVectorStoreIndex
    from llama_index.llms import OpenAI  # many llama_index installations use OpenAI wrappers as example
    LLAMA_AVAILABLE = True
except Exception:
    LLAMA_AVAILABLE = False

def build_prescription_prompt(ctx):
    """
    Create a clear prompt for the LLM. You can refine the system prompt.
    """
    transcription = ctx.get("transcription", "")
    patient_id = ctx.get("patient_id")
    doctor = ctx.get("doctor") or {}
    doctor_name = doctor.get("name","Doctor")
    specialization = doctor.get("specialization","General")

    prompt = f"""
You are a helpful and clinically conservative medical assistant. The doctor ({doctor_name}, specialization: {specialization}) provided the following patient conversation transcription:

=== TRANSCRIPTION START ===
{transcription}
=== TRANSCRIPTION END ===

Task:
1) Provide a short AI summary (1-2 sentences) of the most likely problem / complaint.
2) Produce a clear, concise prescription and instructions (drug name, dose, frequency, duration), plus non-pharmacological advice if relevant.
3) Provide follow-up recommendations and red-flag signs for escalation.
4) Provide a short confidence estimate (0-1) for the diagnosis/prescription.

Output JSON object ONLY with fields:
{{
  "aiSummary": string,
  "prescription": string,
  "followUp": string,
  "confidence": float (0.0-1.0)
}}

Make the prescription conservative and include disclaimers: "This is AI-assisted — final verification required by the doctor."
"""
    return prompt

def generate_prescription_with_llama(ctx):
    prompt = build_prescription_prompt(ctx)

    # If LlamaIndex is available and user wants to use it, show how to plug in (best-effort)
    if LLAMA_AVAILABLE and os.environ.get("USE_LLAMA_INDEX","1") == "1":
        # Example: using OpenAI LLM within llama_index; you would replace OpenAI with your Gemini wrapper
        try:
            llm = OpenAI(temperature=0.1, model="gpt-4o")  # replace with your configured LLM object
            predictor = LLMPredictor(llm=llm)
            helper = PromptHelper(max_input_size=4096, num_output=512, max_chunk_overlap=20)
            service_context = ServiceContext.from_defaults(llm_predictor=predictor, prompt_helper=helper)
            # For simple generation we can call predictor directly:
            resp = predictor.predict(prompt)
            text = resp
            # Try to parse JSON inside LLM output
            import json
            try:
                parsed = json.loads(text)
            except:
                parsed = {"aiSummary": text[:200], "prescription": text, "followUp":"", "confidence":0.5}
            return {"prescription": parsed.get("prescription"), "aiSummary": parsed.get("aiSummary"), "metadata": {"via":"llama_index"}, **parsed}
        except Exception as e:
            # fallback to gemini_client
            pass

    # Fallback: call gemini wrapper (mock if GEMINI_API_KEY missing)
    resp = gemini_client.call_gemini_prompt(prompt)
    # gemini_client returns {"text": "..."} in mock example
    text = resp.get("text") if isinstance(resp, dict) else str(resp)
    # Attempt to parse JSON from model output:
    import json
    parsed = None
    try:
        parsed = json.loads(text)
    except:
        # If the model returned plain text, craft a simple JSON with fields
        parsed = {
            "aiSummary": text.split("\n")[0][:200],
            "prescription": text,
            "followUp": "Follow up as needed",
            "confidence": 0.6
        }
    return {
        "prescription": parsed.get("prescription"),
        "aiSummary": parsed.get("aiSummary"),
        "followUp": parsed.get("followUp"),
        "confidence": parsed.get("confidence"),
        "metadata": {"via": "gemini_wrapper", "raw": text}
    }
