import { addGroupsDb } from '@/db/groupDb';
import { addStudentDb } from '@/db/studentDb';
import { hashPassword } from '@/utils/password';
import { User } from '@/db/entity/User.entity';
import AppDataSource, { dbInit } from '@/db/AppDataSource';

const defaultUsers = [
  {
    email: 'admin@example.com',
    fullName: 'Администратор Системы',
    password: hashPassword('admin123'),
    isActive: true,
  },
  {
    email: 'manager@example.com',
    fullName: 'Менеджер Учебного Отдела',
    password: hashPassword('manager123'),
    isActive: true,
  },
];

export async function GET(): Promise<Response> {
  await dbInit();

  // Создаем тестовых пользователей
  const userRepository = AppDataSource.getRepository(User);
  let newUsers = 0;
  let existUsers = 0;

  await Promise.all(defaultUsers.map(async (user) => {
    const exists = await userRepository.findOne({
      where: { email: user.email },
    });

    if (!exists) {
      await userRepository.save(userRepository.create(user));
      newUsers++;
    }
    else {
      existUsers++;
    }
  }));

  // Создаем тестовые данные
  const newGroup = await addGroupsDb({
    name: 'name',
    contacts: '',
  });

  const newStudent = await addStudentDb({
    firstName: 'fname',
    lastName: 'lname',
    middleName: 'mname',
    groupId: newGroup.id,
  });

  console.log(newStudent, newGroup);

  return new Response(JSON.stringify({
    users: {
      newUsers,
      existUsers,
    },
    newStudent,
    newGroup,
  }), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
