import { Package } from "lucide-react";
import { PageContainer } from "@/components/shell/page-container";
import { PageHeader } from "@/components/shell/page-header";
import { ProductCard } from "@/components/cards/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getProducts } from "@/lib/content";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <PageContainer>
      <PageHeader
        title="My Products"
        subtitle="Live products I've built and shipped, end to end — not concept-only mockups."
      />

      {products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products yet"
          description="Add one in Studio and it'll show up here."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
