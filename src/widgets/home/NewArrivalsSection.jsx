import { useSelector } from 'react-redux'
import { ProductCard } from '../../entities/product/ui/ProductCard.jsx'

export function NewArrivalsSection() {
  const products = useSelector((state) => state.products.items)

  return (
    <section className="new-arrivals-section">
      <div className="container">
        <div className="section-heading">
          <h2>New Arrivals</h2>
          <a href="#">View all products &rarr;</a>
        </div>
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
