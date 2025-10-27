import { addStudentDb } from '@/db/studentDb'; 
import { getStudentsDb } from '@/db/studentDb';

export async function GET(): Promise<Response> {
  try {
    const students = await getStudentsDb();
    return new Response(JSON.stringify(students), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch students' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json(); 

    if (!body.firstName || !body.lastsName) {
      return new Response(
        JSON.stringify({ error: 'firstName and lastsName are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const newStudent = await addStudentDb(body);

    if (!newStudent) {
      return new Response(
        JSON.stringify({ error: 'Failed to add student' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(newStudent),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('>>> POST /api/students error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}