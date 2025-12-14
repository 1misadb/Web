import { Group } from './entity/Group.entity';
import AppDataSource, { dbInit } from './AppDataSource';
import type GroupInterface from '@/types/GroupInterface';

const getGroupRepository = async (): Promise<ReturnType<typeof AppDataSource.getRepository>> => {
  await dbInit();
  return AppDataSource.getRepository(Group);
};

/**
 * Получение групп
 */
export const getGroupsDb = async (): Promise<GroupInterface[]> => {
  const repository = await getGroupRepository();
  // Явно загружаем связанных студентов
  return await repository.find({
    relations: ['students'], // это загрузит связанных студентов
  }) as GroupInterface[];
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
  });

  // Загружаем группу со студентами для возврата
  return await repository.findOne({
    where: { id: newGroup.id },
    relations: ['students'],
  }) as GroupInterface;
};
