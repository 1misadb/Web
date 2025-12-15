import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import type { Student } from './Student.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  contacts!: string;

  @OneToMany('Student', 'group', {
    cascade: false, // Отключено для избежания циклической зависимости при сохранении
    eager: false,
  })
  students!: Student[];
}
