import { z } from "zod";
import { workspaceIdSchema } from "./workspace";

export const MARKETFLOW_MEDIA_BUCKET = "marketflow-media";
export const MAX_IMAGE_FILE_SIZE_BYTES = 500 * 1024 * 1024;
export const MAX_VIDEO_FILE_SIZE_BYTES = 2 * 1024 * 1024 * 1024;

export const imageMimeTypeSchema = z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]);
export const videoMimeTypeSchema = z.enum(["video/mp4", "video/webm", "video/quicktime"]);
export const mediaMimeTypeSchema = z.union([imageMimeTypeSchema, videoMimeTypeSchema]);

export const mediaFileSchema = z
  .custom<File>((value): value is File => value instanceof File, "A file is required.")
  .refine((file) => mediaMimeTypeSchema.safeParse(file.type).success, "Unsupported media type.")
  .refine(
    (file) =>
      file.type.startsWith("image/")
        ? file.size <= MAX_IMAGE_FILE_SIZE_BYTES
        : file.size <= MAX_VIDEO_FILE_SIZE_BYTES,
    "The selected file exceeds the allowed size.",
  );

export const uploadMediaSchema = z.object({
  workspaceId: workspaceIdSchema,
  file: mediaFileSchema,
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
});

export const listMediaSchema = z.object({
  workspaceId: workspaceIdSchema,
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(24),
  search: z.string().trim().min(1).max(255).optional(),
});

export const deleteMediaSchema = z.object({
  workspaceId: workspaceIdSchema,
  mediaId: z.string().uuid(),
});

export type UploadMediaInput = z.input<typeof uploadMediaSchema>;
export type ListMediaInput = z.input<typeof listMediaSchema>;
export type DeleteMediaInput = z.input<typeof deleteMediaSchema>;
