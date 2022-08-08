import { Controller, Get } from '@nestjs/common';
import { RewardsService } from './rewards.service';

@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get()
  getAll() {
    return this.rewardsService.getAll();
  }
}
