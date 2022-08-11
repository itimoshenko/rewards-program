import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import ormconfig from '../ormconfig';

import { RewardsModule } from './rewards/rewards.module';

@Module({
  imports: [TypeOrmModule.forRoot(ormconfig), RewardsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
