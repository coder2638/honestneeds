import { useAuthHydration } from './useAuthHydration';

export function useUser() {
  const { user, isLoading } = useAuthHydration();
  return { user, isLoading };
}
