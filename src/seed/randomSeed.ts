import { Customer } from '../entities/customer.entity';
import { Payment } from '../entities/payment.entity';
import { seed } from './utils';

const ODD_MONTH = 31 * 24 * 60 * 60 * 1000;

const random = (min: number, max: number) => Math.random() * (max - min) + min;

const randomInt = (min: number, max: number) => Math.floor(random(min, max));

const generatePayments = (customer: Customer) =>
  [...new Array(randomInt(0, 75))].map(() =>
    Object.assign(new Payment(), {
      amount: Number(random(5, 2500).toFixed(2)),
      customer,
      date: new Date(randomInt(Date.now() - 4 * ODD_MONTH, Date.now())),
    } as Payment),
  );

const generateCustomers = () => [...new Array(5)].map(() => new Customer());

seed(generateCustomers, generatePayments);
