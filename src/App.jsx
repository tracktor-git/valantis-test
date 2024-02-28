import React from 'react';
import Paginator from './Components/Paginator';
import Header from './Components/Header';
import Filters from './Components/Filters';
import Products from './Components/Products';

import {
  generatePages, getAllIDs, getItems, getFilteredIDs,
} from './utils';

const DATA_LIMIT = 50;
const START_PAGE_NUMBER = 1;

const App = () => {
  const [products, setProducts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFiltered, setIsFiltered] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(START_PAGE_NUMBER);
  const [pages, setPages] = React.useState({});

  const pagesCount = Object.keys(pages).length;

  React.useEffect(() => {
    setIsLoading(true);

    getAllIDs()
      .then((ids) => {
        if (!ids) return { [START_PAGE_NUMBER]: [] };
        return generatePages(ids, DATA_LIMIT);
      })
      .then((data) => {
        setPages(data);
        if (!data[1].length) return []; // Переделать
        return getItems(data, START_PAGE_NUMBER) || [];
      })
      .then((items) => setProducts(items))
      .finally(() => setIsLoading(false));
  }, []);

  const handleChangePage = async (newPageNumber) => {
    setIsLoading(true);

    const items = await getItems(pages, newPageNumber) || [];
    setProducts(items);

    if (items.length) {
      setPageNumber(newPageNumber);
    }

    setIsLoading(false);
  };

  const handleFilters = async (mode, field, value) => {
    const actions = {
      apply: () => getFilteredIDs(field, value) || [],
      clear: () => getAllIDs() || [],
    };

    setIsLoading(true);

    const getIds = actions[mode];
    const ids = await getIds();
    const newPages = generatePages(ids, DATA_LIMIT);
    setPageNumber(START_PAGE_NUMBER);
    setPages(newPages);

    // Запрашиваем товары только если есть id
    const items = ids.length ? (await getItems(newPages, START_PAGE_NUMBER) || []) : [];
    setProducts(items);
    setIsFiltered(mode === 'apply');

    setIsLoading(false);
  };

  const paginatorProps = {
    onNextClick: () => handleChangePage(pageNumber + 1),
    onPreviousClick: () => handleChangePage(pageNumber - 1),
    pageNumber,
    pagesCount,
    isLoading,
  };

  return (
    <main>
      <div className="container">
        <Header />
        <Paginator {...paginatorProps} />
        <Filters handleFilters={handleFilters} isFiltered={isFiltered} isLoading={isLoading} />
        <Products isLoading={isLoading} products={products} />
        {
          !isLoading && <Paginator {...paginatorProps} />
        }
      </div>
    </main>
  );
};

export default App;
