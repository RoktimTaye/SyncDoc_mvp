import { useEffect } from "react";
import { BarChart3, Users, Calendar, TrendingUp, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import gsap from "gsap";

export default function Insights() {
  const { patients } = useApp();

  const totalPatients = patients.length;
  const totalConsultations = patients.reduce((sum, p) => sum + p.consultations.length, 0);
  const avgConsultationsPerPatient = totalPatients > 0 
    ? (totalConsultations / totalPatients).toFixed(1) 
    : "0";

  // Calculate this month's consultations
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthConsultations = patients.reduce((sum, p) => {
    return sum + p.consultations.filter((c) => {
      const date = new Date(c.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;
  }, 0);

  // Most active patient
  const mostActivePatient = patients.length > 0
    ? patients.reduce((prev, current) =>
        prev.consultations.length > current.consultations.length ? prev : current
      )
    : null;

  useEffect(() => {
    gsap.fromTo(
      ".insight-card",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power3.out" }
    );
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 pl-10">
              Practice Insights
            </h1>
            <p className="text-muted-foreground pl-10">
              Analytics and trends from your patient consultations
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="insight-card">
              <StatCard
                title="Total Patients"
                value={totalPatients}
                icon={Users}
                color="primary"
              />
            </div>
            <div className="insight-card">
              <StatCard
                title="Total Consultations"
                value={totalConsultations}
                icon={Activity}
                color="secondary"
              />
            </div>
            <div className="insight-card">
              <StatCard
                title="This Month"
                value={thisMonthConsultations}
                icon={Calendar}
                color="success"
                trend={`${thisMonthConsultations} consultations`}
              />
            </div>
            <div className="insight-card">
              <StatCard
                title="Avg per Patient"
                value={avgConsultationsPerPatient}
                icon={TrendingUp}
                color="primary"
              />
            </div>
          </div>

          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Most Active Patient */}
            <Card className="insight-card border-0 card-gradient shadow-medical">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Most Active Patient
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mostActivePatient ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full medical-gradient flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{mostActivePatient.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {mostActivePatient.consultations.length} consultations
                        </p>
                      </div>
                    </div>
                    <div className="pt-3 border-t">
                      <p className="text-xs text-muted-foreground">Last Visit</p>
                      <p className="font-medium">
                        {new Date(mostActivePatient.lastVisit).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">No patient data available</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity Summary */}
            <Card className="insight-card border-0 card-gradient shadow-medical">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-secondary" />
                  Activity Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium">New Patients (This Month)</span>
                  <span className="text-lg font-bold text-primary">
                    {patients.filter((p) => {
                      const date = new Date(p.createdAt);
                      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
                    }).length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium">Active Patients</span>
                  <span className="text-lg font-bold text-secondary">
                    {patients.filter((p) => p.consultations.length > 0).length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium">Average Confidence</span>
                  <span className="text-lg font-bold text-success">89%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Patient List with Stats */}
          <Card className="insight-card border-0 card-gradient shadow-medical">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Patient Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {patients.length > 0 ? (
                  patients.map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth"
                    >
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {patient.age} years • {patient.gender}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-primary">
                          {patient.consultations.length} visits
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Last: {new Date(patient.lastVisit).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground italic py-8">
                    No patient data available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
