"use client";

import Link from "next/link";
import * as React from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CartSummary, getCartProduct, useProductStore } from "./product-store";
import { formatMXN } from "@/lib/products";

export function CheckoutPage() {
  const store = useProductStore();
  const router = useRouter();
  const [coverage, setCoverage] = React.useState("covered");
  const [scenario, setScenario] = React.useState("approved");
  const [message, setMessage] = React.useState("");
  const [form, setForm] = React.useState({ name: "", email: "", phone: "", zip: "", state: "", municipality: "", neighborhood: "", address: "", references: "" });
  const update = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: event.target.value });
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!store.items.length) return;
    if (coverage === "outside") { setMessage("El código postal está fuera de la cobertura simulada. No se puede confirmar el pedido."); return; }
    if (!/^\d{5}$/.test(form.zip)) { setMessage("Ingresa un código postal de cinco dígitos."); return; }
    if (!form.name || !form.email || !form.address) { setMessage("Completa nombre, correo y dirección."); return; }
    if (scenario !== "approved") { setMessage(scenario === "rejected" ? "Pago rechazado en entorno de prueba. Puedes volver a intentarlo." : "Pago pendiente de confirmación. No se debe iniciar la preparación."); return; }
    const order = { id: `KIBO-${Date.now().toString().slice(-8)}`, date: new Date().toLocaleDateString("es-MX"), form, items: store.items, subtotalCents: store.subtotalCents, discountCents: store.discountCents, shippingCents: store.shippingCents, totalCents: store.totalCents };
    window.sessionStorage.setItem("kibo-order", JSON.stringify(order));
    store.clear();
    router.push("/productos/confirmacion");
  };
  return <div className="min-h-screen"><Navbar /><main className="mx-auto max-w-6xl px-6 py-10"><Link href="/productos/carrito" className="inline-flex items-center gap-2 text-sm text-[var(--color-primary)]"><ArrowLeft className="h-4 w-4" /> Volver al pedido</Link><div className="mt-6 grid gap-6 lg:grid-cols-[1fr_370px]"><form onSubmit={submit} className="space-y-5"><h1 className="text-4xl font-bold">Checkout</h1><Card className="p-6"><h2 className="font-semibold">Datos del cliente</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{([["name","Nombre completo"],["email","Correo electrónico"],["phone","Teléfono"],["zip","Código postal (5 dígitos)"],["state","Estado"],["municipality","Municipio"],["neighborhood","Colonia"],["address","Calle y número"],["references","Referencias (opcional)"]] as const).map(([key, label]) => <label key={key} className={key === "address" || key === "references" ? "sm:col-span-2" : ""}><span className="text-xs font-medium">{label}</span><input required={!["phone","state","municipality","neighborhood","references"].includes(key)} value={form[key]} onChange={update(key)} className="mt-1 h-10 w-full rounded-lg border border-[var(--color-border)] px-3 text-sm outline-none focus:border-[var(--color-primary)]" /></label>)}</div></Card><Card className="p-6"><h2 className="font-semibold">Entrega y prueba de cobertura</h2><p className="mt-2 text-sm text-black/50">Envío a domicilio · {formatMXN(store.shippingCents)} · Tarifa demostrativa; no constituye una cotización real.</p><div className="mt-4 flex gap-4 text-sm"><label><input type="radio" checked={coverage === "covered"} onChange={() => setCoverage("covered")} /> Zona de cobertura simulada</label><label><input type="radio" checked={coverage === "outside"} onChange={() => setCoverage("outside")} /> Fuera de cobertura</label></div></Card><Card className="border-[#d9c0f5] bg-[#fbf8ff] p-6"><div className="flex gap-3"><ShieldCheck className="h-5 w-5 shrink-0 text-[var(--color-primary)]" /><div><h2 className="font-semibold">KIBO PAY — Entorno de demostración</h2><p className="mt-1 text-sm font-bold text-[var(--color-secondary)]">SIMULACIÓN ACADÉMICA. No se realizará ningún cobro real.</p><p className="mt-2 text-xs text-black/50">Mercado Pago (simulación no conectada)</p></div></div><label className="mt-5 block text-sm font-medium">Escenario de prueba<select value={scenario} onChange={(event) => setScenario(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-[var(--color-border)] bg-white px-3"><option value="approved">Simular pago aprobado</option><option value="rejected">Simular pago rechazado</option><option value="pending">Simular pago pendiente</option></select></label></Card>{message && <p role="alert" className="rounded-xl bg-[#fff1ed] p-4 text-sm text-[var(--color-secondary)]">{message}</p>}<Button type="submit" className="w-full">Confirmar simulación</Button></form><Card className="h-fit p-6"><h2 className="text-lg font-semibold">Resumen antes del pago</h2><div className="mt-5 space-y-3">{store.items.map((item) => { const data = getCartProduct(item); return data ? <div key={`${item.slug}-${item.variantId}`} className="text-sm"><div className="flex justify-between gap-3"><span>{data.product.name} × {item.quantity}</span><strong>{formatMXN(data.product.regularPriceCents * item.quantity)}</strong></div><p className="text-xs text-black/45">{data.product.sku} · {data.variant}</p></div> : null; })}</div><div className="mt-5"><CartSummary /></div></Card></div></main></div>;
}
