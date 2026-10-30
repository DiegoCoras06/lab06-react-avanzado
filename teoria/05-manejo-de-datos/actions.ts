// actions.ts (Archivo ejecutado estrictamente en el servidor)
'use server'

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createInvoice(formData: FormData) {
  const amount = formData.get('amount');

  // Mutación directa y segura en la Base de Datos
  await prisma.invoice.create({
    data: { amount: Number(amount), status: 'PENDING' }
  });

  // Limpia la caché del servidor y fuerza a React a pintar los nuevos datos
  revalidatePath('/invoices');
}
