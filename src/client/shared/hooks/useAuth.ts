import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

export const useAuth = () => {
  const queryClient = useQueryClient();

  const { data: auth } = useQuery<AuthState>({
    queryKey: ['auth'],
    queryFn: () => ({
      isAuthenticated: !!localStorage.getItem('accessToken'),
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
    }),
    initialData: {
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.setQueryData(['auth'], {
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
      });
    },
  });

  return {
    isAuthenticated: auth.isAuthenticated,
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken,
    logout: logout.mutate,
  };
}; 