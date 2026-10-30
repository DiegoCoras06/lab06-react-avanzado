// Requiere: npm i @tanstack/react-query react-error-boundary
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSuspenseQuery } from '@tanstack/react-query';

// fetchUser: función que obtiene el usuario (la guía no la define)
const fetchUser = () => fetch('/api/users/123').then(res => res.json());

function UserProfile() {
  // Con Suspense habilitado en tu fetcher o librería (React Query / use de React)
  // (en TanStack Query v5 la firma es un objeto: { queryKey, queryFn })
  const { data } = useSuspenseQuery({ queryKey: ['user', '123'], queryFn: fetchUser });
  return <h1>{data.name}</h1>;
}

export default function App() {
  return (
    <ErrorBoundary fallback={<div>Algo salió mal al cargar los datos...</div>}>
      <Suspense fallback={<div>Cargando perfil de usuario de forma optimizada...</div>}>
        <UserProfile />
      </Suspense>
    </ErrorBoundary>
  );
}
