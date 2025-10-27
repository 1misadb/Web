'use client';

import useStudents from '@/hooks/useStudents';
import type StudentInterface from '@/types/StudentInterface';
import styles from './Students.module.scss';
import Student from './Student/Student';
import { useState } from 'react';

const Students = (): React.ReactElement => {
  const { students, deleteStudentMutate, addStudentMutate } = useStudents();
  const [newStudent, setNewStudent] = useState<Omit<StudentInterface, 'id'>>({
    firstName: '',
    lastsName: '',
    middleName: ''
  });

  const onDeleteHandler = (studentId: number): void => {
    if (confirm('Удалить студента?')) {
      deleteStudentMutate(studentId);
    }
  };

  const onAddHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      newStudent.firstName.trim() &&
      newStudent.lastsName.trim()
    ) {
      addStudentMutate(newStudent as StudentInterface); 
      setNewStudent({
        firstName: '',
        lastsName: '',
        middleName: ''
      });
    }
  };

  return (
    <div className={styles.Students}>
      <form onSubmit={onAddHandler} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={newStudent.firstName}
          onChange={e => setNewStudent({ ...newStudent, firstName: e.target.value })}
          placeholder="Имя"
          required
        />
        <input
          type="text"
          value={newStudent.lastsName}
          onChange={e => setNewStudent({ ...newStudent, lastsName: e.target.value })}
          placeholder="Фамилия"
          required
        />
        <input
          type="text"
          value={newStudent.middleName}
          onChange={e => setNewStudent({ ...newStudent, middleName: e.target.value })}
          placeholder="Отчество"
        />
        <button type="submit">Добавить студента</button>
      </form>
      {students.map((student: StudentInterface) => (
        <Student
          key={student.id || Math.random()}
          student={student}
          onDelete={onDeleteHandler}
        />
      ))}
    </div>
  );
};

export default Students;
