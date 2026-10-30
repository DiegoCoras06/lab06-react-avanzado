import React from 'react';
import { useFetch } from './useFetch';

export function UserList() {
  // Consumimos el hook personalizado pasando la URL de la API
  // (la guía muestra 'https://typicode.com'; el endpoint real es /users)
  const { data: users, loading, error } = useFetch('https://jsonplaceholder.typicode.com/users');

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>Hubo un problema: {error}</p>;

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} ({user.email})</li>
        ))}
      </ul>
    </div>
  );
}
