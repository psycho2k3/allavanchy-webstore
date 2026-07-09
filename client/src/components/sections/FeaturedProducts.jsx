import Container from '../ui/Container.jsx';
import ProductCard from '../ui/ProductCard.jsx';

function FeaturedProducts() {
  return (
    <section className="py-20">
      <Container>
        <h2 className="font-display text-4xl">Featured Pieces</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </div>
      </Container>
    </section>
  );
}

export default FeaturedProducts;
