"use client";

import Link from "next/link";
import * as React from "react";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProductImage } from "./product-image";
import { useProductStore } from "./product-store";
import { formatMXN, type Product } from "@/lib/products";

export function ProductDetail({ product }: { product: Product }) {
  const { addItem, items } = useProductStore();
  const [variantId, setVariantId] = React.useState(product.variants.find((variant) => variant.available)?.id ?? "");
  const variant = product.variants.find((option) => option.id === variantId);
  const [selectedImage, setSelectedImage] = React.useState(0);
  return <div className="min-h-screen"><Navbar><Link href="/productos/carrito"><Button variant="subtle" size="sm"><ShoppingBag className="h-4 w-4" /> Pedido ({items.reduce((sum, item) => sum + item.quantity, 0)})</Button></Link></Navbar>
    <main className="mx-auto max-w-6xl px-6 py-10"><Link href="/productos" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)]"><ArrowLeft className="h-4 w-4" /> Volver a KIBO SHOP</Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-2"><div><ProductImage src={product.imagePaths[selectedImage]} alt={`Fotografía ${selectedImage + 1} de ${product.name}`} className="aspect-square rounded-[var(--radius-lg)]" /><div className="mt-3 grid grid-cols-3 gap-3">{product.imagePaths.map((path, index) => <button key={path} onClick={() => setSelectedImage(index)} className={`overflow-hidden rounded-xl border-2 ${selectedImage === index ? "border-[var(--color-primary)]" : "border-transparent"}`} aria-label={`Ver imagen ${index + 1}`}><ProductImage src={path} alt="" className="aspect-square" /></button>)}</div></div>
        <div><p className="text-sm text-black/45">{product.category} · SKU {product.sku}</p><h1 className="mt-2 text-4xl font-bold">{product.name}</h1><p className="mt-4 leading-7 text-black/60">{product.description}</p><div className="mt-5 flex items-center gap-3"><span className="text-3xl font-bold text-[var(--color-primary)]">{formatMXN(product.promoPriceCents)}</span><del className="text-black/35">{formatMXN(product.regularPriceCents)}</del><span className="rounded-full bg-[#fff1ed] px-2.5 py-1 text-xs font-semibold text-[var(--color-secondary)]">Bajo pedido</span></div><p className="mt-2 text-sm text-black/50">0 existencias terminadas · {product.preparation}</p>
          <Card className="mt-7 p-5"><label className="text-sm font-semibold">Variante</label><div className="mt-3 grid gap-2">{product.variants.map((option) => <button key={option.id} disabled={!option.available} onClick={() => setVariantId(option.id)} className={`rounded-xl border p-3 text-left text-sm ${variantId === option.id ? "border-[var(--color-primary)] bg-[var(--color-surface-muted)]" : "border-[var(--color-border)]"} disabled:cursor-not-allowed disabled:opacity-45`}>{option.label}{!option.available && <span className="ml-2 text-xs text-[var(--color-secondary)]">No disponible: {option.note}</span>}</button>)}</div>{variant?.note && <p className="mt-3 text-xs text-black/50">{variant.note}</p>}<Button className="mt-5 w-full" disabled={!variant?.available} onClick={() => addItem(product.slug, variantId)}>Agregar al pedido</Button></Card>
          <div className="mt-7"><h2 className="font-semibold">Ficha técnica</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-black/60">{product.specs.map((spec) => <li key={spec}>{spec}</li>)}</ul>{product.care && <p className="mt-4 text-sm text-black/55"><strong>Cuidados propuestos:</strong> {product.care}</p>}</div>
          <p className="mt-7 text-xs leading-5 text-black/45">Envío por separado, calculado antes de confirmar. Cobertura sujeta a códigos postales atendidos por la paquetería. Los materiales y acabados definitivos dependen del proveedor.</p>
        </div></div></main></div>;
}
