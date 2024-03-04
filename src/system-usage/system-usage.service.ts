import { Injectable } from '@nestjs/common';
import * as si from 'systeminformation';

@Injectable()
export class SystemUsageService {
  async getSystemUsage() {
    try {
      const cpuData = await si.cpu();
      const memData = await si.mem();
      const diskData = await si.fsSize();
      console.log(cpuData, memData, diskData);
      return {
        cpu: cpuData,
        memory: memData,
        disk: diskData,
      };
    } catch (error) {
      console.error('Error retrieving system information:', error);
      throw error;
    }
  }
}
