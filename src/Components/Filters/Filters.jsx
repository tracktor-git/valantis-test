import React from 'react';
import { getBrands } from '../../utils';

import styles from './Filters.module.css';

const ApplyFilters = ({ isLoading, onClick }) => (
  <button className={styles.applyFilter} type="submit" disabled={isLoading} onClick={onClick}>
    Применить фильтр
  </button>
);

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

  const handleApplyFilters = (event) => {
    event.preventDefault();
    handleFilters('apply', 'brand', selectedBrand);
  };

  return (
    <>
      <select onChange={handleSelectChange} value={selectedBrand} disabled={isLoading}>
        <option value="pickBrand" disabled>Выберите наименование бренда</option>
        <option value="">Без бренда</option>
        {
            brands.map((value) => <option key={Math.random()} value={value}>{value}</option>)
        }
      </select>
      <ApplyFilters isLoading={isLoading} onClick={handleApplyFilters} />
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
    <form className={styles.filtersForm} onSubmit={handleApplyFilters}>
      <input className={styles.productPrice} type="number" placeholder="Цена товара" min={0} onChange={handleChangePrice} required />
      <ApplyFilters isLoading={isLoading} />
    </form>
  );
};

const ProductNameFilter = ({ isLoading, handleFilters }) => {
  const [productName, setProductName] = React.useState(null);

  const handleChangeName = (event) => {
    const cleanValue = event.target.value.trim();
    setProductName(cleanValue);
  };

  const handleApplyFilters = (event) => {
    event.preventDefault();
    handleFilters('apply', 'product', productName);
  };

  return (
    <form className={styles.filtersForm} onSubmit={handleApplyFilters}>
      <input className={styles.productName} type="text" placeholder="Наименование товара" onChange={handleChangeName} required />
      <ApplyFilters isLoading={isLoading} />
    </form>
  );
};

const Filters = ({ isFiltered, isLoading, handleFilters }) => {
  const [selectedFilter, setSelectedFilter] = React.useState('');
  const selectRef = React.useRef(null);

  const filtersMap = {
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
    <div className={styles.filters}>
      <span>Фильтровать данные:</span>

      <select ref={selectRef} defaultValue={selectedFilter} onChange={handleChangeFilter}>
        <option value="" disabled>Выберите фильтр</option>
        <option value="brand">По бренду</option>
        <option value="price">По цене</option>
        <option value="productName">По наименованию товара</option>
      </select>

      {filtersMap[selectedFilter]}

      <button type="button" className={styles.clearFilter} onClick={handleClearFilters} disabled={!isFiltered || isLoading}>
        Очистить фильтр
      </button>
    </div>
  );
};

export default Filters;
