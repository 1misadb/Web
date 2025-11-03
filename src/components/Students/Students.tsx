'use client';

import useStudents from '@/hooks/useStudents';
import type StudentInterface from '@/types/StudentInterface';
import type GroupInterface from '@/types/GroupInterface';
import styles from './Students.module.scss';
import Student from './Student/Student';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGroupsApi } from '@/api/groupsApi';

const Students = (): React.ReactElement => {
  const { students, deleteStudentMutate, addStudentMutate } = useStudents();
  const [newStudent, setNewStudent] = useState<Omit<StudentInterface, 'id'>>({
    firstName: '',
    lastName: '',
    middleName: '',
    contacts: '',
    groupId: undefined,
  });

  const { data: groups = [] } = useQuery<GroupInterface[]>({
    queryKey: ['groups'],
    queryFn: () => getGroupsApi(),
  });

  const onDeleteHandler = (studentId: number): void => {
    if (confirm('Удалить студента?')) {
      deleteStudentMutate(studentId);
    }
  };

  const onAddHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudent.firstName.trim() && newStudent.lastName.trim()) {
      // API ожидает объект студента (без id) — приводим к any чтобы TS не жаловался
      addStudentMutate(newStudent as any);
      setNewStudent({
        firstName: '',
        lastName: '',
        middleName: '',
        contacts: '',
        groupId: undefined,
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
          value={newStudent.lastName}
          onChange={e => setNewStudent({ ...newStudent, lastName: e.target.value })}
          placeholder="Фамилия"
          required
        />
        <input
          type="text"
          value={newStudent.middleName}
          onChange={e => setNewStudent({ ...newStudent, middleName: e.target.value })}
          placeholder="Отчество"
        />
        <select
          value={newStudent.groupId ?? ''}
          onChange={e => setNewStudent({ ...newStudent, groupId: e.target.value ? Number(e.target.value) : undefined })}
        >
          <option value="">Без группы</option>
          {groups.map((g: GroupInterface) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
        <button type="submit">Добавить студента</button>
      </form>

      {students.map((student: StudentInterface) => (
        <Student
          key={student.id}
          student={student}
          onDelete={onDeleteHandler}
        />
      ))}
    </div>
  );
};

export default Students;
