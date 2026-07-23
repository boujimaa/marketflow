import type { MetaGraphApi } from "./graph-api";

export type MetaFacebookPage = {
  id: string;
  name: string;
  accessToken: string;
  profilePictureUrl: string | null;
};

type PagesResponse = {
  data?: Array<{ id?: string; name?: string; access_token?: string; picture?: { data?: { url?: string } } }>;
};

export async function getFacebookPages(graph: MetaGraphApi): Promise<MetaFacebookPage[]> {
  const response = await graph.get<PagesResponse>("/me/accounts", {
    fields: "id,name,access_token,picture{url}",
  });

  return (response.data ?? []).flatMap((page) => {
    if (!page.id || !page.name || !page.access_token) return [];
    return [{
      id: page.id,
      name: page.name,
      accessToken: page.access_token,
      profilePictureUrl: page.picture?.data?.url ?? null,
    }];
  });
}
