import { useState, useRef } from "react";
import { Mic, Square, Upload, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface AudioRecorderProps {
  onAudioReady: (blob: Blob, url: string) => void;
}

export default function AudioRecorder({ onAudioReady }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        onAudioReady(blob, url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      toast.success("Recording started");
    } catch (error) {
      toast.error("Failed to access microphone");
      console.error(error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      toast.success("Recording stopped");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("audio/")) {
        toast.error("Please upload an audio file");
        return;
      }
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      onAudioReady(file, url);
      toast.success("Audio file uploaded");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="border-0 shadow-medical card-gradient">
      <CardContent className="p-6 space-y-4">
        <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
          <Mic className="w-5 h-5 text-primary" />
          Audio Input
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          {!isRecording ? (
            <>
              <Button
                onClick={startRecording}
                className="flex-1 medical-gradient text-primary-foreground hover:opacity-90 transition-smooth shadow-md"
                size="lg"
              >
                <Mic className="mr-2 h-5 w-5" />
                Start Recording
              </Button>

              <div className="flex-1">
                <label htmlFor="audio-upload" className="cursor-pointer">
                  <Button
                    variant="outline"
                    className="w-full hover:bg-accent transition-smooth"
                    size="lg"
                    asChild
                  >
                    <span>
                      <Upload className="mr-2 h-5 w-5" />
                      Upload Audio
                    </span>
                  </Button>
                </label>
                <input
                  id="audio-upload"
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </>
          ) : (
            <Button
              onClick={stopRecording}
              variant="destructive"
              className="w-full shadow-md"
              size="lg"
            >
              <Square className="mr-2 h-5 w-5 fill-current" />
              Stop Recording • {formatTime(recordingTime)}
            </Button>
          )}
        </div>

        {isRecording && (
          <div className="flex items-center justify-center gap-2 py-4">
            <div className="w-3 h-3 bg-destructive rounded-full animate-pulse-glow"></div>
            <span className="text-sm font-medium text-muted-foreground">Recording in progress...</span>
          </div>
        )}

        {audioUrl && !isRecording && (
          <div className="space-y-3 pt-2 border-t">
            <div className="flex items-center gap-2 text-sm text-success">
              <Check className="w-4 h-4" />
              <span className="font-medium">Audio ready for transcription</span>
            </div>
            <audio controls className="w-full" src={audioUrl}>
              Your browser does not support audio playback.
            </audio>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
