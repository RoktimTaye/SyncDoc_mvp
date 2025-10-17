// API service for backend communication
// Currently uses placeholder URLs - will connect to Flask backend

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export interface TranscriptionResponse {
  transcription: string;
  confidence: number;
  duration: number;
}

export interface PrescriptionResponse {
  prescription: string;
  summary: string;
  confidence: number;
}

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Transcribe audio using Google Speech-to-Text
export async function transcribeAudio(audioBlob: Blob): Promise<TranscriptionResponse> {
  try {
    // Call the real Flask backend endpoint
    const formData = new FormData();
    // Ensure the file has a proper name with extension
    const filename = 'recording.webm';
    const file = new File([audioBlob], filename, { type: audioBlob.type });
    formData.append('audio', file);
    const response = await fetch(`${API_BASE}/transcribe`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();

    // Return the actual transcription data from the backend
    return {
      transcription: data.transcription || "",
      confidence: data.metadata?.confidence || 0.85,
      duration: data.metadata?.duration || 0,
    };
  } catch (error) {
    console.error("Transcription error:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to transcribe audio: ${error.message}`);
    } else {
      throw new Error("Failed to transcribe audio: Unknown error occurred");
    }
  }
}

// Generate prescription using LlamaIndex + Gemini Pro
// export async function generatePrescription(transcriptionText: string): Promise<PrescriptionResponse> {
//   try {
//     // Simulate API call
//     await delay(3000);

//     // In production:
//     // const response = await fetch(`${API_BASE}/generate-prescription`, {
//     //   method: 'POST',
//     //   headers: { 'Content-Type': 'application/json' },
//     //   body: JSON.stringify({ transcription: transcriptionText }),
//     // });
//     // return await response.json();

//     // Simulated AI-generated prescription
//     return {
//       prescription: `Tab. Azithromycin 500mg - Take once daily after dinner for 3 days
// Tab. Paracetamol 650mg - Take twice daily for fever if needed
// Syrup Dextromethorphan 10ml - Take thrice daily for cough relief

// General Instructions:
// - Take plenty of rest
// - Drink warm fluids
// - Avoid cold foods and beverages
// - Cover mouth while coughing
// - Follow-up if symptoms worsen or persist beyond 5 days`,
//       summary: "Upper respiratory tract infection with productive cough. Likely viral origin with bacterial superinfection.",
//       confidence: 0.87,
//     };
//   } catch (error) {
//     console.error("Prescription generation error:", error);
//     throw new Error("Failed to generate prescription");
//   }
// }
export async function generatePrescription(transcriptionText: string): Promise<PrescriptionResponse> {
  try {
    // Call the real Flask backend endpoint
    const response = await fetch(`${API_BASE}/generate-prescription`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcription: transcriptionText }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`);
    }

    const data = await response.json();

    // Expected Flask response structure:
    // {
    //   "prescription": "string",
    //   "summary": "string",
    //   "confidence": 0.9
    // }

    return {
      prescription: data.prescription || "",
      summary: data.summary || "",
      confidence: data.confidence ?? 0.85,
    };
  } catch (error) {
    console.error("Prescription generation error:", error);
    throw new Error("Failed to generate prescription");
  }
}

// Upload audio file
export async function uploadAudioFile(file: File): Promise<string> {
  try {
    await delay(1000);
    
    // In production, upload to backend storage
    // const formData = new FormData();
    // formData.append('file', file);
    // const response = await fetch(`${API_BASE}/upload-audio`, {
    //   method: 'POST',
    //   body: formData,
    // });
    // const data = await response.json();
    // return data.url;

    // Simulate file upload - return blob URL
    return URL.createObjectURL(file);
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("Failed to upload audio file");
  }
}
