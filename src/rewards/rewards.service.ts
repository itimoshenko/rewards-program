import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { Payment } from '../entities/payment.entity';

interface DBPaymentRecord extends Omit<Payment, 'customer'> {
  customerId: number;
}

interface Reward {
  lastMonth: number;
  lastThreeMonths: number;
}

type Rewards = Record<number, Reward>;

@Injectable()
export class RewardsService {
  constructor(private dataSource: DataSource) {}

  private static getMonthFirstDay() {
    const date = new Date();

    date.setUTCDate(1);
    date.setUTCHours(0);
    date.setMinutes(0);
    date.setUTCSeconds(0);

    return date;
  }

  private static getRewardFromAmount(amount: number) {
    return amount - 50 + (amount - 100);
  }

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
