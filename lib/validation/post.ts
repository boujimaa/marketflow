import { z } from "zod";
import { workspaceIdSchema } from "./workspace";

export const postStatusSchema = z.enum(["draft", "scheduled", "published"]);

export const createPostSchema = z.object({
  workspaceId: workspaceIdSchema,
  title: z.string().trim().min(1),
  caption: z.string().nullable().optional(),
  status: postStatusSchema.default("draft"),
});

export const updatePostSchema = z
  .object({
    workspaceId: workspaceIdSchema,
    postId: z.string().uuid(),
    title: z.string().trim().min(1).optional(),
    caption: z.string().nullable().optional(),
    status: postStatusSchema.optional(),
  })
  .refine(({ caption, status, title }) => caption !== undefined || status !== undefined || title !== undefined, {
    message: "Provide at least one post field to update.",
  });

export type CreatePostInput = z.input<typeof createPostSchema>;
export type UpdatePostInput = z.input<typeof updatePostSchema>;
