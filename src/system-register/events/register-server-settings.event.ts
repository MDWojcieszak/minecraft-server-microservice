export enum SettingType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
}

export type ServerSetting = {
  settingName: string;
  settingValue: string;
  settingType: SettingType;
  category: string;
};

export class RegisterServerSettingsEvent {
  constructor(
    public readonly serverName: string,
    public readonly settings: ServerSetting[],
  ) {}
}
