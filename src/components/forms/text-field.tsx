"use client";

import type { FieldError as RHFFieldError } from "react-hook-form";

import { Input } from "@/components/ui/input";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

type TextFieldProps = {
  label: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  disabled?: boolean;
  error?: RHFFieldError;
  inputProps: React.ComponentProps<typeof Input>;
};

export function TextField({
  label,
  placeholder,
  type = "text",
  disabled,
  error,
  inputProps,
}: TextFieldProps) {
  return (
    <Field data-invalid={!!error}>
      <FieldLabel>{label}</FieldLabel>

      <FieldContent>
        <Input
          {...inputProps}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
        />

        <FieldError errors={error ? [error] : undefined} />
      </FieldContent>
    </Field>
  );
}