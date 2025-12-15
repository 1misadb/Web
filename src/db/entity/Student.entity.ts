import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Group } from './Group.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: '' })
  uuid?: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  middleName!: string;

  @Column({ default: '' })
  contacts?: string;

  @ManyToOne(() => Group, group => group.students)
  @JoinColumn({ name: 'groupId' })
  group!: Group;

  @Column()
  groupId!: number;
}
