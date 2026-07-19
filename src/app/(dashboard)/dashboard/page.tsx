"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentUser } from "@/frontend/hooks/use-current-user";

export default function DashboardRoutePage() {
  const { data: user } = useCurrentUser();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Dashboard
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Overview</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {user?.name ?? "User"}, this is your dashboard home. Use the sidebar
            to navigate to documents, review tasks, or admin tools.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
