import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import type { Group } from './Group.entity';

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

  @ManyToOne(() => {
    // Динамический импорт для избежания циклической зависимости
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('./Group.entity').Group;
  }, (group: Group) => group.students)
  @JoinColumn({ name: 'groupId' })
  group!: Group;

  @Column()
  groupId!: number;
}
