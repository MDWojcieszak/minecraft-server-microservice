import { Module } from '@nestjs/common';
import { SystemRegisterService } from './system-register.service';
import { SystemRegisterController } from './system-register.controller';
import { HubConnectionModule } from 'src/hub-connection/hub-connection.module';
import { SystemUsageModule } from 'src/system-usage/system-usage.module';
import { CommandCollectorSerice } from 'src/command/command-collector.service';
import { CommandModule } from 'src/command/command.module';

@Module({
  imports: [HubConnectionModule, SystemUsageModule, CommandModule],
  providers: [SystemRegisterService],
  controllers: [SystemRegisterController],
  exports: [SystemRegisterService],
})
export class SystemRegisterModule {}
