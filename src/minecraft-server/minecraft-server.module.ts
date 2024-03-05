import { Module } from '@nestjs/common';
import { MinecraftServerService } from './minecraft-server.service';
import { MinecraftServerController } from './minecraft-server.controller';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HubConnectionModule } from 'src/hub-connection/hub-connection.module';

@Module({
  imports: [HubConnectionModule],
  providers: [MinecraftServerService],
  controllers: [MinecraftServerController],
})
export class MinecraftServerModule {}
