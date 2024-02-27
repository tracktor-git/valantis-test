import React from 'react';
import { getBrands } from '../utils';

const BrandFilter = ({ applyFilters }) => {
  const [brands, setBrands] = React.useState([]);
  const [selectedBrand, setSelectedBrand] = React.useState();

  const handleSelectChange = (event) => {
    setSelectedBrand(event.target.value);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await getBrands();
      setBrands(data);
    };

    fetchData();
  }, []);

  const handleApplyFilters = () => {
    applyFilters('brand', selectedBrand);
  };

  return (
    <>
      <select className="select-brand" onChange={handleSelectChange} value={selectedBrand}>
        <option value="pickBrand" disabled>Выберите наименование бренда</option>
        <option value={null}>Без бренда</option>
        {
            brands.map((value) => <option key={Math.random()} value={value}>{value}</option>)
        }
      </select>
      <button className="apply-filters" type="button" onClick={handleApplyFilters}>Применить фильтры</button>
    </>
  );
};

const PriceFilter = ({ applyFilters }) => {
  const [productPrice, setProductPrice] = React.useState(0);

  const handleChangePrice = (event) => {
    setProductPrice(Number(event.target.value));
  };

  const handleApplyFilters = (event) => {
    event.preventDefault();
    applyFilters('price', productPrice);
  };

  return (
    <form className="filters-form" onSubmit={handleApplyFilters}>
      <input className="product-price-input" type="number" placeholder="Цена товара" min={0} onChange={handleChangePrice} required />
      <button className="apply-filters" type="submit">Применить фильтры</button>
    </form>
  );
};

const ProductNameFilter = ({ applyFilters }) => {
  const [productName, setProductName] = React.useState(null);

  const handleChangeName = (event) => {
    setProductName(event.target.value);
  };

  const handleApplyFilters = (event) => {
    event.preventDefault();
    applyFilters('product', productName);
  };

  return (
    <form className="filters-form" onSubmit={handleApplyFilters}>
      <input className="product-name-input" type="text" placeholder="Наименование товара" onChange={handleChangeName} required />
      <button className="apply-filters" type="submit">Применить фильтры</button>
    </form>
  );
};

const Filters = ({ applyFilters }) => {
  const [selectedFilter, setSelectedFilter] = React.useState('price');

  const filterMap = {
    brand: <BrandFilter applyFilters={applyFilters} />,
    price: <PriceFilter applyFilters={applyFilters} />,
    productName: <ProductNameFilter applyFilters={applyFilters} />,
  };

  const handleChangeFilter = (event) => {
    setSelectedFilter(event.target.value);
  };

  return (
    <div className="filters">
      <select onChange={handleChangeFilter} defaultValue={selectedFilter}>
        <option value="brand">По бренду</option>
        <option value="price">По цене</option>
        <option value="productName">По наименованию товара</option>
      </select>
      {filterMap[selectedFilter]}
    </div>
  );
};

export default Filters;
