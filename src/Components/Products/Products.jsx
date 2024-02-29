import ProductItem from '../ProductItem/ProductItem';
import Loader from '../Loader/Loader';

import styles from './Products.module.css';

const Products = ({ products, isLoading }) => {
  if (isLoading) {
    return <Loader />;
  }

  if (!products.length) {
    return (
      <div className={styles.productsWrapper}>
        <span>Нет товаров для отображения</span>
      </div>
    );
  }

  return (
    <div className={styles.productsWrapper}>
      {products.map((product) => <ProductItem key={product.id} data={product} />)}
    </div>
  );
};

export default Products;
