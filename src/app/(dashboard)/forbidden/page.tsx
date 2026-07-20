import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="max-w-md text-center">
        <CardContent className="flex flex-col items-center gap-4 py-8">
          <ShieldAlert className="h-10 w-10 text-muted-foreground" />

          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight">
              Access denied
            </h1>
            <p className="text-sm text-muted-foreground">
              You don't have permission to view this page. If you think
              this is a mistake, contact an administrator.
            </p>
          </div>

          <Button render={<Link href="/dashboard" />}>
            Back to dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}