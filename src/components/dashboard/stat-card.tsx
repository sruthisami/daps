import { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type StatCardProps = {
  title: string;
  value: number | string;
  description?: string;
  icon: LucideIcon;
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">
            {title}
          </CardTitle>

          {description && (
            <CardDescription>
              {description}
            </CardDescription>
          )}
        </div>

        <Icon className="text-muted-foreground h-5 w-5" />
      </CardHeader>

      <CardContent>
        <p className="text-3xl font-bold">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}


