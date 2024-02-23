import noImage from './no-image.png';

const ProductItem = ({ data }) => {
	const {
		brand,
		id,
		price,
		product
	} = data;

	return (
		<div className="products-wrapper">
			<div className="product-card">
				<div className="product-header">
					<div className="product-title">{product || 'Нет названия'}</div>
					<div className="product-id">ID: {id || 'Нет ID'}</div>
				</div>
				<div className="product-image">
					<img src={noImage} alt="Product" />
				</div>
				<div className="product-brand"><b>Бренд:</b> {brand || 'Не указан'}</div>
					<div className="product-price"><b>Цена:</b> {price || 'Не указана'}</div>
			</div>
		</div>
	);
};

export default ProductItem;
