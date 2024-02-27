import React from 'react';
import Loader from './Components/Loader';
import Paginator from './Components/Paginator';
import Header from './Components/Header';
import Filters from './Components/Filters';

import {
  generatePages, getAllIDs, getItems, filterItems,
} from './utils';
import Products from './Components/Products';

const DATA_LIMIT = 50;
const START_PAGE_NUMBER = 1;

const App = () => {
  const [products, setProducts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFiltered, setIsFiltered] = React.useState(false);
  const [currentPageNumber, setCurrentPageNumber] = React.useState(START_PAGE_NUMBER);
  const [pages, setPages] = React.useState({});

  const pagesCount = Object.keys(pages).length;

  React.useEffect(() => {
    setIsLoading(true);

    getAllIDs()
      .then((ids) => {
        if (!ids) return [];
        return generatePages(ids, DATA_LIMIT);
      })
      .then((data) => {
        setPages(data);
        return getItems(data, START_PAGE_NUMBER) || [];
      })
      .then((items) => setProducts(items))
      .finally(() => setIsLoading(false));
  }, []);

  const handleChangePage = async (pageNumber) => {
    setIsLoading(true);

    const items = await getItems(pages, pageNumber) || [];
    setProducts(items);

    if (items.length) {
      setCurrentPageNumber(pageNumber);
    }

    setIsLoading(false);
  };

  const handleFilters = async (mode, field, value) => {
    const filter = {
      apply: () => filterItems(field, value) || [],
      clear: () => getAllIDs() || [],
    };

    setIsLoading(true);

    const getIds = filter[mode];
    const ids = await getIds();
    const newPages = generatePages(ids, DATA_LIMIT);
    setPages(newPages);

    // Запрашиваем товары только если есть id
    if (ids.length) {
      const items = await getItems(newPages, 1) || [];
      setProducts(items);
    } else {
      setProducts([]);
    }

    setCurrentPageNumber(1);
    setIsFiltered(mode === 'apply');

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
        <Filters handleFilters={handleFilters} isFiltered={isFiltered} />
        <div className="products-wrapper">
          <Products isLoading={isLoading} products={products} />
        </div>
      </div>
    </main>
  );
};

export default App;
