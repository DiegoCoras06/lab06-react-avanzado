// ============================================================
// Pasos 4 y 5 de la guía: servicio SIMULADO de sincronización (backend)
// El "servidor" valida stock y devuelve éxito o una lista de conflictos.
// ============================================================
import type { CartItem } from './cartReducer';
import type { Product } from './storage';

export interface SyncConflict {
  id: string;
  name: string;
  reason: string;
}

export interface SyncResult {
  ok: boolean;
  conflicts: SyncConflict[];
  /** Catálogo actualizado (stock descontado) si ok === true */
  updatedProducts?: Product[];
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Simula POST /api/cart/sync (2 segundos de latencia) */
export async function syncCartWithServer(
  items: CartItem[],
  products: Product[],
  delayMs = 2000,
): Promise<SyncResult> {
  await wait(delayMs);

  const conflicts: SyncConflict[] = [];
  for (const item of items) {
    const product = products.find((p) => p.id === item.id);
    if (!product) {
      conflicts.push({ id: item.id, name: item.name, reason: 'El producto ya no existe' });
    } else if (item.quantity > product.stock) {
      conflicts.push({
        id: item.id,
        name: item.name,
        reason: `Stock insuficiente en el servidor (disponible: ${product.stock})`,
      });
    }
  }
  if (conflicts.length > 0) return { ok: false, conflicts };

  // Sin conflictos: el servidor descuenta el stock definitivamente
  const updatedProducts = products.map((prod) => {
    const inCart = items.find((i) => i.id === prod.id);
    return inCart ? { ...prod, stock: Math.max(0, prod.stock - inCart.quantity) } : prod;
  });
  return { ok: true, conflicts: [], updatedProducts };
}
