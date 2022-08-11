import { Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Payment } from './payment.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Payment, (payment) => payment.customer)
  payments: Payment[];
}
