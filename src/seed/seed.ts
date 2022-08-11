import { AppDataSource } from '../data-source';
import { Customer } from '../entities/customer.entity';
import { Payment } from '../entities/payment.entity';

(async () => {
  const ODD_MONTH = 31 * 24 * 60 * 60 * 1000;

  const random = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const randomInt = (min: number, max: number) => Math.floor(random(min, max));

  const generatePayments = (customer: Customer) =>
    [...new Array(randomInt(0, 75))].map(() =>
      Object.assign(new Payment(), {
        amount: random(5, 2500).toFixed(2),
        customer,
        date: new Date(randomInt(Date.now() - 4 * ODD_MONTH, Date.now())),
      }),
    );

  const generateCustomers = () => [...new Array(5)].map(() => new Customer());

  const dataSource = await AppDataSource.initialize();

  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const generatedCustomers = generateCustomers();
    const savedCustomers = await queryRunner.manager.save(generatedCustomers);

    const generatedPayments = savedCustomers.reduce(
      (allPayments, customer) => allPayments.concat(generatePayments(customer)),
      [],
    );

    const savedPayments = await queryRunner.manager.save(generatedPayments);

    await queryRunner.commitTransaction();
  } catch (err) {
    console.log(err);

    // since we have errors lets rollback the changes we made
    await queryRunner.rollbackTransaction();
  } finally {
    // you need to release a queryRunner which was manually instantiated
    await queryRunner.release();
  }
})();
