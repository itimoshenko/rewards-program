import { HttpModule } from '@nestjs/axios';
import {
  TerminusModule,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';

import { HealthController } from './health.controller';

describe('HealthController', () => {
  let health: HealthCheckService;
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule, HttpModule],
      controllers: [HealthController],
    }).compile();

    health = module.get<HealthCheckService>(HealthCheckService);
    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('checkRewardService()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('HealthCheckService check should call 1 time', () => {
      const mockFn = jest.fn();

      jest.spyOn(health, 'check').mockImplementation(mockFn);

      controller.checkRewardService();

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('HttpHealthIndicator pingCheck should call 1 time', () => {
      const mockFn = jest.fn();

      jest
        .spyOn(HttpHealthIndicator.prototype, 'pingCheck')
        .mockImplementation(mockFn);

      controller.checkRewardService();

      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('checkDatabase()', () => {
    it('HealthCheckService check should call 1 time', () => {
      const mockFn = jest.fn();

      jest.spyOn(health, 'check').mockImplementation(mockFn);

      controller.checkDatabase();

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('TypeOrmHealthIndicator pingCheck should call 1 time', () => {
      const mockFn = jest.fn();

      jest
        .spyOn(TypeOrmHealthIndicator.prototype, 'pingCheck')
        .mockImplementation(mockFn);

      controller.checkDatabase();

      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
});
