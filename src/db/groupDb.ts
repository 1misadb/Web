import { Group } from './entity/Group.entity';
import { Student } from './entity/Student.entity';
import AppDataSource, { dbInit } from './AppDataSource';
import type GroupInterface from '@/types/GroupInterface';

const getGroupRepository = async (): Promise<ReturnType<typeof AppDataSource.getRepository>> => {
  await dbInit();
  return AppDataSource.getRepository(Group);
};

const getStudentRepository = async (): Promise<ReturnType<typeof AppDataSource.getRepository>> => {
  await dbInit();
  return AppDataSource.getRepository(Student);
};

/**
 * Получение групп
 */
export const getGroupsDb = async (): Promise<GroupInterface[]> => {
  const groupRepository = await getGroupRepository();
  const studentRepository = await getStudentRepository();
  
  const groups = await groupRepository.find() as GroupInterface[];
  
  // Загружаем студентов для каждой группы вручную
  for (const group of groups) {
    const students = await studentRepository.find({
      where: { groupId: group.id },
    });
    group.students = students as any;
  }
  
  return groups;
};

/**
 * Добавление группы
 */
export const addGroupsDb = async (groupFields: Omit<GroupInterface, 'id'>): Promise<GroupInterface> => {
  const repository = await getGroupRepository();
  const group = new Group();
  const newGroup = await repository.save({
    ...group,
    ...groupFields,
  }) as GroupInterface;

  // Загружаем студентов для группы вручную
  const studentRepository = await getStudentRepository();
  const students = await studentRepository.find({
    where: { groupId: newGroup.id },
  });
  newGroup.students = students as any;

  return newGroup;
};
