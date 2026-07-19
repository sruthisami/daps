"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentUser } from "@/frontend/hooks/use-current-user";

export default function AdminPage() {
  const { data: user } = useCurrentUser();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Administration
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Admin console</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Access</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {user?.name ?? "Admin"}, the admin console is ready. You can extend
            it with user management, policy controls, and workflow settings
            here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
