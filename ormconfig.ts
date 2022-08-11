import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Customer } from './src/entities/customer.entity';
import { Payment } from './src/entities/payment.entity';

export = {
  type: 'postgres',
  host: 'postgres',
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE_NAME,
  synchronize: false,
  entities: [Customer, Payment],
  migrations: ['build/src/migrations/*{.ts,.js}'],
} as PostgresConnectionOptions;
