import { z } from "zod";
import { dictionaries, Dictionary } from "@/lib/i18n/dictionaries";
import { PlaylistStatus } from "@/types";

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

export const updatePlaylistStatusSchema = z.object({
  status: z.enum([PlaylistStatus.IN_PROGRESS, PlaylistStatus.COMPLETED], {
    message: "Invalid playlist status value",
  }),
});

export type UpdatePlaylistStatusInput = z.infer<typeof updatePlaylistStatusSchema>;

export const updatePlaylistSchema = z.object({
  status: z
    .enum([PlaylistStatus.IN_PROGRESS, PlaylistStatus.COMPLETED], {
      message: "Invalid playlist status value",
    })
    .optional(),
  title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty")
    .max(120, "Title is too long")
    .optional(),
});

export type UpdatePlaylistInput = z.infer<typeof updatePlaylistSchema>;

export const addVideoToPlaylistSchema = z.object({
  videoUrl: z.string().trim().min(1, "Video URL is required"),
});

export type AddVideoToPlaylistInput = z.infer<typeof addVideoToPlaylistSchema>;

