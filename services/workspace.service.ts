import { renameWorkspaceSchema, workspaceIdSchema } from "@/lib/validation/workspace";
import { WorkspaceRepository } from "@/repositories/workspace.repository";

export class WorkspaceService {
  constructor(private readonly workspaces: WorkspaceRepository) {}

  async getWorkspace(workspaceId: string) {
    return this.workspaces.findById(workspaceIdSchema.parse(workspaceId));
  }

  async listWorkspacesForUser(userId: string) {
    return this.workspaces.listForUser(workspaceIdSchema.parse(userId));
  }

  async renameWorkspace(input: unknown) {
    const { name, workspaceId } = renameWorkspaceSchema.parse(input);
    return this.workspaces.updateName(workspaceId, name);
  }
}
