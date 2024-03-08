import noImage from '../../assets/images/no-image.png';
import styles from './ProductItem.module.css';

const ProductItem = ({ data }) => {
  const {
    brand,
    id,
    price,
    product,
  } = data;

  const formattedPrice = price
    ? price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })
    : 'Не указана';

  return (
    <div className={styles.productCard}>
      <div className={styles.productHeader}>
        <p className={styles.productTitle}>{product || 'Нет названия'}</p>
        <p className={styles.productId}>{`ID: ${id || 'Нет ID'}`}</p>
      </div>

      <p className={styles.productImage}>
        <img src={noImage} alt="Product" />
      </p>

      <p className={styles.productBrand}>
        <strong>Бренд:</strong>
        <span>{` ${brand || 'Не указан'}`}</span>
      </p>

      <p className={styles.productPrice}>
        <strong>Цена:</strong>
        <span>{` ${formattedPrice}`}</span>
      </p>

    </div>

  );
};

export default ProductItem;
