export enum ProcessStatus {
  STARTED = 'STARTED',
  ONGOING = 'ONGOING',
  UNKNOWN = 'UNKNOWN',
  CLOSED = 'CLOSED',
  ENDED = 'ENDED',
  FAILED = 'FAILED',
}

export class ProcessStatusEvent {
  constructor(
    public readonly id: string,
    public readonly status: ProcessStatus,
    public readonly message?: string,
  ) {}
}
