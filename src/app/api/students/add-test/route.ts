import { studentService } from '@/services/StudentService';
import { dbInit } from '@/db/AppDataSource';

export async function GET(): Promise<Response> {
  await dbInit();
  const students = await studentService.addRandomStudents();

  return new Response(JSON.stringify(students), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
