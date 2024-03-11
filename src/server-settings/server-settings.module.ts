import { Module } from '@nestjs/common';

import { HubConnectionModule } from 'src/hub-connection/hub-connection.module';
import { ServerSettingsController } from 'src/server-settings/server-settings.controller';
import { ServerSettingsService } from 'src/server-settings/server-settings.service';

@Module({
  imports: [HubConnectionModule],
  providers: [ServerSettingsService],
  controllers: [ServerSettingsController],
})
export class ServerSettingsModule {}
