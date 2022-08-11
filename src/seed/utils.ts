import { AppDataSource } from '../data-source';
import { Customer } from '../entities/customer.entity';
import { Payment } from '../entities/payment.entity';

export const seed = async (
  getCustomers: () => Customer[],
  getPayments: (customer: Customer) => Payment[],
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
