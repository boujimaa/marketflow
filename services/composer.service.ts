import {
  createDraftSchema,
  draftIdSchema,
  draftMediaSchema,
  draftSocialAccountSchema,
  listDraftsSchema,
  updateDraftSchema,
} from "@/lib/validation/composer.validation";
import { MediaRepository } from "@/repositories/media.repository";
import { ComposerRepository } from "@/repositories/composer.repository";

function extractMatches(content: string | null, expression: RegExp): string[] {
  if (!content) return [];
  return [...content.matchAll(expression)].map((match) => match[1]);
}

export class ComposerService {
  constructor(
    private readonly composer: ComposerRepository,
    private readonly media: MediaRepository,
  ) {}

  async createDraft(input: unknown) {
    const { mediaIds, publishingOptions, socialAccountIds, workspaceId, ...draft } = createDraftSchema.parse(input);
    const created = await this.composer.createDraft({
      workspace_id: workspaceId,
      title: draft.title,
      caption: draft.content,
      publishing_options: publishingOptions,
      status: "draft",
    });

    await Promise.all([
      ...mediaIds.map((mediaId, sortOrder) =>
        this.composer.attachMedia(workspaceId, created.id, mediaId, sortOrder),
      ),
      ...socialAccountIds.map((socialAccountId) =>
        this.composer.selectSocialAccount(workspaceId, created.id, socialAccountId),
      ),
    ]);

    return created;
  }

  async updateDraft(input: unknown) {
    const { content, draftId, publishingOptions, title, workspaceId } = updateDraftSchema.parse(input);
    return this.composer.updateDraft(draftId, workspaceId, {
      ...(title !== undefined ? { title } : {}),
      ...(content !== undefined ? { caption: content } : {}),
      ...(publishingOptions !== undefined ? { publishing_options: publishingOptions } : {}),
    });
  }

  async autoSaveDraft(input: unknown) {
    return this.updateDraft(input);
  }

  async deleteDraft(input: unknown): Promise<void> {
    const { draftId, workspaceId } = draftIdSchema.parse(input);
    await this.composer.deleteDraft(draftId, workspaceId);
  }

  async duplicateDraft(input: unknown) {
    const { draftId, workspaceId } = draftIdSchema.parse(input);
    const source = await this.composer.findDraft(draftId, workspaceId);
    if (!source) throw new Error("Draft not found.");

    const [media, socialAccounts] = await Promise.all([
      this.composer.listAttachedMedia(workspaceId, source.id),
      this.composer.listSelectedSocialAccounts(workspaceId, source.id),
    ]);

    return this.createDraft({
      workspaceId,
      title: `${source.title} (copy)`,
      content: source.caption,
      publishingOptions: source.publishing_options,
      mediaIds: media.map(({ id }) => id),
      socialAccountIds: socialAccounts.map(({ id }) => id),
    });
  }

  async attachMedia(input: unknown): Promise<void> {
    const { draftId, mediaId, sortOrder, workspaceId } = draftMediaSchema.parse(input);
    await this.requireDraft(draftId, workspaceId);
    await this.composer.attachMedia(workspaceId, draftId, mediaId, sortOrder);
  }

  async removeAttachedMedia(input: unknown): Promise<void> {
    const { draftId, mediaId, workspaceId } = draftMediaSchema.parse(input);
    await this.requireDraft(draftId, workspaceId);
    await this.composer.removeMedia(workspaceId, draftId, mediaId);
  }

  async selectSocialAccount(input: unknown): Promise<void> {
    const { draftId, socialAccountId, workspaceId } = draftSocialAccountSchema.parse(input);
    await this.requireDraft(draftId, workspaceId);
    await this.composer.selectSocialAccount(workspaceId, draftId, socialAccountId);
  }

  async removeSocialAccount(input: unknown): Promise<void> {
    const { draftId, socialAccountId, workspaceId } = draftSocialAccountSchema.parse(input);
    await this.requireDraft(draftId, workspaceId);
    await this.composer.removeSocialAccount(workspaceId, draftId, socialAccountId);
  }

  async listDrafts(input: unknown) {
    const { page, pageSize, search, workspaceId } = listDraftsSchema.parse(input);
    const result = await this.composer.listDrafts(workspaceId, {
      from: (page - 1) * pageSize,
      search,
      to: page * pageSize - 1,
    });

    return { ...result, page, pageSize, totalPages: Math.ceil(result.total / pageSize) };
  }

  async getPreviewData(input: unknown) {
    const { draftId, workspaceId } = draftIdSchema.parse(input);
    const draft = await this.requireDraft(draftId, workspaceId);
    const [media, socialAccounts] = await Promise.all([
      this.composer.listAttachedMedia(workspaceId, draftId),
      this.composer.listSelectedSocialAccounts(workspaceId, draftId),
    ]);

    return {
      title: draft.title,
      content: draft.caption ?? "",
      hashtags: extractMatches(draft.caption, /(?:^|\s)#([^\s#]+)/g),
      mentions: extractMatches(draft.caption, /(?:^|\s)@([^\s@]+)/g),
      publishingOptions: draft.publishing_options,
      media: media.map((item) => ({
        ...item,
        previewUrl: this.media.getPublicPreviewUrl(item.storage_path),
      })),
      socialAccounts: socialAccounts.map(
        ({
          created_at,
          id,
          provider,
          provider_user_id,
          status,
          token_expires_at,
          updated_at,
          workspace_id,
        }) => ({
          created_at,
          id,
          provider,
          provider_user_id,
          status,
          token_expires_at,
          updated_at,
          workspace_id,
        }),
      ),
    };
  }

  private async requireDraft(draftId: string, workspaceId: string) {
    const draft = await this.composer.findDraft(draftId, workspaceId);
    if (!draft) throw new Error("Draft not found.");
    return draft;
  }
}
