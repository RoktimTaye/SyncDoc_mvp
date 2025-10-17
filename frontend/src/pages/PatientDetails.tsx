import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Calendar, Phone, Mail, Droplet, AlertCircle, FileText, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPatientById } from "@/services/storage";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import gsap from "gsap";

export default function PatientDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const patient = id ? getPatientById(id) : null;

  useEffect(() => {
    gsap.fromTo(
      ".patient-detail-card",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" }
    );
  }, []);

  if (!patient) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 md:p-8">
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold mb-4">Patient not found</h2>
              <Button onClick={() => navigate("/patients")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Patients
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 space-y-8">
          {/* Header */}
          <div className="patient-detail-card">
            <Button
              variant="ghost"
              onClick={() => navigate("/patients")}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Patients
            </Button>
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full medical-gradient flex items-center justify-center shadow-glow">
                <User className="w-10 h-10 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  {patient.name}
                </h1>
                <p className="text-muted-foreground">
                  {patient.age} years • {patient.gender}
                </p>
              </div>
            </div>
          </div>

          {/* Patient Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="patient-detail-card border-0 card-gradient">
              <CardContent className="p-4 flex items-center gap-3">
                <Calendar className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Last Visit</p>
                  <p className="font-semibold">
                    {new Date(patient.lastVisit).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="patient-detail-card border-0 card-gradient">
              <CardContent className="p-4 flex items-center gap-3">
                <FileText className="w-8 h-8 text-secondary" />
                <div>
                  <p className="text-xs text-muted-foreground">Consultations</p>
                  <p className="font-semibold">{patient.consultations.length}</p>
                </div>
              </CardContent>
            </Card>

            {patient.bloodGroup && (
              <Card className="patient-detail-card border-0 card-gradient">
                <CardContent className="p-4 flex items-center gap-3">
                  <Droplet className="w-8 h-8 text-destructive" />
                  <div>
                    <p className="text-xs text-muted-foreground">Blood Group</p>
                    <p className="font-semibold">{patient.bloodGroup}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {patient.phone && (
              <Card className="patient-detail-card border-0 card-gradient">
                <CardContent className="p-4 flex items-center gap-3">
                  <Phone className="w-8 h-8 text-success" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-semibold text-sm">{patient.phone}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Allergies */}
          {patient.allergies && patient.allergies.length > 0 && (
            <Card className="patient-detail-card border-0 card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  Allergies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.map((allergy, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm font-medium"
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Consultations History */}
          <Card className="patient-detail-card border-0 card-gradient">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Consultation History
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/insights?patient=${patient.id}`)}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                View Insights
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {patient.consultations.length > 0 ? (
                patient.consultations
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((consultation) => (
                    <div
                      key={consultation.id}
                      className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">
                          {new Date(consultation.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          Confidence: {(parseFloat(consultation.insights.confidence) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Summary:</span> {consultation.aiSummary}
                      </p>
                      <details className="text-sm">
                        <summary className="cursor-pointer text-primary hover:underline">
                          View Transcription
                        </summary>
                        <p className="mt-2 p-3 bg-background rounded text-muted-foreground">
                          {consultation.transcription}
                        </p>
                      </details>
                      <details className="text-sm">
                        <summary className="cursor-pointer text-success hover:underline">
                          View Prescription
                        </summary>
                        <pre className="mt-2 p-3 bg-background rounded text-muted-foreground whitespace-pre-wrap font-mono text-xs">
                          {consultation.prescription}
                        </pre>
                      </details>
                    </div>
                  ))
              ) : (
                <p className="text-center text-muted-foreground italic py-8">
                  No consultations recorded yet
                </p>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
