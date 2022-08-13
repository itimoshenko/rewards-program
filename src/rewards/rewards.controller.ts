import { Controller, Get } from '@nestjs/common';
import { Rewards, RewardsService } from './rewards.service';

@Controller('rewards')
/**
 * Controller providing methods for rewards
 */
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get()
  /**
   * Returns the aggregation by customers which contain rewards for the last month and the last three months
   *
   * @returns {Promise<Rewards>}
   */
  getAll(): Promise<Rewards> {
    return this.rewardsService.getAll();
  }
}
