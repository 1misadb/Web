import AppDataSource from '@/db/AppDataSource';
import { User } from '@/db/entity/User.entity';
import type UserInterface from '@/types/UserInterface';
import { hashPassword, verifyPassword } from '@/utils/password';

export class UserService {
  private get repository(): ReturnType<typeof AppDataSource.getRepository> {
    if (!AppDataSource.isInitialized) {
      throw new Error('AppDataSource is not initialized');
    }

    return AppDataSource.getRepository(User);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({ where: { email } }) as User;
  }

  async createUser(userData: Omit<UserInterface, 'id' | 'password'> & { password: string }): Promise<User> {
    const user = this.repository.create({
      ...userData,
      password: hashPassword(userData.password),
    });

    return await this.repository.save(user) as User;
  }

  async verifyCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);

    if (!user) {
      console.log('User not found in database:', email);
      return null;
    }

    console.log('User found:', { email: user.email, isActive: user.isActive });
    const isValid = verifyPassword(password, user.password);

    if (!isValid) {
      console.log('Password verification failed for:', email);
      return null;
    }

    console.log('Password verification successful for:', email);
    return user;
  }
}

export const userService = new UserService();
