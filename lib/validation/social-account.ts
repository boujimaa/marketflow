import { z } from "zod";
import { workspaceIdSchema } from "./workspace";

export const socialProviderSchema = z.enum(["facebook", "instagram"]);
export const socialAccountStatusSchema = z.enum(["active", "expired", "revoked", "error"]);

export const createSocialAccountSchema = z.object({
  workspaceId: workspaceIdSchema,
  provider: socialProviderSchema,
  providerUserId: z.string().trim().min(1),
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1).nullable().optional(),
  tokenExpiresAt: z.string().datetime({ offset: true }).nullable().optional(),
  status: socialAccountStatusSchema.default("active"),
});

export const updateSocialAccountStatusSchema = z.object({
  workspaceId: workspaceIdSchema,
  socialAccountId: z.string().uuid(),
  status: socialAccountStatusSchema,
});

export type CreateSocialAccountInput = z.input<typeof createSocialAccountSchema>;
export type UpdateSocialAccountStatusInput = z.infer<typeof updateSocialAccountStatusSchema>;
