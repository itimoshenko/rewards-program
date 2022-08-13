import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { RewardsService } from './rewards.service';

describe('RewardsService', () => {
  let service: RewardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RewardsService,
        {
          provide: DataSource,
          useFactory: async () => {
            return {
              createQueryBuilder: jest.fn().mockImplementation(() => ({
                select: jest.fn().mockReturnThis(),
                from: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                execute: jest.fn().mockReturnValue([]),
              })),
            };
          },
        },
      ],
    }).compile();

    service = module.get<RewardsService>(RewardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMonthFirstDay()', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(1660414032171));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should be the first of the month', () => {
      expect(RewardsService.getMonthFirstDay().valueOf()).toEqual(
        1659312000000,
      );
    });
  });

  describe('getRewardFromAmount()', () => {
    it('should be zero points', () => {
      expect(RewardsService.getRewardFromAmount(0)).toEqual(0);
    });

    it('should be zero points', () => {
      expect(RewardsService.getRewardFromAmount(50)).toEqual(0);
    });

    it('should be 1 point', () => {
      expect(RewardsService.getRewardFromAmount(51)).toEqual(1);
    });

    it('should be 50 points', () => {
      expect(RewardsService.getRewardFromAmount(100)).toEqual(50);
    });

    it('should be 52 points', () => {
      expect(RewardsService.getRewardFromAmount(101)).toEqual(52);
    });

    it('should be zero points', () => {
      expect(RewardsService.getRewardFromAmount(50.4)).toEqual(0);
    });

    it('should be zero points', () => {
      expect(RewardsService.getRewardFromAmount(50.5)).toEqual(0);
    });

    it('should be 1 point', () => {
      expect(RewardsService.getRewardFromAmount(51.4)).toEqual(1);
    });

    it('should be 1 point', () => {
      expect(RewardsService.getRewardFromAmount(51.5)).toEqual(1);
    });

    it('should be 50 points', () => {
      expect(RewardsService.getRewardFromAmount(100.4)).toEqual(50);
    });

    it('should be 50 points', () => {
      expect(RewardsService.getRewardFromAmount(100.5)).toEqual(50);
    });

    it('should be 52 points', () => {
      expect(RewardsService.getRewardFromAmount(101.4)).toEqual(52);
    });

    it('should be 52 points', () => {
      expect(RewardsService.getRewardFromAmount(101.5)).toEqual(52);
    });

    it('should be zero points', () => {
      expect(RewardsService.getRewardFromAmount(-50)).toEqual(0);
    });

    it('should be zero points', () => {
      expect(RewardsService.getRewardFromAmount(-51)).toEqual(0);
    });

    it('should be zero points', () => {
      expect(RewardsService.getRewardFromAmount(-100)).toEqual(0);
    });

    it('should be zero points', () => {
      expect(RewardsService.getRewardFromAmount(-101)).toEqual(0);
    });
  });

  describe('getAll()', () => {
    it('RewardsService getRewardsFromPayments should call 1 time', async () => {
      const mockFn = jest.fn().mockReturnValue({});

      jest
        .spyOn(RewardsService, 'getRewardsFromPayments')
        .mockImplementation(mockFn);

      await service.getAll();

      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('getRewardsFromPayments()', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(1660414032171));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return an empty object', () => {
      const result = RewardsService.getRewardsFromPayments([]);

      expect(
        Object.entries(result).length === 0 && result.constructor === Object,
      ).toBeTruthy();
    });

    it('should return a result object', () => {
      const result = RewardsService.getRewardsFromPayments([
        {
          id: 1,
          amount: 50,
          date: new Date(),
          customerId: 1,
        },
        {
          id: 2,
          amount: 51,
          date: new Date(),
          customerId: 1,
        },
        {
          id: 3,
          amount: 100,
          date: new Date(),
          customerId: 1,
        },
        {
          id: 4,
          amount: -100,
          date: new Date(),
          customerId: 2,
        },
        {
          id: 5,
          amount: 101,
          date: new Date(),
          customerId: 2,
        },
        {
          id: 6,
          amount: 5,
          date: new Date(),
          customerId: 2,
        },
      ]);

      expect(result['1'].lastMonth).toEqual(51);
      expect(result['1'].lastThreeMonths).toEqual(51);

      expect(result['2'].lastMonth).toEqual(52);
      expect(result['2'].lastThreeMonths).toEqual(52);
    });
  });
});
