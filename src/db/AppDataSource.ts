import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Group } from './entity/Group.entity';
import { Student } from './entity/Student.entity';
import { User } from './entity/User.entity';
import { hashPassword } from '@/utils/password';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DB ?? './db/vki-web.db',
  entities: [Group, Student, User],
  synchronize: true,
  logging: false,
});

let initializationPromise: Promise<void> | null = null;

const ensureSeedUsers = async (): Promise<void> => {
  try {
    const repository = AppDataSource.getRepository(User);
    const defaultUsers = [
      {
        email: 'admin@example.com',
        fullName: 'Администратор системы',
        password: hashPassword('admin123'),
      },
      {
        email: 'manager@example.com',
        fullName: 'Менеджер проекта',
        password: hashPassword('manager123'),
      },
    ];

    await Promise.all(defaultUsers.map(async user => {
      const exists = await repository.findOne({
        where: { email: user.email },
      });

      if (!exists) {
        await repository.save(repository.create(user));
      }
    }));
  } catch (error) {
    console.error('Error seeding users:', error);
    // Не пробрасываем ошибку, чтобы не блокировать инициализацию БД
  }
};

export const initializeDatabase = async (): Promise<void> => {
  if (!initializationPromise) {
    initializationPromise = AppDataSource.initialize()
      .then(async () => {
        console.log('Data Source has been initialized!');
        if (AppDataSource.isInitialized) {
          await ensureSeedUsers();
        }
      })
      .catch((err) => {
        console.error('Error during Data Source initialization:', err);
        initializationPromise = null; 
        throw err;
      });
  }
  return initializationPromise;
};

export const getDataSource = (): DataSource => {
  if (!AppDataSource.isInitialized) {
    throw new Error('DataSource not initialized. Call initializeDatabase() first.');
  }
  return AppDataSource;
};

export default AppDataSource;