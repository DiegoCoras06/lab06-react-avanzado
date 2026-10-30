// Mitigación: abortar peticiones huérfanas (Race Conditions) con AbortController
// y evitar cascadas (Network Waterfalls) con Promise.all.
// Estos dos fragmentos se explican en texto en la guía; aquí está la implementación.
import { useState, useEffect } from 'react';

export function useFetchAbortable(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`Error en la petición: ${res.status}`);
        setData(await res.json());
        setError(null);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message); // ignorar cancelaciones
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    // Al cambiar la URL o desmontar: cancela la petición anterior
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}

// Evitar cascadas: lanzar peticiones independientes en paralelo
export async function loadDashboard() {
  const [users, posts] = await Promise.all([
    fetch('https://jsonplaceholder.typicode.com/users').then(r => r.json()),
    fetch('https://jsonplaceholder.typicode.com/posts').then(r => r.json()),
  ]);
  return { users, posts };
}
