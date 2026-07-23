import type { MetaGraphApi } from "./graph-api";

export type MetaInstagramBusinessAccount = {
  id: string;
  username: string;
  profilePictureUrl: string | null;
};

type InstagramResponse = {
  instagram_business_account?: { id?: string; username?: string; profile_picture_url?: string };
};

export async function getInstagramBusinessAccount(
  graph: MetaGraphApi,
  facebookPageId: string,
): Promise<MetaInstagramBusinessAccount | null> {
  const response = await graph.get<InstagramResponse>(`/${facebookPageId}`, {
    fields: "instagram_business_account{id,username,profile_picture_url}",
  });
  const account = response.instagram_business_account;

  if (!account?.id || !account.username) return null;
  return {
    id: account.id,
    username: account.username,
    profilePictureUrl: account.profile_picture_url ?? null,
  };
}
