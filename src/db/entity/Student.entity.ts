import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  // Убрана связь @ManyToOne для избежания циклической зависимости при сохранении
  // Группа загружается вручную через запросы в studentDb.ts
  @Column()
  groupId!: number;
}
