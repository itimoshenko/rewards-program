import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { Customer } from './customer.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('real')
  amount: number;

  @Index()
  @Column('timestamp without time zone')
  date: Date;

  @ManyToOne(() => Customer, (customer) => customer.payments)
  customer: Customer;
}
