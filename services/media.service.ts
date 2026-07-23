import {
  deleteMediaSchema,
  imageMimeTypeSchema,
  listMediaSchema,
  uploadMediaSchema,
} from "@/lib/validation/media.validation";
import { MediaRepository } from "@/repositories/media.repository";

const fileExtensions: Record<string, string> = {
  "image/gif": "gif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "video/mp4": "mp4",
  "video/quicktime": "mov",
  "video/webm": "webm",
};

export class MediaService {
  constructor(private readonly media: MediaRepository) {}

  async uploadMedia(input: unknown) {
    const { file, height, width, workspaceId } = uploadMediaSchema.parse(input);
    const extension = fileExtensions[file.type];
    const now = new Date();
    const storagePath = `${workspaceId}/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${crypto.randomUUID()}.${extension}`;

    await this.media.uploadFile(storagePath, file);

    try {
      const record = await this.media.create({
        workspace_id: workspaceId,
        file_name: file.name,
        file_type: file.type,
        storage_path: storagePath,
        size: file.size,
        width: width ?? null,
        height: height ?? null,
      });

      return { ...record, previewUrl: this.media.getPublicPreviewUrl(storagePath) };
    } catch (error) {
      await this.media.deleteFile(storagePath);
      throw error;
    }
  }

  async listMedia(input: unknown) {
    const { page, pageSize, search, workspaceId } = listMediaSchema.parse(input);
    const result = await this.media.listByWorkspace(workspaceId, {
      from: (page - 1) * pageSize,
      search,
      to: page * pageSize - 1,
    });

    return {
      ...result,
      items: result.items.map((item) => ({
        ...item,
        previewUrl: this.media.getPublicPreviewUrl(item.storage_path),
      })),
      page,
      pageSize,
      totalPages: Math.ceil(result.total / pageSize),
    };
  }

  async deleteMedia(input: unknown): Promise<void> {
    const { mediaId, workspaceId } = deleteMediaSchema.parse(input);
    const record = await this.media.findById(mediaId, workspaceId);

    if (!record) throw new Error("Media not found.");

    await this.media.deleteFile(record.storage_path);
    await this.media.deleteById(record.id, workspaceId);
  }

  isImageMimeType(fileType: string): boolean {
    return imageMimeTypeSchema.safeParse(fileType).success;
  }
}
