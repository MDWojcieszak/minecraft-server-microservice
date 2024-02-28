import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { createWriteStream } from 'fs';

@Injectable()
export class MinecraftServerService {

    constructor(        @Inject('HUB') private hubClient: ClientProxy
    ){}

    handleStartServer (data:any){
        console.log(data)
        this.hubClient.emit("server_message", {data: 'message_test'})

    }

    private minecraftServerProcess: ChildProcessWithoutNullStreams;
  
    startMinecraftServer() {
      this.minecraftServerProcess = spawn('java', ['-Xmx1024M', '-Xms1024M', '-jar', 'server.jar', 'nogui'], {cwd: 'server'});
  
      const logStream = createWriteStream('server.log', { flags: 'a' });
      this.minecraftServerProcess.stdout.pipe(logStream);
      this.minecraftServerProcess.stderr.pipe(logStream);
      this.minecraftServerProcess.stdout.on('data', (data)=>{
        const message = data.toString();
        this.hubClient.emit("server_message", {message: message})

        console.log(data.toString())
      })
    }
  
    stopMinecraftServer() {
      if (this.minecraftServerProcess) {
        this.minecraftServerProcess.kill();
      }
    }
  
    // You can add methods to interact with the Minecraft server
}
