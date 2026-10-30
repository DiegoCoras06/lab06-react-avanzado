// Requiere: npm i dexie dexie-react-hooks
import Dexie, { type Table } from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';

// 1. Definición de la Base de Datos Local
class OfflineAppDB extends Dexie {
  todos!: Table<{ id?: number; text: string; synced: number }>;

  constructor() {
    super('OfflineAppDB');
    this.version(1).stores({ todos: '++id, text, synced' });
  }
}
const db = new OfflineAppDB();

// 2. Componente React con consultas en tiempo real de la DB local
export function TodoList() {
  // useLiveQuery hace que React se re-renderice automáticamente si la IndexedDB cambia
  const todos = useLiveQuery(() => db.todos.toArray());

  const addTodo = async (text: string) => {
    await db.todos.add({ text, synced: 0 });
    // Se dispararía un proceso en segundo plano (Background Sync) para enviar a la BD real
  };

  return (
    <div>
      <button onClick={() => addTodo('Nueva tarea offline')}>Agregar</button>
      {todos?.map(todo => <p key={todo.id}>{todo.text} {todo.synced ? '☁️' : '⏳'}</p>)}
    </div>
  );
}
