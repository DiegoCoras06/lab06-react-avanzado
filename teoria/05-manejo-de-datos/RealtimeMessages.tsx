// Ejemplo de escucha en tiempo real con Supabase en React
// Requiere: npm i @supabase/supabase-js y tu cliente en '@/lib/supabaseClient'
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function RealtimeMessages() {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    // Suscripción al canal de la Base de Datos
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload =>
        setMessages(prev => [...prev, payload.new])
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <ul>{messages.map(m => <li key={m.id}>{m.text}</li>)}</ul>
  );
}
