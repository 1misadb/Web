import { Student } from './entity/Student.entity';
import { Group } from './entity/Group.entity';
import type StudentInterface from '@/types/StudentInterface';
import getRandomFio from '@/utils/getRandomFio';
import AppDataSource, { dbInit } from './AppDataSource';

const getStudentRepository = async (): Promise<ReturnType<typeof AppDataSource.getRepository>> => {
  await dbInit();
  return AppDataSource.getRepository(Student);
};

const getGroupRepository = async (): Promise<ReturnType<typeof AppDataSource.getRepository>> => {
  await dbInit();
  return AppDataSource.getRepository(Group);
};

/**
 * Получение студентов
 */
export const getStudentsDb = async (): Promise<StudentInterface[]> => {
  const studentRepository = await getStudentRepository();
  const groupRepository = await getGroupRepository();
  
  const students = await studentRepository.find() as StudentInterface[];
  
  // Загружаем группы для каждого студента вручную
  for (const student of students) {
    if (student.groupId) {
      const group = await groupRepository.findOne({
        where: { id: student.groupId },
      });
      if (group) {
        (student as any).group = group;
      }
    }
  }
  
  return students;
};

/**
 * Удаление студента
 */
export const deleteStudentDb = async (studentId: number): Promise<number> => {
  const repository = await getStudentRepository();
  await repository.delete(studentId);
  return studentId;
};

/**
 * Добавление студента
 */
export const addStudentDb = async (studentFields: Omit<StudentInterface, 'id'>): Promise<StudentInterface> => {
  const repository = await getStudentRepository();
  const groupRepository = await getGroupRepository();
  
  // Создаем студента только с groupId (без связи)
  const newStudent = await repository.save({
    firstName: studentFields.firstName,
    lastName: studentFields.lastName,
    middleName: studentFields.middleName,
    contacts: studentFields.contacts || '',
    uuid: studentFields.uuid || '',
    groupId: studentFields.groupId,
  }) as StudentInterface;

  // Загружаем группу вручную для возврата
  if (newStudent.groupId) {
    const group = await groupRepository.findOne({
      where: { id: newStudent.groupId },
    });
    if (group) {
      (newStudent as any).group = group;
    }
  }

  return newStudent;
};

/**
 * Добавление рандомных студентов
 */
export const addRandomStudentsDb = async (amount: number = 10): Promise<StudentInterface[]> => {
  const repository = await getStudentRepository();
  const groupRepository = await getGroupRepository();
  const students: StudentInterface[] = [];

  for (let i = 0; i < amount; i++) {
    const fio = getRandomFio();

    const newStudent = await repository.save({
      ...fio,
      contacts: 'contact',
      groupId: 1,
    }) as StudentInterface;

    // Загружаем группу вручную
    if (newStudent.groupId) {
      const group = await groupRepository.findOne({
        where: { id: newStudent.groupId },
      });
      if (group) {
        (newStudent as any).group = group;
      }
    }

    students.push(newStudent);
  }

  return students;
};
