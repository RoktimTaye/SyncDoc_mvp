import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Sparkles, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import AudioRecorder from "@/components/AudioRecorder";
import TextEditor from "@/components/TextEditor";
import PrescriptionEditor from "@/components/PrescriptionEditor";
import { transcribeAudio, generatePrescription } from "@/services/api";
import { savePatient, getPatientById, generateId, addConsultation, Patient } from "@/services/storage";
import { toast } from "sonner";
import gsap from "gsap";

export default function Consultation() {
  const { refreshPatients } = useApp();
  const navigate = useNavigate();

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [transcription, setTranscription] = useState("");
  const [prescription, setPrescription] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Patient info
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");

  useEffect(() => {
    gsap.fromTo(
      ".consultation-section",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" }
    );
  }, []);

  const handleAudioReady = (blob: Blob, url: string) => {
    setAudioBlob(blob);
    setAudioUrl(url);
  };

  const handleTranscribe = async () => {
    if (!audioBlob) {
      toast.error("Please record or upload audio first");
      return;
    }

    setIsTranscribing(true);
    try {
      const result = await transcribeAudio(audioBlob);
      setTranscription(result.transcription);
      toast.success("Transcription completed!");
    } catch (error) {
      toast.error("Transcription failed");
      console.error(error);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleGeneratePrescription = async () => {
    if (!transcription) {
      toast.error("Please transcribe audio first");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generatePrescription(transcription);
      setPrescription(result.prescription);
      setAiSummary(result.summary);
      toast.success("Prescription generated!");
    } catch (error) {
      toast.error("Failed to generate prescription");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveConsultation = () => {
    if (!patientName || !transcription || !prescription) {
      toast.error("Please complete all sections");
      return;
    }

    // Check if patient exists or create new one
    let patient = patientId ? getPatientById(patientId) : null;

    if (!patient) {
      const newPatient: Patient = {
        id: generateId("PAT"),
        name: patientName,
        age: parseInt(patientAge) || 0,
        gender: patientGender || "Not specified",
        consultations: [],
        createdAt: new Date().toISOString().split("T")[0],
        lastVisit: new Date().toISOString().split("T")[0],
      };
      patient = newPatient;
    }

    const consultation = {
      id: generateId("CONS"),
      date: new Date().toISOString().split("T")[0],
      transcription,
      prescription,
      aiSummary,
      audioUrl,
      insights: {
        duration: "N/A",
        confidence: "0.89",
      },
    };

    if (patient) {
      addConsultation(patient.id, consultation);
      refreshPatients();
      toast.success("Consultation saved successfully!");
      
      setTimeout(() => {
        navigate(`/patients/${patient!.id}`);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 space-y-8">
          <div className="consultation-section">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 pl-10">
              New Consultation
            </h1>
            <p className="text-muted-foreground pl-10">
              Record patient conversation and generate AI-powered prescriptions
            </p>
          </div>

          {/* Patient Information */}
          <div className="consultation-section p-6 card-gradient rounded-xl border shadow-medical space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Patient Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patient-id">Patient ID (Optional)</Label>
                <Input
                  id="patient-id"
                  placeholder="PAT001"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-name">Patient Name *</Label>
                <Input
                  id="patient-name"
                  placeholder="Enter patient name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-age">Age</Label>
                <Input
                  id="patient-age"
                  type="number"
                  placeholder="35"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-gender">Gender</Label>
                <Input
                  id="patient-gender"
                  placeholder="Male/Female/Other"
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Audio Recording Section */}
          <div className="consultation-section">
            <AudioRecorder onAudioReady={handleAudioReady} />
          </div>

          {/* Transcribe Button */}
          {audioBlob && !transcription && (
            <div className="consultation-section">
              <Button
                onClick={handleTranscribe}
                disabled={isTranscribing}
                className="w-full medical-gradient text-primary-foreground shadow-md"
                size="lg"
              >
                {isTranscribing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Transcribing Audio...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-5 w-5" />
                    Transcribe Audio
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Transcription Editor */}
          {transcription && (
            <div className="consultation-section">
              <TextEditor
                title="Transcription"
                content={transcription}
                onSave={setTranscription}
                placeholder="Transcription will appear here..."
              />
            </div>
          )}

          {/* Generate Prescription Button */}
          {transcription && !prescription && (
            <div className="consultation-section">
              <Button
                onClick={handleGeneratePrescription}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-success to-secondary text-primary-foreground shadow-md"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    AI Generating Prescription...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Prescription with AI
                  </>
                )}
              </Button>
            </div>
          )}

          {/* AI Summary */}
          {aiSummary && (
            <div className="consultation-section p-4 bg-success/10 border border-success/30 rounded-lg">
              <p className="text-sm">
                <span className="font-semibold text-success">AI Summary:</span> {aiSummary}
              </p>
            </div>
          )}

          {/* Prescription Editor */}
          {prescription && (
            <div className="consultation-section">
              <PrescriptionEditor
                prescription={prescription}
                onSave={setPrescription}
                patientName={patientName}
              />
            </div>
          )}

          {/* Save Consultation */}
          {prescription && (
            <div className="consultation-section">
              <Button
                onClick={handleSaveConsultation}
                className="w-full bg-gradient-to-r from-success to-success text-primary-foreground shadow-md"
                size="lg"
              >
                <Check className="mr-2 h-5 w-5" />
                Save Consultation
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
