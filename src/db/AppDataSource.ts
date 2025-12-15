import 'reflect-metadata';
import { DataSource, type DataSourceOptions } from 'typeorm';
import { Student } from './entity/Student.entity';
import { Group } from './entity/Group.entity';
import { User } from './entity/User.entity';

const timeout = 30000;

const config: DataSourceOptions = {
  ...(process.env.POSTGRES
    ? {
      type: 'postgres',
      url: process.env.POSTGRES,
      ssl: true,
      connectTimeoutMS: timeout,
      extra: {
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: timeout,
        query_timeout: timeout,
        idle_in_transaction_session_timeout: timeout,
      },
    }
    : {
      type: 'sqlite',
      database: process.env.DB ?? './db/vki-web.db',
    }),
  synchronize: true, // Автоматическое создание/обновление схемы БД
  migrationsRun: false,
  logging: false,
  entities: [Student, Group, User],
};

const AppDataSource = new DataSource(config);

export const dbInit = async (): Promise<void> => {
  try {
    if (AppDataSource.isInitialized) {
      return;
    }
    await AppDataSource.initialize();
    console.log('✅ Database initialized successfully');
  }
  catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
};

// await dbInit();

export default AppDataSource;
