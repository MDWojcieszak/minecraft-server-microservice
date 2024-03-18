import { ProcessStatus } from 'src/common/enums';

export class ProcessStatusEvent {
  constructor(
    public readonly processId: string,
    public readonly status: ProcessStatus,
  ) {}
}
