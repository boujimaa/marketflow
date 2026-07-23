import { z } from "zod";
import { workspaceIdSchema } from "./workspace";

const postIdSchema = z.string().uuid();
const nullableCaptionSchema = z.string().max(5000).nullable();
const publishingOptionsSchema = z.record(z.string(), z.json()).default({});

export const createDraftSchema = z.object({
  workspaceId: workspaceIdSchema,
  title: z.string().trim().min(1).max(200).default("Untitled draft"),
  content: nullableCaptionSchema.default(""),
  publishingOptions: publishingOptionsSchema,
  mediaIds: z.array(z.string().uuid()).max(10).default([]),
  socialAccountIds: z.array(z.string().uuid()).min(1).max(10).default([]),
});

export const updateDraftSchema = z
  .object({
    workspaceId: workspaceIdSchema,
    draftId: postIdSchema,
    title: z.string().trim().min(1).max(200).optional(),
    content: nullableCaptionSchema.optional(),
    publishingOptions: publishingOptionsSchema.optional(),
  })
  .refine(
    ({ content, publishingOptions, title }) =>
      content !== undefined || publishingOptions !== undefined || title !== undefined,
    { message: "Provide at least one draft field to update." },
  );

export const draftIdSchema = z.object({
  workspaceId: workspaceIdSchema,
  draftId: postIdSchema,
});

export const draftMediaSchema = draftIdSchema.extend({
  mediaId: z.string().uuid(),
  sortOrder: z.number().int().nonnegative().default(0),
});

export const draftSocialAccountSchema = draftIdSchema.extend({
  socialAccountId: z.string().uuid(),
});

export const listDraftsSchema = z.object({
  workspaceId: workspaceIdSchema,
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(24),
  search: z.string().trim().min(1).max(255).optional(),
});
