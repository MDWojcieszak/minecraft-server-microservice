import { Module } from '@nestjs/common';
import { MinecraftServerService } from './minecraft-server/minecraft-server.service';
import { MinecraftServerModule } from './minecraft-server/minecraft-server.module';
import { ConfigModule } from '@nestjs/config';
import { config } from './config/config';
import { SystemUsageModule } from './system-usage/system-usage.module';

@Module({
  imports: [
    MinecraftServerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    SystemUsageModule,
  ],
})
export class AppModule {}
