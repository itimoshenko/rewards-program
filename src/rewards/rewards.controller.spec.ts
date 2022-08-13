import { Test, TestingModule } from '@nestjs/testing';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';

const getAllMock = jest.fn();

jest.mock('./rewards.service', () => {
  return {
    RewardsService: jest.fn().mockImplementation(() => {
      return { getAll: getAllMock };
    }),
  };
});

describe('RewardsController', () => {
  let controller: RewardsController;

  beforeEach(async () => {
    getAllMock.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RewardsController],
      providers: [RewardsService],
    }).compile();

    controller = module.get<RewardsController>(RewardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('RewardsService getAll should call 1 time', () => {
      controller.getAll();

      expect(getAllMock).toHaveBeenCalledTimes(1);
    });
  });
});
