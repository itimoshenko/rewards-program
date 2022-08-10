import 'dotenv/config';
import 'reflect-metadata';

import { DataSource } from 'typeorm';

import ormconfig = require('../ormconfig');

export const AppDataSource = new DataSource({
  ...ormconfig,
  host: 'localhost',
});
