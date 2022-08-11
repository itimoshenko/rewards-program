import { Customer } from '../entities/customer.entity';
import { Payment } from '../entities/payment.entity';
import { customers, payments } from './seedData';
import { seed } from './utils';

const getCustomers = () =>
  customers.map((customer) => Object.assign(new Customer(), customer));
const getPayments = () =>
  payments.map((payment) =>
    Object.assign(new Payment(), payment, { date: new Date(payment.date) }),
  );

seed(getCustomers, getPayments);
