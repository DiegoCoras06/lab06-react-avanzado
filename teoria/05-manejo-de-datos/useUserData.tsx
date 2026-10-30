// Requiere: npm i @tanstack/react-query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Custom Hook Avanzado
export function useUserData(userId: string) {
  const queryClient = useQueryClient();

  // Obtención de datos con caché administrada
  const userQuery = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/users/${userId}`).then(res => res.json()),
    staleTime: 1000 * 60 * 5, // Los datos se consideran nuevos por 5 minutos
  });

  // Mutación con actualización optimista (Optimistic Update)
  const updateMutation = useMutation({
    mutationFn: (newProfile: any) =>
      fetch(`/api/users/${userId}`, { method: 'PUT', body: JSON.stringify(newProfile) }),
    onMutate: async (newProfile) => {
      await queryClient.cancelQueries({ queryKey: ['user', userId] });
      const previousUser = queryClient.getQueryData(['user', userId]);
      queryClient.setQueryData(['user', userId], (old: any) => ({ ...old, ...newProfile }));
      return { previousUser }; // Respaldo en caso de error
    },
    onError: (err, newProfile, context) => {
      queryClient.setQueryData(['user', userId], context?.previousUser);
    },
  });

  return { userQuery, updateMutation };
}
