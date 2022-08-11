import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Customer } from '../entities/customer.entity';
import { Payment } from '../entities/payment.entity';

import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Payment])],
  controllers: [RewardsController],
  providers: [RewardsService],
})
export class RewardsModule {}
