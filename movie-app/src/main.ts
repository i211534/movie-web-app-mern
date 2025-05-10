import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';


import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Enable CORS
    app.enableCors({
        origin: 'http://localhost:4000', // Update this with your frontend URL if different
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    

    // Connect Microservice
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: 8877 },
    });
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.TCP,
        options: { host: '127.0.0.2', port: 8878 },
    });
// Serve static files from the uploads directory
app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
    await app.startAllMicroservices();
    await app.listen(3000);
}

bootstrap();
