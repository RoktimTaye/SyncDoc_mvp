import { useState } from "react";
import { Edit3, Save, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface TextEditorProps {
  title: string;
  content: string;
  onSave: (content: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
}

export default function TextEditor({
  title,
  content,
  onSave,
  placeholder = "Content will appear here...",
  icon,
}: TextEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(content);

  const handleSave = () => {
    onSave(text);
    setIsEditing(false);
  };

  return (
    <Card className="border-0 shadow-medical card-gradient">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            {icon || <FileText className="w-5 h-5 text-primary" />}
            {title}
          </h3>
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

        {isEditing ? (
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[200px] resize-none focus:ring-2 focus:ring-primary transition-smooth"
            placeholder={placeholder}
          />
        ) : (
          <div className="min-h-[200px] p-4 bg-muted/30 rounded-lg border">
            {text ? (
              <p className="text-sm text-card-foreground whitespace-pre-wrap leading-relaxed">{text}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">{placeholder}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
