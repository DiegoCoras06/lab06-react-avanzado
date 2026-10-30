import { createContext, useCallback, useContext, useEffect, useReducer, useState, useRef, type ReactNode } from 'react';
import { cartReducer, isValidDiscountCode, normalizeCode, selectTotals, type CartItem, type CartState, type CartTotals } from './cartReducer';
import { getInitialState, getLocalProducts, persistCart, saveLocalProducts, type Product } from './storage';
import { syncCartWithServer } from './syncService';
export interface DiscountResult {ok:boolean;message:string;}
interface CartContextProps extends CartTotals {
 state:CartState;products:Product[];isOnline:boolean;isSyncing:boolean;
 addToCart:(product:Omit<CartItem,'quantity'>)=>void;
 decreaseQuantity:(id:string)=>void;removeFromCart:(id:string)=>void;clearCart:()=>void;
 applyDiscount:(code:string)=>DiscountResult;removeDiscount:()=>void;syncCartWithBackend:()=>Promise<void>;
 cartTotal:number;cartCount:number;
}
const CartContext=createContext<CartContextProps|undefined>(undefined);
export function CartProvider({children}:{children:ReactNode}) {
 const [state,dispatch]=useReducer(cartReducer,null,getInitialState);
 const [products,setProducts]=useState<Product[]>(getLocalProducts);
 const [isOnline,setIsOnline]=useState(typeof navigator==='undefined'?true:navigator.onLine);
 const [isSyncing,setIsSyncing]=useState(false);
 const syncing=useRef(false);
 useEffect(()=>{const online=()=>setIsOnline(true);const offline=()=>setIsOnline(false);window.addEventListener('online',online);window.addEventListener('offline',offline);return()=>{window.removeEventListener('online',online);window.removeEventListener('offline',offline);};},[]);
 useEffect(()=>persistCart(state),[state]);
 const totals=selectTotals(state);
 const addToCart=useCallback((product:Omit<CartItem,'quantity'>)=>{
  if(syncing.current)return;
  const inCatalog=products.find(p=>p.id===product.id);if(!inCatalog)return;
  dispatch({type:'ADD_TO_CART',payload:{product:{id:inCatalog.id,name:inCatalog.name,price:inCatalog.price,image:inCatalog.image},stock:inCatalog.stock}});
 },[products]);
 const decreaseQuantity=useCallback((id:string)=>{if(!syncing.current)dispatch({type:'DECREASE_QUANTITY',payload:{id}});},[]);
 const removeFromCart=useCallback((id:string)=>{if(!syncing.current)dispatch({type:'REMOVE_FROM_CART',payload:{id}});},[]);
 const clearCart=useCallback(()=>{if(!syncing.current)dispatch({type:'CLEAR_CART'});},[]);
 const removeDiscount=useCallback(()=>{if(!syncing.current)dispatch({type:'REMOVE_DISCOUNT'});},[]);
 const applyDiscount=useCallback((code:string):DiscountResult=>{
  if(syncing.current)return {ok:false,message:'Espera a que termine la compra simulada.'};
  if(!state.items.length)return {ok:false,message:'Agrega un producto antes de aplicar tu cupón.'};
  if(!isValidDiscountCode(code))return {ok:false,message:'Código inválido. Prueba con ESTUDIANTE10.'};
  if(state.discountCode===normalizeCode(code))return {ok:false,message:'Este cupón ya está aplicado.'};
  dispatch({type:'APPLY_DISCOUNT',payload:{code}});return {ok:true,message:'¡Listo! Tienes un 10 % de descuento.'};
 },[state.items.length,state.discountCode]);
 const syncCartWithBackend=useCallback(async()=>{
  if(syncing.current||!state.items.length)return;
  if(!isOnline){alert('Conéctate a internet para simular tu compra.');return;}
  syncing.current=true;setIsSyncing(true);
  try{const result=await syncCartWithServer(state.items,products);if(!result.ok){alert('Revisa tu carrito:\n'+result.conflicts.map(c=>`${c.name}: ${c.reason}`).join('\n'));return;}if(result.updatedProducts){saveLocalProducts(result.updatedProducts);setProducts(result.updatedProducts);dispatch({type:'CLEAR_CART'});alert('¡Compra simulada completada! El inventario local se actualizó. No se ha realizado ningún cobro.');}}
  catch(error){console.error('Error al simular la compra:',error);alert('No pudimos completar la simulación. Tu carrito sigue guardado.');}
  finally{syncing.current=false;setIsSyncing(false);}
 },[isOnline,state.items,products]);
 return <CartContext.Provider value={{state,products,isOnline,isSyncing,...totals,cartTotal:totals.total,cartCount:totals.count,addToCart,decreaseQuantity,removeFromCart,clearCart,applyDiscount,removeDiscount,syncCartWithBackend}}>{children}</CartContext.Provider>;
}
export function useCart(){const context=useContext(CartContext);if(!context)throw new Error('useCart debe usarse dentro de CartProvider');return context;}
