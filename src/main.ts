import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { config } from './config/config';
import { ValidationPipe } from '@nestjs/common/pipes';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: config().rabbitMQConfig,
    },
  );
  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen();
}
bootstrap();
