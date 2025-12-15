import AppDataSource, { dbInit } from '@/db/AppDataSource';
import { User } from '@/db/entity/User.entity';

export async function GET(): Promise<Response> {
  try {
    await dbInit();

    const repository = AppDataSource.getRepository(User);
    const users = await repository.find({
      select: ['id', 'email', 'fullName', 'isActive'],
    });

    return new Response(JSON.stringify({
      count: users.length,
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        fullName: u.fullName,
        isActive: u.isActive,
      })),
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  catch (error) {
    console.error('Error checking users:', error);
    return new Response(JSON.stringify({
      error: 'Failed to check users',
      message: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

