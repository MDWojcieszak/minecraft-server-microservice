import { Module } from '@nestjs/common';
import { ProcessService } from './process.service';
import { HubConnectionModule } from 'src/hub-connection/hub-connection.module';

@Module({
  imports: [HubConnectionModule],
  providers: [ProcessService],
  exports: [ProcessService],
})
export class ProcessModule {}
