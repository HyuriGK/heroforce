import 'reflect-metadata';

import { config } from 'dotenv';
import { resolve } from 'node:path';
import { DataSource } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';

config({ path: resolve(process.cwd(), '../.env') });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL must be defined to run TypeORM migrations.');
}

export default new DataSource({
  type: 'postgres',
  url: databaseUrl,
  entities: [Project, User],
  migrations: [resolve(__dirname, 'migrations', '*{.ts,.js}')],
  synchronize: false,
});
