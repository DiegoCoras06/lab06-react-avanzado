import { useState, useEffect } from 'react';

// 1. Definimos la función empezando con "use"
export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Error en la petición: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]); // Se vuelve a ejecutar solo si la URL cambia

  // 2. Retornamos un objeto con los estados para que el componente los use
  return { data, loading, error };
}
