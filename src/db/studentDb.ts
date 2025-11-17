import { Student } from './entity/Student.entity';
import type StudentInterface from '@/types/StudentInterface';
import getRandomFio from '@/utils/getRandomFio';
import { getDataSource, initializeDatabase } from './AppDataSource';

const getStudentRepository = async () => {
  await initializeDatabase();
  return getDataSource().getRepository(Student);
};

/**
 * Получение студентов
 */
export const getStudentsDb = async (): Promise<StudentInterface[]> => {
  const repository = await getStudentRepository();
  // Явно загружаем связанную группу
  return await repository.find({
    relations: ['group'] // это загрузит связанные группы
  });
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
  const student = new Student();
  
  // Создаем студента с группой
  const newStudent = await repository.save({
    ...student,
    ...studentFields,
  });
  
  // Загружаем студента с группой для возврата
  return await repository.findOne({
    where: { id: newStudent.id },
    relations: ['group']
  }) as StudentInterface;
};

/**
 * Добавление рандомных студентов
 */
export const addRandomStudentsDb = async (amount: number = 10): Promise<StudentInterface[]> => {
  const repository = await getStudentRepository();
  const students: StudentInterface[] = [];

  for (let i = 0; i < amount; i++) {
    const fio = getRandomFio();

    const student = new Student();
    const newStudent = await repository.save({
      ...student,
      ...fio,
      contacts: 'contact',
      groupId: 1,
    });
    
    // Загружаем с группой
    const studentWithGroup = await repository.findOne({
      where: { id: newStudent.id },
      relations: ['group']
    }) as StudentInterface;
    
    students.push(studentWithGroup);
  }

  return students;
};