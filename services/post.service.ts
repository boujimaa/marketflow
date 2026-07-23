import { createPostSchema, updatePostSchema } from "@/lib/validation/post";
import { workspaceIdSchema } from "@/lib/validation/workspace";
import { PostRepository } from "@/repositories/post.repository";

export class PostService {
  constructor(private readonly posts: PostRepository) {}

  async createPost(input: unknown) {
    const post = createPostSchema.parse(input);
    const createdPost = await this.posts.create({
      workspace_id: post.workspaceId,
      title: post.title,
      caption: post.caption ?? null,
      status: post.status,
    });

    await this.posts.createVersion({
      workspace_id: createdPost.workspace_id,
      post_id: createdPost.id,
      caption: createdPost.caption,
      version_number: 1,
    });

    return createdPost;
  }

  async getPost(workspaceId: string, postId: string) {
    return this.posts.findById(postId, workspaceIdSchema.parse(workspaceId));
  }

  async listPosts(workspaceId: string) {
    return this.posts.listByWorkspace(workspaceIdSchema.parse(workspaceId));
  }

  async updatePost(input: unknown) {
    const { postId, workspaceId, ...changes } = updatePostSchema.parse(input);
    const updatedPost = await this.posts.update(postId, workspaceId, changes);

    if (changes.caption !== undefined) {
      const latestVersion = await this.posts.findLatestVersion(postId, workspaceId);

      await this.posts.createVersion({
        workspace_id: workspaceId,
        post_id: postId,
        caption: updatedPost.caption,
        version_number: (latestVersion?.version_number ?? 0) + 1,
      });
    }

    return updatedPost;
  }
}
