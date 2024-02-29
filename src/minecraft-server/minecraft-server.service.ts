import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { createWriteStream } from 'fs';
import { StartServerDto } from './dto';
import {
  ProcessMessageEvent,
  ProcessStatus,
  ProcessStatusEvent,
} from 'src/minecraft-server/events';

@Injectable()
export class MinecraftServerService {
  constructor(@Inject('HUB') private hubClient: ClientProxy) {}

  handleStartServer(data: any) {
    console.log(data);
    this.hubClient.emit('server_message', { data: 'message_test' });
  }

  private minecraftServerProcess: ChildProcessWithoutNullStreams;
  private processId: string;

  startMinecraftServer(dto: StartServerDto) {
    try {
      this.processId = dto.id;
      this.createProcess();

      const logStream = createWriteStream('server.log', { flags: 'a' });
      this.minecraftServerProcess.stdout.pipe(logStream);
      this.minecraftServerProcess.stderr.pipe(logStream);

      this.setupListeners();
      this.hubClient.emit(
        'status',
        new ProcessStatusEvent(this.processId, ProcessStatus.ONGOING),
      );
    } catch (e) {
      this.hubClient.emit(
        'status',
        new ProcessStatusEvent(this.processId, ProcessStatus.FAILED),
      );
    }
  }

  stopMinecraftServer() {
    if (this.minecraftServerProcess) {
      this.sendCommandToMinecraftServer('stop');
    }
  }

  killMinecraftServer() {
    if (this.minecraftServerProcess) {
      this.minecraftServerProcess.kill();
    }
  }

  sendCommandToMinecraftServer(command: string) {
    if (this.minecraftServerProcess && !this.minecraftServerProcess.killed) {
      this.minecraftServerProcess.stdin.write(`${command}\n`);
    } else {
      console.error('Minecraft server process is not running.');
    }
  }

  createProcess() {
    this.minecraftServerProcess = spawn(
      'java',
      ['-Xmx1024M', '-Xms1024M', '-jar', 'server.jar', 'nogui'],
      { cwd: 'minecraft/1.20.4', stdio: ['pipe', 'pipe', 'pipe'] },
    );
  }

  setupListeners() {
    if (!this.minecraftServerProcess || this.minecraftServerProcess.killed) {
      this.killProcess();
      return this.hubClient.emit(
        'status',
        new ProcessStatusEvent(this.processId, ProcessStatus.FAILED),
      );
    }
    this.minecraftServerProcess.on('error', (code) => {
      this.killProcess();
      return this.hubClient.emit(
        'status',
        new ProcessStatusEvent(
          this.processId,
          ProcessStatus.FAILED,
          `Error occured - code:${code}`,
        ),
      );
    });
    this.minecraftServerProcess.stdout.on('data', (data) => {
      this.hubClient.emit(
        'message',
        new ProcessMessageEvent(this.processId, data.toString()),
      );
    });

    this.minecraftServerProcess.stdout.on('end', () => {
      this.hubClient.emit(
        'status',
        new ProcessStatusEvent(this.processId, ProcessStatus.ENDED),
      );
    });

    this.minecraftServerProcess.stdout.on('close', () => {
      this.hubClient.emit(
        'status',
        new ProcessStatusEvent(this.processId, ProcessStatus.CLOSED),
      );
    });
  }

  killProcess() {
    if (this.minecraftServerProcess && !this.minecraftServerProcess.killed)
      return;
    this.minecraftServerProcess.kill();
  }
}
