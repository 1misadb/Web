import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  contacts!: string;

  // Убрана связь @OneToMany для избежания циклической зависимости при сохранении
  // Студенты загружаются через запросы в groupDb.ts
}
