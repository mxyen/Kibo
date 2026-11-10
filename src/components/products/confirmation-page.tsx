"use client";

import Link from "next/link";
import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCartProduct } from "./product-store";
import { formatMXN } from "@/lib/products";
import type { CartItem } from "./product-store";

type Order = { id: string; date: string; form: { name: string; email: string; address: string }; items: CartItem[]; subtotalCents: number; discountCents: number; shippingCents: number; totalCents: number };

export function ConfirmationPage() {
  const [order, setOrder] = React.useState<Order | null>(null);
  React.useEffect(() => { const saved = window.sessionStorage.getItem("kibo-order"); if (saved) setOrder(JSON.parse(saved) as Order); }, []);
  if (!order) return <main className="mx-auto max-w-xl px-6 py-20 text-center"><p>No hay una confirmación reciente.</p><Link href="/productos"><Button className="mt-5">Volver a KIBO SHOP</Button></Link></main>;
  return <main className="mx-auto max-w-2xl px-6 py-12"><div className="text-center"><CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" /><p className="mt-4 text-sm font-semibold text-emerald-700">Pedido recibido</p><h1 className="mt-2 text-4xl font-bold">Pago simulado aprobado</h1><p className="mt-3 text-sm text-black/55">Folio {order.id} · {order.date}</p></div><Card className="mt-8 p-6"><h2 className="font-semibold">Detalle del pedido</h2><div className="mt-4 space-y-3">{order.items.map((item) => { const data = getCartProduct(item); return data ? <div key={`${item.slug}-${item.variantId}`} className="flex justify-between border-b pb-3 text-sm"><span>{data.product.name} × {item.quantity}<small className="block text-black/45">SKU {data.product.sku} · {data.variant}</small></span><strong>{formatMXN(data.product.regularPriceCents * item.quantity)}</strong></div> : null; })}</div><div className="mt-5 space-y-2 text-sm"><div className="flex justify-between"><span>Subtotal</span><strong>{formatMXN(order.subtotalCents)}</strong></div><div className="flex justify-between text-emerald-700"><span>Descuento</span><strong>-{formatMXN(order.discountCents)}</strong></div><div className="flex justify-between"><span>Envío</span><strong>{formatMXN(order.shippingCents)}</strong></div><div className="flex justify-between border-t pt-3 text-base"><span>Total</span><strong>{formatMXN(order.totalCents)}</strong></div></div></Card><Card className="mt-4 p-6 text-sm text-black/60"><p><strong>Entrega:</strong> {order.form.name}, {order.form.address}</p><p className="mt-2"><strong>Contacto:</strong> {order.form.email}</p><p className="mt-2"><strong>Preparación:</strong> bajo pedido, sujeta a proveedor y disponibilidad.</p><p className="mt-4 font-semibold text-[var(--color-secondary)]">Pago de demostración; no se realizó ningún cargo real.</p></Card><div className="mt-6 flex flex-col gap-3 sm:flex-row"><Link href="/productos" className="flex-1"><Button className="w-full">Volver a KIBO SHOP</Button></Link><Link href="/productos" className="flex-1"><Button variant="outline" className="w-full">Seguir explorando productos</Button></Link></div></main>;
}
