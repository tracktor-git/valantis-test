import ProductItem from './ProductItem';

const Products = ({ products, isLoading }) => {
  if (isLoading) {
    return <span>Товары загружаются...</span>;
  }

  if (!products.length) {
    return <span>Нет товаров для отображения</span>;
  }

  return products.map((product) => <ProductItem key={product.id} data={product} />);
};

export default Products;
