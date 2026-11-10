export type ProductVariant = {
  id: string;
  label: string;
  available: boolean;
  note?: string;
};

export type Product = {
  slug: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  regularPriceCents: number;
  promoPriceCents: number;
  imagePaths: string[];
  variants: ProductVariant[];
  specs: string[];
  preparation: string;
  care?: string;
};

export const DEMO_SHIPPING_FEE_MXN = 99;
export const PROMO_CODE = "KIBO10";
export const PROMO_START = "2026-11-16";
export const PROMO_END = "2026-11-30";

export const PRODUCTS: Product[] = [
  {
    slug: "kibo-planner",
    name: "Kibo Planner",
    sku: "KPL-001",
    category: "Papelería y organización académica",
    description:
      "Planificador físico para organizar actividades escolares, fechas de entrega, objetivos semanales y hábitos de estudio.",
    regularPriceCents: 17900,
    promoPriceCents: 16110,
    imagePaths: [
      "/images/kibo-planner-principal.webp",
      "/images/kibo-planner-macro.webp",
      "/images/kibo-planner-uso.webp",
    ],
    variants: [
      { id: "morado", label: "Morado KIBO", available: true, note: "Diseño de referencia." },
      { id: "lavanda", label: "Lavanda", available: false, note: "Pendiente de confirmación del proveedor." },
    ],
    specs: [
      "Formato A5 propuesto (14.8 × 21 cm)",
      "Cubierta rígida y encuadernación de espiral",
      "100 hojas interiores y calendario sin fechas fijas",
      "Secciones para prioridades, objetivos y seguimiento semanal",
    ],
    preparation: "5–10 días hábiles bajo pedido, sujeto al proveedor y a la aprobación del diseño.",
    care: "Mantener seco, evitar dobleces y limpiar con un paño suave.",
  },
  {
    slug: "kibo-cards",
    name: "Kibo Cards",
    sku: "KCD-001",
    category: "Material didáctico y aprendizaje",
    description:
      "Mazo de tarjetas educativas para practicar pensamiento lógico, algoritmos y fundamentos de Python.",
    regularPriceCents: 14900,
    promoPriceCents: 13410,
    imagePaths: [
      "/images/kibo-cards-principal.webp",
      "/images/kibo-cards-macro.webp",
      "/images/kibo-cards-uso.webp",
    ],
    variants: [
      { id: "inicial", label: "Nivel inicial", available: true },
      { id: "python", label: "Fundamentos de Python", available: false, note: "Línea propuesta futura." },
    ],
    specs: [
      "40 tarjetas impresas a color",
      "Tamaño aproximado de 6.3 × 8.9 cm",
      "Caja de cartón y guía breve de uso",
      "El gramaje, laminado y acabado se confirmarán con la imprenta",
    ],
    preparation: "5–10 días hábiles bajo pedido, sujeto a cotización y aprobación de la prueba de impresión.",
  },
  {
    slug: "kibo-study-kit",
    name: "Kibo Study Kit",
    sku: "KSK-001",
    category: "Papelería y kit de estudio",
    description:
      "Kit de materiales de apoyo académico para organizar apuntes, actividades y tareas y desarrollar hábitos de estudio.",
    regularPriceCents: 24900,
    promoPriceCents: 22410,
    imagePaths: [
      "/images/kibo-study-kit-principal.webp",
      "/images/kibo-study-kit-macro.webp",
      "/images/kibo-study-kit-uso.webp",
    ],
    variants: [
      { id: "morado", label: "Diseño morado KIBO", available: true, note: "Composición propuesta." },
      { id: "lavanda", label: "Diseño lavanda", available: false, note: "Depende de disponibilidad de componentes." },
    ],
    specs: [
      "Una libreta tamaño A5",
      "Un bolígrafo, notas adhesivas y separadores",
      "Empaque de presentación",
      "Materiales, peso y acabados definitivos sujetos a cotización",
    ],
    preparation: "2–3 días hábiles para el armado después de reunir y revisar los componentes.",
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function formatMXN(cents: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(cents / 100);
}

export function isPromoActive(date = new Date()) {
  const today = date.toISOString().slice(0, 10);
  return today >= PROMO_START && today <= PROMO_END;
}
