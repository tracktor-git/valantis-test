import React from 'react';
import Loader from './Components/Loader';
import ProductItem from './Components/ProductItem';
import Paginator from './Components/Paginator';
import Header from './Components/Header';
import Filters from './Components/Filters';

import {
  generatePages, getAllIDs, getItems, filterItems,
} from './utils';

const DATA_LIMIT = 50;

const App = () => {
  const [products, setProducts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentPageNumber, setCurrentPageNumber] = React.useState(1);
  const [pages, setPages] = React.useState({});

  const pagesCount = Object.keys(pages).length;

  React.useEffect(() => {
    const fetchIds = async () => {
      const ids = await getAllIDs();
      const result = generatePages(ids, DATA_LIMIT);
      setPages(result);
    };

    fetchIds();
  }, []);

  React.useEffect(() => {
    if (pagesCount > 0) {
      const setItems = async () => {
        setIsLoading(true);
        const items = await getItems(pages, 1);
        setProducts(items);
        if (items.length) {
          setCurrentPageNumber(1);
        }
        setIsLoading(false);
      };

      setItems();
    }
  }, [pagesCount, pages]);

  const handleChangePage = async (pageNumber) => {
    setIsLoading(true);

    const items = await getItems(pages, pageNumber);
    setProducts(items);

    if (items.length) {
      setCurrentPageNumber(pageNumber);
    }

    setIsLoading(false);
  };

  const applyFilters = async (field, value) => {
    setIsLoading(true);
    const filteredIds = await filterItems(field, value);
    const filteredPages = generatePages(filteredIds, DATA_LIMIT);
    setPages(filteredPages);
    const items = await getItems(filteredPages, 1);
    setProducts(items);
    setIsLoading(false);
  };

  return (
    <main>
      <div className="container">
        <Header />
        <Paginator
          onNextClick={() => handleChangePage(currentPageNumber + 1)}
          onPreviousClick={() => handleChangePage(currentPageNumber - 1)}
          isNextDisabled={currentPageNumber === pagesCount || isLoading}
          isPrevDisabled={currentPageNumber === 1 || isLoading}
        >
          {
            isLoading
              ? <Loader />
              : <span>{`Страница ${currentPageNumber} из ${pagesCount}`}</span>
          }
        </Paginator>
        <Filters applyFilters={applyFilters} />
        <div className="products-wrapper">
          {
            products.length > 0 ? (
              products.map((product) => <ProductItem key={product.id} data={product} />)
            ) : 'Нет товаров для отображения'
          }
        </div>
      </div>
    </main>
  );
};

export default App;
