"use client";

import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useLogin } from "@/frontend/hooks/use-login";
import { SubmitButton } from "@/components/forms/submit-button";
import { seededUsers } from "@/frontend/constants/seeded-users";
import { loginSchema, type LoginInput } from "@/validations/auth.validation";

export function LoginForm() {
  const login = useLogin();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });

  const { field: emailField, fieldState: emailState } = useController({
    control: form.control,
    name: "email",
  });

  async function onSubmit(values: LoginInput) {
    await login.mutateAsync(values);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Select a seeded user
            </label>

            <select
              id="email"
              value={emailField.value ?? ""}
              onChange={(event) => emailField.onChange(event.target.value)}
              onBlur={emailField.onBlur}
              disabled={login.isPending}
              className="h-10 w-full rounded border border-input bg-background px-3 text-sm"
            >
              <option value="">Choose a user</option>
              {seededUsers.map((user) => (
                <option key={user.email} value={user.email}>
                  {user.label} ({user.role})
                </option>
              ))}
            </select>

            {emailState.error && (
              <p className="text-sm text-destructive">
                {emailState.error.message}
              </p>
            )}
          </div>

          <SubmitButton
            className="w-full"
            loading={login.isPending}
            loadingText="Signing in..."
          >
            Sign In
          </SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
