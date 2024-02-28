import { Module } from '@nestjs/common';
import { MinecraftServerService } from './minecraft-server/minecraft-server.service';
import { MinecraftServerModule } from './minecraft-server/minecraft-server.module';


@Module({
  imports: [MinecraftServerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
