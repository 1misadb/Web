// src/hooks/useGroups.ts
import { useQuery } from '@tanstack/react-query';
import { getGroupsApi } from '@/api/groupsApi';

export const useGroups = (): { groups: ReturnType<typeof getGroupsApi> extends Promise<infer T> ? T : never; isLoading: boolean; error: Error | null } => {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ['groups'],
    queryFn: getGroupsApi,
  });

  return { groups: data, isLoading, error };
};
