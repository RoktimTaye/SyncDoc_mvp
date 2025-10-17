import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, FileText, Activity, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import gsap from "gsap";

export default function Dashboard() {
  const { doctor, patients } = useApp();
  const navigate = useNavigate();

  const totalPatients = patients.length;
  const totalConsultations = patients.reduce((sum, p) => sum + p.consultations.length, 0);
  const todayConsultations = patients.filter((p) => {
    const today = new Date().toISOString().split("T")[0];
    return p.consultations.some((c) => c.date === today);
  }).length;

  useEffect(() => {
    // Animate stat cards
    gsap.fromTo(
      ".stat-card",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power3.out",
      }
    );

    // Animate welcome section
    gsap.fromTo(
      ".welcome-section",
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 space-y-8">
          {/* Welcome Section */}
          <div className="welcome-section">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 pl-10">
              Welcome back, Dr. {doctor?.name}!
            </h1>
            <p className="text-muted-foreground pl-10">
              Here's an overview of your practice today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="stat-card">
              <StatCard
                title="Total Patients"
                value={totalPatients}
                icon={Users}
                color="primary"
                trend={`${totalPatients} active patients`}
              />
            </div>
            <div className="stat-card">
              <StatCard
                title="Consultations Today"
                value={todayConsultations}
                icon={Activity}
                color="success"
                trend="Real-time tracking"
              />
            </div>
            <div className="stat-card">
              <StatCard
                title="Total Consultations"
                value={totalConsultations}
                icon={FileText}
                color="secondary"
                trend="All time"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 card-gradient rounded-xl border shadow-medical hover:shadow-lg transition-smooth">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate("/consultation")}
                  className="w-full justify-start medical-gradient text-primary-foreground shadow-md hover:opacity-90"
                  size="lg"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Start New Consultation
                </Button>
                <Button
                  onClick={() => navigate("/patients")}
                  variant="outline"
                  className="w-full justify-start hover:bg-accent transition-smooth"
                  size="lg"
                >
                  <Users className="mr-2 h-5 w-5" />
                  View All Patients
                </Button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="p-6 card-gradient rounded-xl border shadow-medical">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-secondary" />
                Recent Activity
              </h2>
              <div className="space-y-3">
                {patients.slice(0, 3).map((patient) => (
                  <div
                    key={patient.id}
                    className="p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth cursor-pointer"
                    onClick={() => navigate(`/patients/${patient.id}`)}
                  >
                    <p className="font-medium text-sm">{patient.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {patients.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">
                    No recent activity
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="p-6 medical-gradient rounded-xl shadow-glow text-primary-foreground">
            <div className="flex items-start gap-4">
              <Activity className="w-8 h-8 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-1">AI-Powered Consultations</h3>
                <p className="text-primary-foreground/90 text-sm">
                  Record or upload patient conversations, get instant AI-generated transcriptions,
                  and receive intelligent prescription suggestions powered by Gemini Pro.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
