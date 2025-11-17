import { NextResponse } from 'next/server';
import { getStudentsDb } from '@/db/studentDb';

export async function GET() {
  try {
    const students = await getStudentsDb();
    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const studentData = await request.json();
    const { addStudentDb } = await import('@/db/studentDb');
    const newStudent = await addStudentDb(studentData);
    return NextResponse.json(newStudent);
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}