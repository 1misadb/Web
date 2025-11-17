// src/hooks/useStudents.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { addStudentApi, deleteStudentApi, getStudentsApi } from '@/api/studentsApi';
import type StudentInterface from '@/types/StudentInterface';

export const useStudents = () => {
  const queryClient = useQueryClient();

  const { data = [], isLoading, error, refetch } = useQuery({
    queryKey: ['students'],
    queryFn: getStudentsApi,
    enabled: true, 
  });

  const deleteStudentMutation = useMutation({
    mutationFn: deleteStudentApi,
    onMutate: async (studentId: number) => {
      await queryClient.cancelQueries({ queryKey: ['students'] });
      const previous = queryClient.getQueryData<StudentInterface[]>(['students']) || [];

      const updated = previous.map(s =>
        s.id === studentId ? { ...s, isDeleted: true } : s
      );

      queryClient.setQueryData(['students'], updated);
      return { previous };
    },
    onError: (err, studentId, context) => {
      queryClient.setQueryData(['students'], context?.previous);
    },
    onSuccess: (deletedId) => {
      const current = queryClient.getQueryData<StudentInterface[]>(['students']) || [];
      queryClient.setQueryData(['students'], current.filter(s => s.id !== deletedId));
    },
  });

  const addStudentMutation = useMutation({
    mutationFn: addStudentApi,
    onMutate: async (newStudent: StudentInterface) => {
      await queryClient.cancelQueries({ queryKey: ['students'] });
      const previous = queryClient.getQueryData<StudentInterface[]>(['students']) || [];

      const optimisticStudent = {
        ...newStudent,
        id: Date.now(), // временный ID
        isNew: true,
      };

      queryClient.setQueryData(['students'], [...previous, optimisticStudent]);
      return { previous };
    },
    onError: (err, newStudent, context) => {
      queryClient.setQueryData(['students'], context?.previous);
    },
    onSuccess: (createdStudent) => {
      // Заменяем временную запись на реальную
      queryClient.setQueryData<StudentInterface[]>(['students'], (old = []) =>
        old.map(s => (s.isNew ? createdStudent : s))
      );
    },
  });

  return {
    students: data,
    isLoading,
    error,
    deleteStudent: deleteStudentMutation.mutate,
    addStudent: addStudentMutation.mutate,
    isDeleting: deleteStudentMutation.isPending,
    isAdding: addStudentMutation.isPending,
  };
};