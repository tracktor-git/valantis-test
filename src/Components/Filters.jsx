import React from 'react';
import { getBrands } from '../utils';

const BrandFilter = ({ isLoading, handleFilters }) => {
  const [brands, setBrands] = React.useState([]);
  const [selectedBrand, setSelectedBrand] = React.useState('');

  const handleSelectChange = (event) => {
    setSelectedBrand(event.target.value);
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await getBrands() || [];
      const sortedData = data.sort((a, b) => a.localeCompare(b));
      setBrands(sortedData);
    };

    fetchData();
  }, []);

  const handleApplyFilters = () => {
    handleFilters('apply', 'brand', selectedBrand);
  };

  return (
    <>
      <select className="select-brand" onChange={handleSelectChange} value={selectedBrand}>
        <option value="pickBrand" disabled>Выберите наименование бренда</option>
        <option value="">Без бренда</option>
        {
            brands.map((value) => <option key={Math.random()} value={value}>{value}</option>)
        }
      </select>
      <button className="apply-filters" type="button" onClick={handleApplyFilters} disabled={isLoading}>Применить фильтр</button>
    </>
  );
};

const PriceFilter = ({ isLoading, handleFilters }) => {
  const [productPrice, setProductPrice] = React.useState(0);

  const handleChangePrice = (event) => {
    setProductPrice(Number(event.target.value));
  };

  const handleApplyFilters = (event) => {
    event.preventDefault();
    handleFilters('apply', 'price', productPrice);
  };

  return (
    <form className="filters-form" onSubmit={handleApplyFilters}>
      <input className="product-price-input" type="number" placeholder="Цена товара" min={0} onChange={handleChangePrice} required />
      <button className="apply-filters" type="submit" disabled={isLoading}>Применить фильтр</button>
    </form>
  );
};

const ProductNameFilter = ({ isLoading, handleFilters }) => {
  const [productName, setProductName] = React.useState(null);

  const handleChangeName = (event) => {
    setProductName(event.target.value);
  };

  const handleApplyFilters = (event) => {
    event.preventDefault();
    handleFilters('apply', 'product', productName);
  };

  return (
    <form className="filters-form" onSubmit={handleApplyFilters}>
      <input className="product-name-input" type="text" placeholder="Наименование товара" onChange={handleChangeName} required />
      <button className="apply-filters" type="submit" disabled={isLoading}>Применить фильтр</button>
    </form>
  );
};

const Filters = ({ isFiltered, isLoading, handleFilters }) => {
  const [selectedFilter, setSelectedFilter] = React.useState('');
  const selectRef = React.useRef(null);

  const filterMap = {
    brand: <BrandFilter handleFilters={handleFilters} isLoading={isLoading} />,
    price: <PriceFilter handleFilters={handleFilters} isLoading={isLoading} />,
    productName: <ProductNameFilter handleFilters={handleFilters} isLoading={isLoading} />,
  };

  const handleChangeFilter = (event) => {
    setSelectedFilter(event.target.value);
  };

  const handleClearFilters = () => {
    handleFilters('clear');
    setSelectedFilter('');
    selectRef.current.value = '';
  };

  return (
    <div className="filters">
      <span>Фильтровать данные:</span>

      <select ref={selectRef} defaultValue={selectedFilter} onChange={handleChangeFilter}>
        <option value="" disabled>Выберите фильтр</option>
        <option value="brand">По бренду</option>
        <option value="price">По цене</option>
        <option value="productName">По наименованию товара</option>
      </select>

      {filterMap[selectedFilter]}

      <button type="button" className="clear-filters" onClick={handleClearFilters} disabled={!isFiltered || isLoading}>
        Очистить фильтр
      </button>
    </div>
  );
};

export default Filters;
