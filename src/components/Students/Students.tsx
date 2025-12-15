// src/components/Students/Students.tsx
'use client';

import { useStudents } from '@/hooks/useStudents';
import Student from './Student/Student';
import AddStudent, { type FormFields } from './AddStudent/AddStudent'; // ← ИМПОРТ + ТИП
import { v4 as uuidv4 } from 'uuid';

const Students = (): React.ReactElement => {
  const {
    students,
    deleteStudent,
    addStudent, // ← ИСПРАВИТЬ: addStudent, а не addStudentMutate
    isLoading,
  } = useStudents();

  const handleAdd = (form: FormFields): void => {
    addStudent({
      id: -1,
      uuid: uuidv4(),
      ...form,
    });
  };

  if (isLoading) return <div>Загрузка студентов...</div>;

  return (
    <div>
      <AddStudent onAdd={handleAdd} />

      <div className="mt-6 space-y-4">
        {students.map(student => (
          <Student
            key={student.id || student.uuid}
            student={student}
            onDelete={deleteStudent}
          />
        ))}
      </div>
    </div>
  );
};

export default Students;
