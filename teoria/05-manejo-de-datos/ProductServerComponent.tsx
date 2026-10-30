// Este componente se ejecuta SOLO en el servidor (Next.js / Remix)
// Requiere: Next.js + Prisma (u otro ORM). Ejemplo ilustrativo.
import { prisma } from '@/lib/db'; // Instancia de tu ORM

interface ProductProps { id: string }

export default async function ProductServerComponent({ id }: ProductProps) {
  // Consulta directa a la Base de Datos relacional desde el componente
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) return <p>Producto no encontrado</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p>Precio: ${product.price}</p>
      {/* Puedes pasar los datos al componente interactivo del cliente si es necesario */}
    </div>
  );
}
