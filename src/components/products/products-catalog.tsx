"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProductImage } from "./product-image";
import { useProductStore } from "./product-store";
import { formatMXN, PRODUCTS, PROMO_CODE, PROMO_END, PROMO_START } from "@/lib/products";

export function ProductsCatalog() {
  const { addItem, items } = useProductStore();
  return (
    <div className="min-h-screen">
      <Navbar>
        <Link href="/productos/carrito" className="relative">
          <Button variant="subtle" size="sm"><ShoppingBag className="h-4 w-4" /> Pedido ({items.reduce((sum, item) => sum + item.quantity, 0)})</Button>
        </Link>
      </Navbar>
      <main className="mx-auto max-w-6xl px-6 py-12">
        <section className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-surface-muted)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]"><Sparkles className="h-3.5 w-3.5" /> KIBO SHOP</span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Herramientas físicas para potenciar tu aprendizaje.</h1>
          <p className="mt-5 text-lg leading-8 text-black/55">En KIBO creemos que aprender también se construye fuera de la pantalla. Por eso desarrollamos productos que complementan nuestra plataforma educativa y ayudan a organizar actividades, fortalecer la lógica y desarrollar hábitos de estudio.</p>
        </section>
        <section className="mt-8 rounded-2xl border border-[#d9c0f5] bg-[#f3eefc] p-5 sm:flex sm:items-center sm:justify-between">
          <div><p className="text-sm font-bold text-[var(--color-primary)]">Campaña {PROMO_CODE}</p><p className="mt-1 text-sm text-black/60">10% de descuento del 16 al 30 de noviembre de 2026. El envío se calcula por separado.</p></div>
          <span className="mt-3 inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--color-primary)] sm:mt-0">{PROMO_START.slice(8)}–{PROMO_END.slice(8)} NOV</span>
        </section>
        <div className="mt-14 flex items-end justify-between"><div><p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-primary)]">Productos físicos</p><h2 className="mt-2 text-2xl font-bold">Diseñados para aprender haciendo</h2></div><Link href="/docente" className="hidden items-center gap-1 text-sm font-semibold text-[var(--color-primary)] sm:flex">Conoce la plataforma <ArrowRight className="h-4 w-4" /></Link></div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {PRODUCTS.map((product) => {
            const firstVariant = product.variants.find((variant) => variant.available);
            return <Card key={product.slug} className="overflow-hidden">
              <ProductImage src={product.imagePaths[0]} alt={`Fotografía principal de ${product.name}`} className="aspect-[4/3]" />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-medium text-black/45">{product.category}</p><h3 className="mt-1 text-xl font-bold">{product.name}</h3></div><span className="rounded-full bg-[#fff1ed] px-2.5 py-1 text-xs font-semibold text-[var(--color-secondary)]">Bajo pedido</span></div>
                <p className="mt-3 text-sm leading-6 text-black/55">{product.description}</p>
                <p className="mt-3 text-xs text-black/40">SKU: {product.sku} · 0 existencias terminadas</p>
                <div className="mt-4 flex items-end gap-2"><span className="text-xl font-bold text-[var(--color-primary)]">{formatMXN(product.promoPriceCents)}</span><del className="text-sm text-black/35">{formatMXN(product.regularPriceCents)}</del></div>
                <p className="mt-1 text-xs text-black/45">{product.preparation}</p>
                <div className="mt-5 grid gap-2"><Link href={`/productos/${product.slug}`}><Button variant="outline" className="w-full">Ver ficha técnica</Button></Link><Button className="w-full" onClick={() => firstVariant && addItem(product.slug, firstVariant.id)} disabled={!firstVariant}>Agregar al pedido</Button></div>
              </div>
            </Card>;
          })}
        </div>
        <section id="politicas" className="mt-16 border-t border-[var(--color-border)] pt-8 text-sm text-black/55">
          <h2 className="font-semibold text-black">Información y políticas</h2>
          <p className="mt-2">Todos los productos son demostrativos y se solicitan bajo pedido. El envío es una tarifa de demostración, no una cotización real.</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[var(--color-primary)]"><a href="#politicas">Términos y condiciones</a><a href="#politicas">Política de envíos</a><a href="#politicas">Cancelaciones</a><a href="#politicas">Cambios y devoluciones</a><a href="#politicas">Garantías y atención</a><a href="#politicas">Aviso de privacidad</a></div>
        </section>
      </main>
    </div>
  );
}
