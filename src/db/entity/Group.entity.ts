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

  @OneToMany(() => {
    // Ленивая загрузка для избежания циклической зависимости при инициализации
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Student } = require('./Student.entity');
    return Student;
  }, (student: Student) => student.group, {
    cascade: false, // Отключено для избежания циклической зависимости при сохранении
    eager: false,
  })
  students!: Student[];
}
