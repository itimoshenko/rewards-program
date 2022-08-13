import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { Payment } from '../entities/payment.entity';

/**
 * Payment database record interface
 */
interface DBPaymentRecord extends Omit<Payment, 'customer'> {
  customerId: number;
}

/**
 * Reward interface
 */
interface Reward {
  lastMonth: number;
  lastThreeMonths: number;
}

/**
 * Rewards aggregation interface
 */
export type Rewards = Record<number, Reward>;

@Injectable()
/**
 * Service providing methods for rewards
 */
export class RewardsService {
  constructor(private dataSource: DataSource) {}

  /**
   * Returns the date that is the first day of the month
   *
   * @returns {Date}
   */
  private static getMonthFirstDay() {
    const date = new Date();

    date.setUTCDate(1);
    date.setUTCHours(0);
    date.setMinutes(0);
    date.setUTCSeconds(0);

    return date;
  }

  /**
   * Returns the calculated reward by amount
   *
   * @param amount
   *
   * @returns {number}
   */
  private static getRewardFromAmount(amount: number) {
    return amount - 50 + (amount - 100);
  }

  /**
   * Returns the aggregation by customers which contain rewards for the last month and the last three months
   *
   * @param payments
   *
   * @returns {Rewards}
   */
  private static getRewardsFromPayments(payments: DBPaymentRecord[]): Rewards {
    const result = payments.reduce((aggregation: Rewards, payment) => {
      if (!aggregation[payment.customerId]) {
        aggregation[payment.customerId] = {
          lastMonth: 0,
          lastThreeMonths: 0,
        };
      }

      if (
        payment.date.valueOf() > RewardsService.getMonthFirstDay().valueOf()
      ) {
        aggregation[payment.customerId].lastMonth = Number(
          (
            aggregation[payment.customerId].lastMonth +
            RewardsService.getRewardFromAmount(payment.amount)
          ).toFixed(2),
        );
      }

      aggregation[payment.customerId].lastThreeMonths = Number(
        (
          aggregation[payment.customerId].lastThreeMonths +
          RewardsService.getRewardFromAmount(payment.amount)
        ).toFixed(2),
      );
      return aggregation;
    }, {});

    return result;
  }

  /**
   * Returns the aggregation by customers which contain rewards for the last month and the last three months
   *
   * @returns {Promise<Rewards>}
   */
  async getAll(): Promise<Rewards> {
    try {
      const paymentsForLastThreeMonths = (await this.dataSource
        .createQueryBuilder()
        .select('*')
        .from(Payment, 'payment')
        .where(
          `payment.date > (select date_trunc('month', current_date) - INTERVAL '2 MONTHs')`,
        )
        .execute()) as DBPaymentRecord[];

      return RewardsService.getRewardsFromPayments(paymentsForLastThreeMonths);
    } catch (e) {
      return [];
    }
  }
}
