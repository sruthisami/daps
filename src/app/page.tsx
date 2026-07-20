import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-5xl space-y-8">
        <section className="rounded border border-border bg-card p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Controlled Document Workflow
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            manage documents through a secure approval workflow.
          </h1>

          <p className="mt-4 max-w-2xl text-muted-foreground">
            Create, review, approve, publish, and archive documents with
            role-based access and a complete audit trail.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/login" />}
            >
              Sign in
            </Button>

            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              render={<Link href="/dashboard" />}
            >
              Dashboard
            </Button>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Viewer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View published documents.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Author</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create, edit, and submit documents.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reviewer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Approve, reject, and publish documents.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Publish and archive documents.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
