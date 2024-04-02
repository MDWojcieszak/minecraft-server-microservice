import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CommandStatus, LogLevel, ProcessStatus } from 'src/common/enums';
import {
  CommandStatusEvent,
  ProcessMessageEvent,
  ProcessStatusEvent,
  RegisterProcessEvent,
} from 'src/process/events';

@Injectable()
export class ProcessService {
  constructor(
    @Inject('HUB') private hubClient: ClientProxy,
    private config: ConfigService,
  ) {}

  async registerProcess(categoryId: string, userId: string, name: string) {
    return await firstValueFrom(
      this.hubClient.send(
        'process.register',
        new RegisterProcessEvent(categoryId, userId, name),
      ),
    );
  }

  async postStatus(processId: string, status: ProcessStatus) {
    this.hubClient.emit(
      'process.status',
      new ProcessStatusEvent(processId, status),
    );
  }

  async postMessage(processId: string, massage: string, level?: LogLevel) {
    this.hubClient.emit(
      'process.register-log',
      new ProcessMessageEvent(processId, massage, level),
    );
  }

  async postCommandStatus(
    commandName: string,
    category: string,
    runningProgress?: number,
    status?: CommandStatus,
  ) {
    this.hubClient.emit(
      'commands.update',
      new CommandStatusEvent(
        this.config.get('SERVER_NAME'),
        commandName,
        category,
        runningProgress,
        status,
      ),
    );
  }
}
