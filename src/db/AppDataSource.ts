import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Group } from './entity/Group.entity';
import { Student } from './entity/Student.entity';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DB ?? './db/vki-web.db',
  entities: [Group, Student],
  synchronize: true,
  logging: false,
});

let initializationPromise: Promise<void> | null = null;

export const initializeDatabase = async (): Promise<void> => {
  if (!initializationPromise) {
    initializationPromise = AppDataSource.initialize()
      .then(() => {
        console.log('Data Source has been initialized!');
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