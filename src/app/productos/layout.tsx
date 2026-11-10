import { ProductStoreProvider } from "@/components/products/product-store";

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <ProductStoreProvider>{children}</ProductStoreProvider>;
}
