export interface RemoteConfigs {
  allow_multiplayer: boolean;
  show_ads: boolean;
};

export const RemoteConfigDefaults: Required<RemoteConfigs> = {
  allow_multiplayer: true,
  show_ads: true,
};
