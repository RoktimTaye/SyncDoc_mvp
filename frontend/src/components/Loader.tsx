import { useEffect, useState } from "react";
import { Activity } from "lucide-react";

export default function Loader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="text-center animate-fade-in-scale">
        <div className="mb-6 relative">
          <div className="medical-gradient rounded-full p-6 inline-block shadow-glow animate-pulse-glow">
            <Activity className="w-16 h-16 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="absolute inset-0 rounded-full medical-gradient opacity-20 blur-xl animate-spin-slow"></div>
        </div>
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          SyncDoc
        </h2>
        <p className="text-muted-foreground text-sm">AI-Powered Healthcare Assistant</p>
      </div>
    </div>
  );
}
