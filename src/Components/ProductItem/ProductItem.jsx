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
        <div className={styles.productTitle}>{product || 'Нет названия'}</div>
        <div className={styles.productId}>{`ID: ${id || 'Нет ID'}`}</div>
      </div>

      <div className={styles.productImage}>
        <img src={noImage} alt="Product" />
      </div>

      <div className={styles.productBrand}>
        <strong>Бренд:</strong>
        <span>{` ${brand || 'Не указан'}`}</span>
      </div>

      <div className={styles.productPrice}>
        <strong>Цена:</strong>
        <span>{` ${formattedPrice}`}</span>
      </div>

    </div>

  );
};

export default ProductItem;
