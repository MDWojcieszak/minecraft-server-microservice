
import { Inject, Controller } from '@nestjs/common';
import { MinecraftServerService } from './minecraft-server.service';
import { ClientProxy, EventPattern } from '@nestjs/microservices';

@Controller('minecraft-server')
export class MinecraftServerController {
    constructor(
        private minecrafService: MinecraftServerService){}
    
    @EventPattern('start_server')
    startServer(data: any){
        console.log(data);
        this.minecrafService.startMinecraftServer()
    }

    @EventPattern('stop_server')
    stopServer(data: any) {
        console.log(data);
        this.minecrafService.stopMinecraftServer()
    }
}
