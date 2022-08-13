import { AppDataSource } from '../data-source';
import { Customer } from '../entities/customer.entity';
import { Payment } from '../entities/payment.entity';

/**
 * Returns Customers for seed
 *
 * @returns {Customer[]}
 */
type GetCustomers = () => Customer[];
/**
 * Returns Payments for seed
 *
 * @returns {Payment[]}
 */
type GetPayments = (customer: Customer) => Payment[];

/**
 * Seed initial data to database
 *
 * @param getCustomers - Should returns Customers for seed
 * @param getPayments - Should returns Payments for seed
 */
export const seed = async (
  getCustomers: GetCustomers,
  getPayments: GetPayments,
) => {
  const dataSource = await AppDataSource.initialize();

  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const customers = getCustomers();
    const savedCustomers = await queryRunner.manager.save(customers);

    const payments = savedCustomers.reduce(
      (allPayments, customer) => allPayments.concat(getPayments(customer)),
      [],
    );

    await queryRunner.manager.save(payments);

    await queryRunner.commitTransaction();
  } catch (err) {
    console.log(err);

    // since we have errors lets rollback the changes we made
    await queryRunner.rollbackTransaction();
  } finally {
    // you need to release a queryRunner which was manually instantiated
    await queryRunner.release();
  }
};
