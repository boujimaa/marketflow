import { z } from "zod";

export const workspaceIdSchema = z.string().uuid();

export const renameWorkspaceSchema = z.object({
  workspaceId: workspaceIdSchema,
  name: z.string().trim().min(1).max(120),
});

export type RenameWorkspaceInput = z.infer<typeof renameWorkspaceSchema>;
