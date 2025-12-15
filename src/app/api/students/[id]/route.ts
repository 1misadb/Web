import { NextResponse } from 'next/server';
import { deleteStudentDb } from '@/db/studentDb';
import { studentService } from '@/services/StudentService';
import { dbInit } from '@/db/AppDataSource';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    await dbInit();
    const { id: idParam } = await params;
    const id = parseInt(idParam, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid student ID' },
        { status: 400 },
      );
    }

    const student = await studentService.getStudentById(id);

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(student);
  }
  catch (error) {
    console.error('Error fetching student:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    await dbInit();
    const { id: idParam } = await params;
    const id = parseInt(idParam, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid student ID' },
        { status: 400 },
      );
    }

    await deleteStudentDb(id);
    return NextResponse.json({ id });
  }
  catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
