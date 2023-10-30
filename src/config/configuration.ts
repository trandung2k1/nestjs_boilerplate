import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EntitySubscriber } from 'src/shared/base/entity.subcriber';
/* eslint-disable prettier/prettier */
export enum DATABASE {
  DEFAULT = 'default',
}

export default (): {
  port: string | number;
  jwtSecret: string;
  database: TypeOrmModuleOptions;
} => ({
  port: process.env.PORT || 4000,
  jwtSecret: process.env.APP_SECRET,
  database: {
    name: DATABASE.DEFAULT,
    type: 'mssql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true, //process.env.NODE_ENV !== "prod",
    subscribers: [EntitySubscriber],
    entities:
      process.env.NODE_ENV === 'prod'
        ? ['dist/shared/entities/*/*.js']
        : ['dist/shared/entities/*/*.js'],
    autoLoadEntities: true,
    logging: ['error'],
    options: {
      trustServerCertificate: true,
      connectTimeout: 30000,
    },
    connectionTimeout: 30000,
    requestTimeout: 30000,
  },
});
