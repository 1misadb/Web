import { NextResponse, type NextRequest } from 'next/server';
import { userService } from '@/services/UserService';
import { signJwt } from '@/utils/jwt';
import { initializeDatabase } from '@/db/AppDataSource';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await initializeDatabase();
    
    const body = await request.json();
    const { email, password } = body ?? {};

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Необходимо указать email и пароль' },
        { status: 400 },
      );
    }

    const user = await userService.verifyCredentials(email, password);

    if (!user || !user.isActive) {
      return NextResponse.json(
        { message: 'Неверный логин или пароль' },
        { status: 401 },
      );
    }

    const token = signJwt({
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
    });

    const response = NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    });

    response.cookies.set({
      name: 'accessToken',
      value: token,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 2 * 2, 
    });

    return response;
  }
  catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Ошибка входа' },
      { status: 500 },
    );
  }
}

