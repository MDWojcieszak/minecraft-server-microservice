import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SystemUsageService } from 'src/system-usage/system-usage.service';

@Controller('system-usage')
export class SystemUsageController {
  constructor(private systemUsageService: SystemUsageService) {}
}
