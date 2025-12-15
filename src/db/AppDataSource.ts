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
    
    // Автоматически создаем тестовых пользователей, если их нет
    await createDefaultUsersIfNeeded();
  }
  catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
};

// Функция для создания тестовых пользователей
const createDefaultUsersIfNeeded = async (): Promise<void> => {
  try {
    const { hashPassword } = await import('@/utils/password');
    const { User } = await import('./entity/User.entity');
    
    const defaultUsers = [
      {
        email: 'admin@example.com',
        fullName: 'Администратор Системы',
        password: hashPassword('admin123'),
        isActive: true,
      },
      {
        email: 'manager@example.com',
        fullName: 'Менеджер Учебного Отдела',
        password: hashPassword('manager123'),
        isActive: true,
      },
    ];

    const repository = AppDataSource.getRepository(User);
    
    for (const userData of defaultUsers) {
      const exists = await repository.findOne({
        where: { email: userData.email },
      });

      if (!exists) {
        await repository.save(repository.create(userData));
        console.log(`✅ Created default user: ${userData.email}`);
      }
    }
  }
  catch (error) {
    // Не критично, если не удалось создать пользователей
    console.warn('⚠️ Could not create default users:', error);
  }
};

// await dbInit();

export default AppDataSource;
