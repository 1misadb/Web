import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useState } from 'react';
import { deleteStudentApi, getStudentsApi, addStudentApi } from '@/api/studentsApi';
import type StudentInterface from '@/types/StudentInterface';

interface StudentsHookInterface {
  students: StudentInterface[];
  deleteStudentMutate: (studentId: number) => void;
  addStudentMutate: (student: StudentInterface) => void;
}

const useStudents = (): StudentsHookInterface => {
  const queryClient = useQueryClient();
  const [students, setStudents] = useState<StudentInterface[]>([]);

  const { data, refetch } = useQuery({
    queryKey: ['students'],
    queryFn: () => getStudentsApi(),
    enabled: false,
  });

  /**
   * Мутация удаления студента
   */
  const deleteStudentMutate = useMutation({
    // вызов API delete
    mutationFn: async (studentId: number) => deleteStudentApi(studentId),
    // оптимистичная мутация (обновляем данные на клиенте до API запроса delete)
    onMutate: async (studentId: number) => {
      await queryClient.cancelQueries({ queryKey: ['students'] });
      // получаем данные из TanStackQuery
      const previousStudents = queryClient.getQueryData<StudentInterface[]>(['students']);
      let updatedStudents = [...(previousStudents ?? [])];

      if (!updatedStudents) return;

      // помечаем удаляемую запись
      updatedStudents = updatedStudents.map((student: StudentInterface) => ({
        ...student,
        ...(student.id === studentId ? { isDeleted: true } : {}),
      }));
      // обновляем данные в TanStackQuery
      queryClient.setQueryData<StudentInterface[]>(['students'], updatedStudents);

      return { previousStudents, updatedStudents };
    },
    onError: (err, variables, context) => {
      console.log('>>> deleteStudentMutate  err', err);
      queryClient.setQueryData<StudentInterface[]>(['students'], context?.previousStudents);
    },
    // обновляем данные в случаи успешного выполнения mutationFn: async (studentId: number) => deleteStudentApi(studentId),
    onSuccess: async (studentId, variables, { previousStudents }) => {
      await queryClient.cancelQueries({ queryKey: ['students'] });
      // вариант 1 - запрос всех записей
      // refetch();

      // вариант 2 - удаление конкретной записи
      if (!previousStudents) {
        return;
      }
      const updatedStudents = previousStudents.filter((student: StudentInterface) => student.id !== studentId);
      queryClient.setQueryData<StudentInterface[]>(['students'], updatedStudents);
    },
    // onSettled: (data, error, variables, context) => {
    //   // вызывается после выполнения запроса в случаи удачи или ошибке
    //   console.log('>> deleteStudentMutate onSettled', data, error, variables, context);
    // },
  });

  /**
   * Мутация добавления студента
   */
  const addStudentMutate = useMutation({
    // вызов API add
    mutationFn: async (student: StudentInterface) => addStudentApi(student),
    // оптимистичная мутация (обновляем данные на клиенте до API запроса add)
    onMutate: async (newStudent: StudentInterface) => {
      await queryClient.cancelQueries({ queryKey: ['students'] });
      // получаем данные из TanStackQuery
      const previousStudents = queryClient.getQueryData<StudentInterface[]>(['students']);
      // обновляем данные в TanStackQuery
      queryClient.setQueryData<StudentInterface[]>(['students'], [...(previousStudents ?? []), newStudent]);

      return { previousStudents };
    },
    onError: (err, variables, context) => {
      console.log('>>> addStudentMutate  err', err);
      queryClient.setQueryData<StudentInterface[]>(['students'], context?.previousStudents);
    },
    // обновляем данные в случаи успешного выполнения mutationFn: async (studentId: number) => deleteStudentApi(studentId),
    onSuccess: async (student, variables, { previousStudents }) => {
      await queryClient.cancelQueries({ queryKey: ['students'] });
      // вариант 1 - запрос всех записей
      refetch();

      // вариант 2 - добавление конкретной записи
      // if (!previousStudents || !student) {
      //   return;
      // }
      // queryClient.setQueryData<StudentInterface[]>(['students'], [...previousStudents, student]);
    },
    // onSettled: (data, error, variables, context) => {
    //   // вызывается после выполнения запроса в случаи удачи или ошибке
    //   console.log('>> addStudentMutate onSettled', data, error, variables, context);
    // },
  });

  return {
    students: data ?? [],
    deleteStudentMutate: deleteStudentMutate.mutate,
    addStudentMutate: addStudentMutate.mutate,
  };
};

export default useStudents;
