"use client";

import {
  type AddOnId,
  type ColourId,
  type SizeId,
  getAddOn,
  getSize,
} from "./products";

export interface CartItem {
  productId: "refill";
  size: SizeId;
  colour: ColourId;
  addOns: AddOnId[];
  qty: number;
}

export type Cart = CartItem[];

const CART_KEY = "refill-cart-v1";
export const CART_EVENT = "refill-cart-changed";
export const MAX_QTY = 10;

export function itemKey(item: CartItem): string {
  return `refill|${item.size}|${item.colour}|${[...item.addOns].sort().join(",")}`;
}

export function itemUnitPrice(item: CartItem): number {
  return (
    getSize(item.size).price +
    item.addOns.reduce((sum, id) => sum + getAddOn(id).price, 0)
  );
}

export function itemTotalPrice(item: CartItem): number {
  return itemUnitPrice(item) * item.qty;
}

export function getCart(): Cart {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidItem);
  } catch {
    return [];
  }
}

function isValidItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Partial<CartItem>;
  return (
    item.productId === "refill" &&
    (item.size === "small-medium" || item.size === "large") &&
    (item.colour === "clay" || item.colour === "moss" || item.colour === "sandstone") &&
    Array.isArray(item.addOns) &&
    item.addOns.every((a) => a === "scent-pod") &&
    typeof item.qty === "number" &&
    Number.isInteger(item.qty) &&
    item.qty >= 1 &&
    item.qty <= MAX_QTY
  );
}

function saveCart(cart: Cart): void {
  window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent(CART_EVENT));
}

export function addToCart(item: CartItem): void {
  const cart = getCart();
  const key = itemKey(item);
  const existing = cart.find((c) => itemKey(c) === key);
  if (existing) {
    existing.qty = Math.min(existing.qty + item.qty, MAX_QTY);
    saveCart([...cart]);
  } else {
    saveCart([...cart, { ...item, addOns: [...item.addOns] }]);
  }
}

export function setItemQty(key: string, qty: number): void {
  if (qty < 1 || qty > MAX_QTY) return;
  const cart = getCart();
  const item = cart.find((c) => itemKey(c) === key);
  if (!item) return;
  item.qty = qty;
  saveCart([...cart]);
}

export function removeItem(key: string): void {
  saveCart(getCart().filter((c) => itemKey(c) !== key));
}

export function cartCount(): number {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

export function cartSubtotal(): number {
  return getCart().reduce((sum, item) => sum + itemTotalPrice(item), 0);
}

export function clearCart(): void {
  saveCart([]);
}
