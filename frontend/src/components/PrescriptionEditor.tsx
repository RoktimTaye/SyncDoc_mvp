import { useState } from "react";
import { Edit3, Save, Pill, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface PrescriptionEditorProps {
  prescription: string;
  onSave: (prescription: string) => void;
  patientName?: string;
}

export default function PrescriptionEditor({ prescription, onSave, patientName }: PrescriptionEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(prescription);

  const handleSave = () => {
    onSave(text);
    setIsEditing(false);
    toast.success("Prescription saved successfully");
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prescription_${patientName || "patient"}_${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    toast.success("Prescription downloaded");
  };

  return (
    <Card className="border-0 shadow-medical card-gradient">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            <Pill className="w-5 h-5 text-success" />
            Prescription
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={!text}
              className="hover:bg-accent transition-smooth"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className={isEditing ? "medical-gradient text-primary-foreground" : ""}
            >
              {isEditing ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </>
              ) : (
                <>
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit
                </>
              )}
            </Button>
          </div>
        </div>

        {isEditing ? (
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[250px] resize-none focus:ring-2 focus:ring-success transition-smooth font-mono"
            placeholder="Enter prescription details..."
          />
        ) : (
          <div className="min-h-[250px] p-4 bg-muted/30 rounded-lg border">
            {text ? (
              <pre className="text-sm text-card-foreground whitespace-pre-wrap font-mono leading-relaxed">
                {text}
              </pre>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Prescription will appear here after AI generation...
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
