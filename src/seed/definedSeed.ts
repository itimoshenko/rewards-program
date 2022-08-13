import { Customer } from '../entities/customer.entity';
import { Payment } from '../entities/payment.entity';
import { customers, payments } from './seedData';
import { seed } from './utils';

/**
 * Returns defined Customers for seed
 *
 * @returns {Customer[]}
 */
const getCustomers = () =>
  customers.map((customer) =>
    Object.assign(new Customer(), customer as Customer),
  );

/**
 * Returns defined Payments for seed
 *
 * @returns {Payment[]}
 */
const getPayments = () =>
  payments.map((payment) =>
    Object.assign(new Payment(), {
      ...payment,
      date: new Date(payment.date),
    } as Payment),
  );

seed(getCustomers, getPayments);
