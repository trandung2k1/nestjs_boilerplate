import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cluster from 'cluster';
import * as os from 'os';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { createDatabaseIfNotExists } from './createDatabaseIfNotExists';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './shared/exceptions/all-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationError, useContainer } from 'class-validator';
async function bootstrap(): Promise<void> {
  //create database if doesn't exist
  await createDatabaseIfNotExists();
  setTimeout(async () => {
    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter({ bodyLimit: 50 * 1048576 }),
    );
    const { httpAdapter } = app.get(HttpAdapterHost);
    //filter all exception
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
    //validate
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        exceptionFactory: (errors: ValidationError[]) => {
          console.log(errors);
        },
      }),
    );
    //create swagger
    const config = new DocumentBuilder()
      .setTitle('Api documentation')
      .setDescription('The API description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    // app.use(express.json({ limit: '50mb' }));
    // app.use(express.urlencoded({ limit: '50mb', extended: false }));

    //Enable cors
    app.enableCors({
      origin: [
        'http://localhost:3000',
        'http://localhost:8000',
        'http://localhost:5173',
      ],
      credentials: true,
      exposedHeaders: ['Authorization'],
      allowedHeaders: ['Authorization'],
    });
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    retryToStart(app, 10);
  }, 2500);
}
//Automatically start the application after a crash
async function retryToStart(app: INestApplication, retryTime?: number) {
  if (!retryTime) {
    console.log('Không thể khởi chạy máy chủ');
    return;
  }
  try {
    await app.listen(process.env.PORT, () => {
      console.log(`http://localhost:${process.env.PORT || 4000}`);
    });
  } catch (error) {
    setTimeout(async () => {
      await retryToStart(app, retryTime--);
    }, 1000);
  }
}
// setup cluster
if ((cluster as any).isMaster) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    (cluster as any).fork();
  }
  (cluster as any).on('exit', (worker: cluster.Worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log(`Worker ${worker.process.pid} has been killed`);
    console.log('Starting another worker');
    (cluster as any).fork();
  });
} else {
  bootstrap();
}
