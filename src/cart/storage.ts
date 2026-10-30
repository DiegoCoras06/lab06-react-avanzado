import type { CartItem, CartState } from './cartReducer';
import { catalog } from '../catalog';
export const CART_STORAGE_KEY = 'offline_cart_v1';
export const DISCOUNT_STORAGE_KEY = 'offline_cart_discount_v1';
export const PRODUCTS_STORAGE_KEY = 'offline_products_v1';
export interface Product {id:string;name:string;price:number;stock:number;image?:string;category?:string;description?:string;tag?:string;color?:string;}
export const INITIAL_PRODUCTS: Product[] = catalog;
export const getLocalProducts = (): Product[] => {
 if(typeof window==='undefined') return INITIAL_PRODUCTS;
 try { const saved=localStorage.getItem(PRODUCTS_STORAGE_KEY); const parsed:unknown=saved?JSON.parse(saved):[]; const records=Array.isArray(parsed)?parsed:[]; return INITIAL_PRODUCTS.map(product=>{const existing=records.find((p:Product)=>p.id===product.id);return {...product,stock:existing&&Number.isInteger(existing.stock)&&existing.stock>=0?existing.stock:product.stock};}); } catch {return INITIAL_PRODUCTS;}
};
export const saveLocalProducts=(products:Product[]):void=>{try{localStorage.setItem(PRODUCTS_STORAGE_KEY,JSON.stringify(products));}catch(error){console.error('No se pudo guardar el catálogo:',error);}};
export const getInitialState=():CartState=>{
 if(typeof window==='undefined')return {items:[],discountCode:null};
 try{const saved=localStorage.getItem(CART_STORAGE_KEY);const parsed:unknown=saved?JSON.parse(saved):[];const products=getLocalProducts();const items:CartItem[]=Array.isArray(parsed)?parsed.flatMap(item=>{const product=products.find(p=>p.id===item.id);if(!product||!Number.isInteger(item.quantity)||item.quantity<1||!product.stock)return [];return [{id:product.id,name:product.name,price:product.price,quantity:Math.min(item.quantity,product.stock),image:product.image}];}):[];return {items,discountCode:items.length?localStorage.getItem(DISCOUNT_STORAGE_KEY):null};}catch{return {items:[],discountCode:null};}
};
export const persistCart=(state:CartState):void=>{try{localStorage.setItem(CART_STORAGE_KEY,JSON.stringify(state.items));if(state.discountCode)localStorage.setItem(DISCOUNT_STORAGE_KEY,state.discountCode);else localStorage.removeItem(DISCOUNT_STORAGE_KEY);}catch(error){console.error('No se pudo guardar el carrito:',error);}};
