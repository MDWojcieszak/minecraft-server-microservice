import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ProcessStatus } from 'src/common/enums';
import {
  ProcessMessageEvent,
  ProcessStatusEvent,
  RegisterProcessEvent,
} from 'src/process/events';

@Injectable()
export class ProcessService {
  constructor(@Inject('HUB') private hubClient: ClientProxy) {}

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

  async postMessage(processId: string, massage: string) {
    this.hubClient.emit(
      'process.register-log',
      new ProcessMessageEvent(processId, massage),
    );
  }
}
