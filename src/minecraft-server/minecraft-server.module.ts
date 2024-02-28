import { Module } from '@nestjs/common';
import { MinecraftServerService } from './minecraft-server.service';
import { MinecraftServerController } from './minecraft-server.controller';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports:[
    ClientsModule.register([
      {name:'HUB',
      transport: Transport.TCP,
      options: {
        host:'192.168.1.127',
        port: 4000
      }
    }
    ])
  ],
  providers: [MinecraftServerService],
  controllers: [MinecraftServerController]
})
export class MinecraftServerModule {}
