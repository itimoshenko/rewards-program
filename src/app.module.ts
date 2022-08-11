import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import ormconfig from '../ormconfig';

import { HealthModule } from './health/health.module';
import { RewardsModule } from './rewards/rewards.module';

@Module({
  imports: [TypeOrmModule.forRoot(ormconfig), RewardsModule, HealthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
