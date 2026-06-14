import { z } from "zod";
import { dictionaries, Dictionary } from "@/lib/i18n/dictionaries";

type ValidationMessages = Dictionary["validation"];

export function createLoginSchema(messages: ValidationMessages) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, messages.emailRequired)
      .email(messages.invalidEmail),
    password: z.string().min(1, messages.passwordRequired),
  });
}

export function createRegisterSchema(messages: ValidationMessages) {
  return z
    .object({
      name: z
        .string()
        .trim()
        .min(1, messages.nameRequired)
        .min(2, messages.nameTooShort),
      email: z
        .string()
        .trim()
        .min(1, messages.emailRequired)
        .email(messages.invalidEmail),
      password: z
        .string()
        .min(1, messages.passwordRequired)
        .min(8, messages.passwordTooShortEight)
        .regex(/[A-Z]/, messages.passwordUppercase)
        .regex(/[a-z]/, messages.passwordLowercase)
        .regex(/[0-9]/, messages.passwordDigit),
      confirmPassword: z.string().min(1, messages.confirmPasswordRequired),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: messages.passwordsDoNotMatch,
      path: ["confirmPassword"],
    });
}

export const loginSchema = createLoginSchema(dictionaries.en.validation);
export const registerSchema = createRegisterSchema(dictionaries.en.validation);

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
