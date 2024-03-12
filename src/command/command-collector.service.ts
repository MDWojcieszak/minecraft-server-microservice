import { Injectable } from '@nestjs/common';

import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { Command } from 'src/common/decorators';

@Injectable()
export class CommandCollectorSerice {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  getAll(): Command[] {
    const metadata = [];
    const controllers = this.discoveryService.getControllers();

    if (controllers && controllers.length > 0) {
      controllers.forEach((controller) => {
        const instance = controller.instance;
        const prototype = Object.getPrototypeOf(instance);

        const methodsNames = this.metadataScanner.scanFromPrototype(
          instance,
          prototype,
          (name) => this.extractMetadata(instance, prototype, name),
        );

        methodsNames.forEach((methodName) => {
          const commandMetadata = Reflect.getMetadata(
            'command_metadata',
            instance[methodName],
          );

          if (commandMetadata) {
            metadata.push({ ...commandMetadata });
          }
        });
      });
    }
    return metadata;
  }

  private extractMetadata(instance: any, prototype: any, methodName: string) {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, methodName);
    return descriptor?.value ? methodName : null;
  }
}
