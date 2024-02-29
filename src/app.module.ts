import { Module } from '@nestjs/common';
import { MinecraftServerService } from './minecraft-server/minecraft-server.service';
import { MinecraftServerModule } from './minecraft-server/minecraft-server.module';
import { ConfigModule } from '@nestjs/config';
import { config } from './config/config';

@Module({
  imports: [
    MinecraftServerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
  ],
})
export class AppModule {}
