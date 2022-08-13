import { Customer } from '../entities/customer.entity';
import { Payment } from '../entities/payment.entity';
import { seed } from './utils';

/**
 * Amount in ms for odd month
 */
const ODD_MONTH = 31 * 24 * 60 * 60 * 1000;

/**
 * Returns a random number in the given interval
 *
 * @param min - min number of interval
 * @param max - max number of interval
 *
 * @returns {number}
 */
const random = (min: number, max: number) => Math.random() * (max - min) + min;

/**
 * Returns a random integer number in the given interval
 *
 * @param min - min number of interval
 * @param max - max number of interval
 *
 * @returns {number}
 */
const randomInt = (min: number, max: number) => Math.floor(random(min, max));

/**
 * Returns random Payments for seed
 *
 * @returns {Payment[]}
 */
const generatePayments = (customer: Customer) =>
  [...new Array(randomInt(0, 75))].map(() =>
    Object.assign(new Payment(), {
      amount: Number(random(5, 2500).toFixed(2)),
      customer,
      date: new Date(randomInt(Date.now() - 4 * ODD_MONTH, Date.now())),
    } as Payment),
  );

/**
 * Returns random Customers for seed
 *
 * @returns {Customer[]}
 */
const generateCustomers = () => [...new Array(5)].map(() => new Customer());

seed(generateCustomers, generatePayments);
