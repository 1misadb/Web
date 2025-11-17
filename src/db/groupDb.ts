import { Group } from './entity/Group.entity';
import { getDataSource, initializeDatabase } from './AppDataSource';
import type GroupInterface from '@/types/GroupInterface';

const getGroupRepository = async () => {
  await initializeDatabase();
  return getDataSource().getRepository(Group);
};

/**
 * Получение групп
 */
export const getGroupsDb = async (): Promise<GroupInterface[]> => {
  const repository = await getGroupRepository();
  // Явно загружаем связанных студентов
  return await repository.find({
    relations: ['students'] // это загрузит связанных студентов
  });
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
    relations: ['students']
  }) as GroupInterface;
};