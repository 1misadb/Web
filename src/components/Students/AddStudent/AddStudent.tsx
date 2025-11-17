// src/components/Students/AddStudent/AddStudent.tsx

import type StudentInterface from '@/types/StudentInterface';
import type GroupInterface from '@/types/GroupInterface'; // ← ДОБАВИТЬ!
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useGroups } from '@/hooks/useGroups';
import styles from './AddStudent.module.scss';

// FormFields
export type FormFields = Pick<StudentInterface, 'firstName' | 'lastName' | 'middleName' | 'contacts' | 'groupId'>;

interface Props {
  onAdd: (studentForm: FormFields) => void;
}

const AddStudent = ({ onAdd }: Props): React.ReactElement => {
  const { groups = [], isLoading } = useGroups(); // ← ИСПРАВИТЬ: groups, а не data
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormFields>({
    defaultValues: {
      groupId: 1,
    },
  });

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    onAdd(data);
    reset();
  };

  return (
    <div className={styles.AddStudent}>
      <h2>Добавление студента</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

        <input
          placeholder="Фамилия"
          {...register('lastName', { required: 'Обязательное поле' })}
        />
        {errors.lastName && <div className="text-red-500 text-sm">{errors.lastName.message}</div>}

        <input
          placeholder="Имя"
          {...register('firstName', { required: 'Обязательное поле' })}
        />
        {errors.firstName && <div className="text-red-500 text-sm">{errors.firstName.message}</div>}

        <input
          placeholder="Отчество"
          {...register('middleName', { required: 'Обязательное поле' })}
        />
        {errors.middleName && <div className="text-red-500 text-sm">{errors.middleName.message}</div>}

        <input
          placeholder="Контакты (необязательно)"
          {...register('contacts')}
        />

        {/* СЕЛЕКТОР ГРУПП */}
        <select
          {...register('groupId', { required: 'Выберите группу' })}
          disabled={isLoading}
          className="w-full p-2 border rounded"
        >
          {isLoading ? (
            <option>Загрузка групп...</option>
          ) : (
            <>
              <option value="">— Выберите группу —</option>
              {groups.map((group: GroupInterface) => ( // ← ЯВНО УКАЗАТЬ ТИП
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </>
          )}
        </select>
        {errors.groupId && <div className="text-red-500 text-sm">{errors.groupId.message}</div>}

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Добавить
        </button>
      </form>
    </div>
  );
};

export default AddStudent;