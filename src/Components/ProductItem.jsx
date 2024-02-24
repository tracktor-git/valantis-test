import noImage from '../assets/images/no-image.png';

const ProductItem = ({ data }) => {
  const {
    brand,
    id,
    price,
    product,
  } = data;

  const formattedPrice = price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });

  return (
    <div className="products-wrapper">
      <div className="product-card">
        <div className="product-header">
          <div className="product-title">{product || 'Нет названия'}</div>
          <div className="product-id">{`ID: ${id || 'Нет ID'}`}</div>
        </div>

        <div className="product-image">
          <img src={noImage} alt="Product" />
        </div>

        <div className="product-brand">
          <strong>Бренд:</strong>
          <span>{` ${brand || 'Не указан'}`}</span>
        </div>

        <div className="product-price">
          <strong>Цена:</strong>
          <span>{` ${formattedPrice || 'Не указана'}`}</span>
        </div>

      </div>
    </div>
  );
};

export default ProductItem;
