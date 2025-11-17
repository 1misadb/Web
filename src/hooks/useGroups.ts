// src/hooks/useGroups.ts
import { useQuery } from '@tanstack/react-query';
import { getGroupsApi } from '@/api/groupsApi';

export const useGroups = () => {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ['groups'],
    queryFn: getGroupsApi,
  });

  return { groups: data, isLoading, error };
};