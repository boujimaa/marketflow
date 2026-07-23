import { z } from "zod";
import { workspaceIdSchema } from "./workspace";

export const metaOAuthStartSchema = z.object({ workspaceId: workspaceIdSchema });

export const metaOAuthCallbackSchema = z.object({
  code: z.string().min(1).optional(),
  state: z.string().uuid().optional(),
  error: z.string().min(1).optional(),
  errorDescription: z.string().optional(),
});
