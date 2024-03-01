import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { createWriteStream } from 'fs';
import { SendCommandDto, StartServerDto } from './dto';
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
    if (this.minecraftServerProcess && !this.minecraftServerProcess.killed)
      return false;
    try {
      this.processId = dto.id;
      this.createProcess(dto);

      const logStream = createWriteStream('server.log', { flags: 'a' });
      this.minecraftServerProcess.stdout.pipe(logStream);
      this.minecraftServerProcess.stderr.pipe(logStream);

      this.setupListeners();
      return ProcessStatus.STARTED;
    } catch (e) {
      return ProcessStatus.FAILED;
    }
  }

  stopMinecraftServer() {
    try {
      if (this.minecraftServerProcess) {
        this.sendCommandToMinecraftServer({ command: 'stop' });
      }
    } catch (e) {}
    return ProcessStatus.ENDED;
  }

  killMinecraftServer() {
    if (this.minecraftServerProcess) {
      this.minecraftServerProcess.kill();
    }
  }

  sendCommandToMinecraftServer(dto: SendCommandDto) {
    if (this.minecraftServerProcess && !this.minecraftServerProcess.killed) {
      this.minecraftServerProcess.stdin.write(`${dto.command}\n`);
    } else {
      console.error('Minecraft server process is not running.');
    }
  }

  createProcess(params: Pick<StartServerDto, 'minMemory' | 'maxMemory'>) {
    this.minecraftServerProcess = spawn(
      'java',
      [
        `-Xmx${params.maxMemory}M`,
        `-Xms${params.minMemory}M`,
        '-jar',
        'server.jar',
        'nogui',
      ],
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
        'process-message',
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
