import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export = {
  type: 'postgres',
  host: 'postgres',
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE_NAME,
  synchronize: false,
  entities: [],
  migrations: ['build/src/migrations/*{.ts,.js}'],
} as PostgresConnectionOptions;
