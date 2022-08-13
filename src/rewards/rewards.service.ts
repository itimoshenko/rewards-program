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
  public static getMonthFirstDay() {
    const date = new Date();

    date.setUTCDate(1);
    date.setUTCHours(0);
    date.setMinutes(0);
    date.setUTCSeconds(0);
    date.setMilliseconds(0);

    return date;
  }

  /**
   * Returns the calculated reward by amount
   *
   * @param amount
   *
   * @returns {number}
   */
  public static getRewardFromAmount(amount: number) {
    const truncedAmount = Math.trunc(amount);

    if (truncedAmount <= 50) {
      return 0;
    }

    if (truncedAmount <= 100) {
      return truncedAmount - 50;
    }

    return truncedAmount - 50 + (truncedAmount - 100);
  }

  /**
   * Returns the aggregation by customers which contain rewards for the last month and the last three months
   *
   * @param payments
   *
   * @returns {Rewards}
   */
  public static getRewardsFromPayments(payments: DBPaymentRecord[]): Rewards {
    return payments.reduce((aggregation: Rewards, payment) => {
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
  }

  /**
   * Returns the aggregation by customers which contain rewards for the last month and the last three months
   *
   * @returns {Promise<Rewards>}
   */
  async getAll(): Promise<Rewards> {
    const paymentsForLastThreeMonths = (await this.dataSource
      .createQueryBuilder()
      .select('*')
      .from(Payment, 'payment')
      .where(
        `payment.date > (select date_trunc('month', current_date) - INTERVAL '2 MONTHs')`,
      )
      .execute()) as DBPaymentRecord[];

    return RewardsService.getRewardsFromPayments(paymentsForLastThreeMonths);
  }
}
