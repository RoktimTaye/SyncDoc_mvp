import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: "primary" | "secondary" | "success";
}

export default function StatCard({ title, value, icon: Icon, trend, color = "primary" }: StatCardProps) {
  const colorClasses = {
    primary: "from-primary to-primary-light",
    secondary: "from-secondary to-secondary-light",
    success: "from-success to-success",
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-smooth border-0 card-gradient">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-card-foreground">{value}</p>
            {trend && (
              <p className="text-xs text-success font-medium">
                {trend}
              </p>
            )}
          </div>
          <div className={`rounded-full p-3 bg-gradient-to-br ${colorClasses[color]} shadow-md`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
