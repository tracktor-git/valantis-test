import ProductItem from './ProductItem';
import Loader from './Loader';

const Products = ({ products, isLoading }) => {
  if (isLoading) {
    return <Loader />;
  }

  if (!products.length) {
    return (
      <div className="products-wrapper">
        <span>Нет товаров для отображения</span>
      </div>
    );
  }

  return (
    <div className="products-wrapper">
      {products.map((product) => <ProductItem key={product.id} data={product} />)}
    </div>
  );
};

export default Products;
