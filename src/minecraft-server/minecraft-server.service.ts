import { Injectable } from '@nestjs/common';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { createWriteStream } from 'fs';
import { SendCommandDto, StartServerDto } from './dto';

import { ServerSettingsService } from 'src/server-settings/server-settings.service';
import { ProcessStatus, ServerCategory } from 'src/common/enums';
import { StopServerDto } from 'src/minecraft-server/dto/stop-server.dto';
import { ProcessService } from 'src/process/process.service';

@Injectable()
export class MinecraftServerService {
  constructor(
    private serverSettings: ServerSettingsService,
    private processService: ProcessService,
  ) {}

  private minecraftServerProcess: ChildProcessWithoutNullStreams;
  private processId: string;

  async handleStartServer(dto: StartServerDto) {
    const settings = this.serverSettings.getMinecrsftServerSettings();
    const res = await this.processService.registerProcess(
      dto.context.categoryId,
      dto.context.userId,
      ServerCategory.MINECRAFT_SERVER,
    );

    if (!res) return false;
    if (this.minecraftServerProcess && !this.minecraftServerProcess.killed)
      return false;

    try {
      this.processId = res;
      this.createProcess(settings.min_memory, settings.min_memory);
      const logStream = createWriteStream('server.log', { flags: 'a' });
      this.minecraftServerProcess.stdout.pipe(logStream);
      this.minecraftServerProcess.stderr.pipe(logStream);
      this.setupListeners();
      this.processService.postStatus(res, ProcessStatus.STARTED);
      return true;
    } catch (e) {
      this.processService.postStatus(res, ProcessStatus.FAILED);
      return false;
    }
  }

  createProcess(minMemory: number, maxMemory: number) {
    this.minecraftServerProcess = spawn(
      'java',
      [`-Xmx${maxMemory}M`, `-Xms${minMemory}M`, '-jar', 'server.jar', 'nogui'],
      { cwd: 'minecraft/1.20.4', stdio: ['pipe', 'pipe', 'pipe'] },
    );
  }

  handleStopServer(dto: StopServerDto) {
    try {
      if (this.minecraftServerProcess) {
        this.sendCommandToMinecraftServer({ command: 'stop' });
      }
    } catch (e) {}
    return true;
  }

  handleKillServer() {
    if (this.minecraftServerProcess) {
      this.minecraftServerProcess.kill();
    }
    return true;
  }

  sendCommandToMinecraftServer(dto: SendCommandDto) {
    if (this.minecraftServerProcess && !this.minecraftServerProcess.killed) {
      this.minecraftServerProcess.stdin.write(`${dto.command}\n`);
    } else {
      console.error('Minecraft server process is not running.');
    }
  }

  setupListeners() {
    if (!this.minecraftServerProcess || this.minecraftServerProcess.killed) {
      this.killProcess();
      return this.processService.postStatus(
        this.processId,
        ProcessStatus.FAILED,
      );
    }
    this.minecraftServerProcess.on('error', (code) => {
      this.killProcess();
      return this.processService.postStatus(
        this.processId,
        ProcessStatus.FAILED,
      );
    });
    this.minecraftServerProcess.stdout.on('data', (data) => {
      return this.processService.postMessage(this.processId, data.toString());
    });

    this.minecraftServerProcess.stdout.on('end', () => {
      return this.processService.postStatus(
        this.processId,
        ProcessStatus.ENDED,
      );
    });

    this.minecraftServerProcess.stdout.on('close', () => {
      return this.processService.postStatus(
        this.processId,
        ProcessStatus.CLOSED,
      );
    });
  }

  killProcess() {
    if (this.minecraftServerProcess && !this.minecraftServerProcess.killed)
      return;
    this.minecraftServerProcess.kill();
  }
}
