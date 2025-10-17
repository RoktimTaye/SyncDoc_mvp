import { User, Calendar, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Patient } from "@/services/storage";
import { useNavigate } from "react-router-dom";

interface PatientCardProps {
  patient: Patient;
}

export default function PatientCard({ patient }: PatientCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-smooth border-0 card-gradient group cursor-pointer">
      <CardContent className="p-6" onClick={() => navigate(`/patients/${patient.id}`)}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full medical-gradient flex items-center justify-center shadow-md">
              <User className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-card-foreground">{patient.name}</h3>
              <p className="text-sm text-muted-foreground">
                {patient.age} years • {patient.gender}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            <span>Last Visit: {new Date(patient.lastVisit).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="w-4 h-4 text-secondary" />
            <span>{patient.consultations.length} Consultations</span>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full group-hover:medical-gradient group-hover:text-primary-foreground transition-smooth"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/patients/${patient.id}`);
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
