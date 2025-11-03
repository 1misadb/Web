import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import type { Student } from './Student.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  contacts!: string;

  // avoid circular static import — require default export of Student at runtime
  @OneToMany(() => require('./Student.entity').default, (student: any) => student.group)
  students!: any[];
}

// make default export as well to ensure require(...).default resolves consistently
export default Group;
