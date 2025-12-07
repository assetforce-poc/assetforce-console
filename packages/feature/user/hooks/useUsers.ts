import { useQuery } from '@assetforce/graphql';
import { GET_USERS } from '../graphql';
import type { User, UserStatus } from '../types';

interface UseUsersOptions {
  realmId: string;
  status?: UserStatus;
}

interface UseUsersResult {
  users: User[];
  loading: boolean;
  error: Error | undefined;
  refetch: () => void;
}

export const useUsers = ({ realmId, status }: UseUsersOptions): UseUsersResult => {
  const { data, loading, error, refetch } = useQuery<{ users: User[] }>(GET_USERS, {
    variables: { realmId, status },
    skip: !realmId,
  });

  return {
    users: data?.users ?? [],
    loading,
    error: error as Error | undefined,
    refetch,
  };
};
