"use client";

import * as React from "react";
import {
  DEMO_SHIPPING_FEE_MXN,
  formatMXN,
  getProduct,
  isPromoActive,
  PROMO_CODE,
  type Product,
} from "@/lib/products";

export type CartItem = { slug: string; variantId: string; quantity: number };
type ProductStore = {
  items: CartItem[];
  coupon: string;
  addItem: (slug: string, variantId: string) => void;
  updateQuantity: (slug: string, variantId: string, quantity: number) => void;
  removeItem: (slug: string, variantId: string) => void;
  setCoupon: (coupon: string) => void;
  clear: () => void;
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  totalCents: number;
  couponMessage: string;
};

const StoreContext = React.createContext<ProductStore | null>(null);

export function ProductStoreProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [coupon, setCouponState] = React.useState("");
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const saved = window.localStorage.getItem("kibo-cart");
      if (saved) setItems(JSON.parse(saved) as CartItem[]);
      setCouponState(window.localStorage.getItem("kibo-coupon") ?? "");
    } catch {
      setItems([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  React.useEffect(() => {
    if (hydrated) window.localStorage.setItem("kibo-cart", JSON.stringify(items));
  }, [items, hydrated]);

  React.useEffect(() => {
    if (hydrated) window.localStorage.setItem("kibo-coupon", coupon);
  }, [coupon, hydrated]);

  const addItem = (slug: string, variantId: string) => {
    setItems((current) => {
      const existing = current.find((item) => item.slug === slug && item.variantId === variantId);
      if (existing) {
        return current.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...current, { slug, variantId, quantity: 1 }];
    });
  };
  const updateQuantity = (slug: string, variantId: string, quantity: number) => {
    setItems((current) =>
      quantity < 1
        ? current.filter((item) => !(item.slug === slug && item.variantId === variantId))
        : current.map((item) =>
            item.slug === slug && item.variantId === variantId ? { ...item, quantity } : item,
          ),
    );
  };
  const removeItem = (slug: string, variantId: string) =>
    updateQuantity(slug, variantId, 0);

  const subtotalCents = items.reduce((sum, item) => {
    const product = getProduct(item.slug);
    return sum + (product?.regularPriceCents ?? 0) * item.quantity;
  }, 0);
  const promoValid = coupon.trim().toUpperCase() === PROMO_CODE && isPromoActive();
  const discountCents = promoValid
    ? items.reduce((sum, item) => {
        const product = getProduct(item.slug);
        return sum + ((product?.regularPriceCents ?? 0) - (product?.promoPriceCents ?? 0)) * item.quantity;
      }, 0)
    : 0;
  const shippingCents = items.length ? DEMO_SHIPPING_FEE_MXN * 100 : 0;
  let couponMessage = "";
  if (coupon && coupon.toUpperCase() !== PROMO_CODE) couponMessage = "El código no es válido.";
  if (coupon.toUpperCase() === PROMO_CODE && !isPromoActive()) {
    couponMessage = "KIBO10 es válido del 16 al 30 de noviembre de 2026.";
  }

  const value = {
    items,
    coupon,
    addItem,
    updateQuantity,
    removeItem,
    setCoupon: setCouponState,
    clear: () => {
      setItems([]);
      setCouponState("");
    },
    subtotalCents,
    discountCents,
    shippingCents,
    totalCents: subtotalCents - discountCents + shippingCents,
    couponMessage: promoValid ? "Cupón aplicado: 10% de descuento." : couponMessage,
  };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useProductStore() {
  const context = React.useContext(StoreContext);
  if (!context) throw new Error("useProductStore debe usarse dentro de ProductStoreProvider");
  return context;
}

export function getCartProduct(item: CartItem): { product: Product; variant: string } | null {
  const product = getProduct(item.slug);
  const variant = product?.variants.find((option) => option.id === item.variantId);
  return product && variant ? { product, variant: variant.label } : null;
}

export function CartSummary() {
  const { subtotalCents, discountCents, shippingCents, totalCents } = useProductStore();
  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between"><span>Subtotal</span><strong>{formatMXN(subtotalCents)}</strong></div>
      <div className="flex justify-between text-emerald-700"><span>Descuento</span><strong>-{formatMXN(discountCents)}</strong></div>
      <div className="flex justify-between"><span>Envío demostrativo</span><strong>{formatMXN(shippingCents)}</strong></div>
      <div className="flex justify-between border-t border-[var(--color-border)] pt-3 text-base"><span>Total</span><strong>{formatMXN(totalCents)}</strong></div>
    </div>
  );
}
