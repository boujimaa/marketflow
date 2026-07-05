export type MetaPlatform = "facebook" | "instagram";

export type MetaConnectionStatus = "connected" | "disconnected" | "pending";

export type MetaConnectedAccount = {
  id: string;
  name: string;
  platform: MetaPlatform;
  status: MetaConnectionStatus;
  accountType: "facebook_page" | "instagram_business";
  externalId?: string;
};
