import { z } from "zod";
import { workspaceIdSchema } from "./workspace";

export const providerSchema = z.string().trim().toLowerCase().regex(/^[a-z][a-z0-9_-]{0,63}$/);
const providerUserIdSchema = z.string().trim().min(1).max(255);
const metadataSchema = z.record(z.string(), z.json()).default({});

export const connectProviderSchema = z.object({
  workspaceId: workspaceIdSchema,
  provider: providerSchema,
  providerUserId: providerUserIdSchema,
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1).nullable().optional(),
  tokenType: z.string().trim().min(1).max(100).default("Bearer"),
  expiresAt: z.string().datetime({ offset: true }).nullable().optional(),
  scopes: z.array(z.string().trim().min(1).max(255)).max(100).default([]),
  metadata: metadataSchema,
});

export const socialTokenIdSchema = z.object({
  workspaceId: workspaceIdSchema,
  tokenId: z.string().uuid(),
});

export const getProviderAccountsSchema = z.object({
  workspaceId: workspaceIdSchema,
  provider: providerSchema.optional(),
});
