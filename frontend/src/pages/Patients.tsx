import { useState, useEffect } from "react";
import { Search, UserPlus, Users as UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import PatientCard from "@/components/PatientCard";
import gsap from "gsap";

export default function Patients() {
  const { patients } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    gsap.fromTo(
      ".patient-card",
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        stagger: 0.08,
        ease: "power2.out",
      }
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 pl-10">
              All Patients
            </h1>
            <p className="text-muted-foreground pl-10">
              Manage your patient records and consultation history
            </p>
          </div>

          {/* Search and Add */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name or patient ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={() => navigate("/consultation")}
              className="medical-gradient text-primary-foreground shadow-md whitespace-nowrap"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              New Patient
            </Button>
          </div>

          {/* Patients Grid */}
          {filteredPatients.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPatients.map((patient) => (
                <div key={patient.id} className="patient-card">
                  <PatientCard patient={patient} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-block p-6 bg-muted/30 rounded-full mb-4">
                <UsersIcon className="w-16 h-16 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery ? "No patients found" : "No patients yet"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Start by adding your first patient consultation"}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => navigate("/consultation")}
                  className="medical-gradient text-primary-foreground shadow-md"
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  Add First Patient
                </Button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
