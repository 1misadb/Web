import { NextResponse } from 'next/server';

export async function POST(): Promise<NextResponse> {
  const response = NextResponse.json({ message: 'Выход выполнен' });

  response.cookies.delete('accessToken');

  return response;
}
