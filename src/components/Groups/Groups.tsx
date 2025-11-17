// src/components/Groups/Groups.tsx
'use client';

import { useGroups } from '@/hooks/useGroups';
import Link from 'next/link';

const Groups = () => {
  const { groups, isLoading } = useGroups();

  if (isLoading) return <div>Загрузка групп...</div>;

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.id} className="p-4 border rounded-lg bg-white">
          <h2 className="text-xl font-bold">
            <Link href={`/groups/${group.id}`} className="text-blue-600 hover:underline">
              {group.name}
            </Link>
          </h2>
          <p className="text-sm text-gray-600">{group.contacts || '—'}</p>

          <div className="mt-3">
            <h3 className="font-medium text-sm">Студенты:</h3>
            {group.students?.length ? (
              <ul className="list-disc pl-5 text-sm">
                {group.students.map((s) => (
                  <li key={s.id}>
                    <Link href={`/students/${s.id}`} className="text-blue-600 hover:underline">
                      {s.lastName} {s.firstName[0]}. {s.middleName[0]}.
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Нет студентов</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Groups;