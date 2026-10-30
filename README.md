# Laboratorio 06 — IS-882 Desarrollo Web (UNSCH)
**Estado Complejo, Contexto y Custom Hooks** — Carrito Offline-First con `useContext` + `useReducer` + `localStorage`.

## Tienda Nóva

La interfaz del laboratorio incluye un catálogo de 20 productos, precios en soles peruanos, búsqueda sin distinción de tildes, categorías, orden por precio y favoritos persistentes. Conserva el carrito con control de stock y el cupón `ESTUDIANTE10`.

El tema morado está definido en `src/purple-glass.css`. El diseño combina paneles de vidrio, relieves suaves y movimiento 3D en la portada. Se adapta a móviles y respeta la preferencia de movimiento reducido. Las fotografías están en `public/images`; sus fuentes y licencia se documentan en `public/images/SOURCES.md`.

La compra es una simulación local: no realiza cobros, envíos ni pedidos reales. El carrito y los favoritos se conservan en este navegador. No incluye service worker; la persistencia del carrito no garantiza cargar toda la web sin red.

## Cómo ejecutarlo
```bash
npm install
npm run dev        # http://localhost:5173
npm test           # pruebas del reducer y del descuento ESTUDIANTE10
npm run build      # compila TypeScript + empaqueta
```

## Estructura
```
src/                          <- PROYECTO DE LA SESIÓN (se ejecuta con npm run dev)
  cart/cartReducer.ts         Capa de dominio: tipos, reducer puro, descuentos, selectores
  cart/storage.ts             localStorage: carrito, descuento y catálogo con stock
  cart/syncService.ts         Backend simulado (pasos 4 y 5): valida stock / conflictos
  cart/CartContext.tsx        Contexto + Provider + hook useCart (Fachada) + applyDiscount
  cart/cartReducer.test.ts    Pruebas con Vitest
  components/ProductList.tsx  Presentación: catálogo con stock
  components/ShoppingCart.tsx Presentación: carrito, cupón, banner de red, botón de sync
teoria/                       <- CÓDIGOS DE EJEMPLO DE LA GUÍA (referencia, no se compilan)
  01-hooks-personalizados     useFetch + UserList
  02-context-api              ThemeContext, ThemeButton, App (+ Navbar y MainContent auxiliares)
  03-rendimiento              React.memo, useMemo, useCallback (ProductItem, ShoppingApp)
  04-manejo-de-errores        ErrorBoundary + App (+ WeatherWidget que falla a propósito)
  05-manejo-de-datos          TanStack Query, Suspense, AbortController, Dexie, RSC, Server Actions, Supabase
  06-arquitectura-limpia      Carrito con 4 capas en JavaScript (versión didáctica de la guía)
```

## TAREA (Sección VI): `applyDiscount(code: string)`
`useCart()` expone `applyDiscount(code)`, que aplica un **10 %** al total si el código es `ESTUDIANTE10`
(acepta mayúsculas/minúsculas y espacios). Actualiza el estado **de forma inmutable**:

- Acción `APPLY_DISCOUNT` en `cartReducer.ts` → `{ ...state, discountCode: 'ESTUDIANTE10' }` (objeto nuevo).
- Código inválido → el reducer devuelve **el mismo** estado (sin renders innecesarios).
- `subtotal`, `discountAmount` y `total` son selectores derivados (`selectTotals`), no se guardan.
- El cupón se persiste en `localStorage` y se borra al vaciar el carrito o sincronizar la compra.

## Probar Offline-First (F12 → Network → Offline)
1. El banner pasa a rojo y el botón de sincronizar se deshabilita.
2. Agrega/quita productos: el stock se controla y al recargar el carrito sigue ahí.
3. Vuelve a "No throttling" → "Sincronizar Compra" → tras 2 s se limpia el carrito y baja el stock.

## Mejoras respecto al código de la guía (comentarios de revisión senior)
| Problema en la guía | Corrección aplicada |
|---|---|
| `quantity += 1` sobre el ítem existente **muta** el estado | `map()` con objeto nuevo |
| `localStorage` y `alert()` dentro del reducer (impuro) | Reducer puro; persistencia en `useEffect`, alertas en el contexto |
| `getLocalProducts()` leído dentro del reducer | El `stock` viaja en la acción (`payload.stock`) |
| `syncCartWithBackend` mezcla simulación y UI | Lógica en `syncService.ts` con detección de conflictos |
| URL `https://typicode.com` incompleta | `https://jsonplaceholder.typicode.com/users` |
| `import './CartProvider'` (no existe) | `./CartContext` |
| `useSuspenseQuery(['user','123'], fn)` (API v4) | Firma v5: `{ queryKey, queryFn }` |
