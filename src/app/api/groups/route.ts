import { NextResponse } from 'next/server';
import { getGroupsDb } from '@/db/groupDb';

export async function GET(): Promise<NextResponse> {
  try {
    const groups = await getGroupsDb();
    return NextResponse.json(groups);
  }
  catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const groupData = await request.json();
    const { addGroupsDb } = await import('@/db/groupDb');
    const newGroup = await addGroupsDb(groupData);
    return NextResponse.json(newGroup);
  }
  catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
