import React from 'react';
import Paginator from './Components/Paginator/Paginator';
import Header from './Components/Header/Header';
import Filters from './Components/Filters/Filters';
import Products from './Components/Products/Products';

import {
  chunk, getAllIDs, getItems, getFilteredIDs,
} from './utils';

const DATA_LIMIT = 50;
const START_PAGE_NUMBER = 1;

const App = () => {
  const [products, setProducts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFiltered, setIsFiltered] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(START_PAGE_NUMBER);
  const [pagesCount, setPagesCount] = React.useState(0);
  const [pages, setPages] = React.useState([]);

  React.useEffect(() => {
    const startLoad = async () => {
      setIsLoading(true);

      const ids = await getAllIDs() || [];

      if (ids.length > 0) {
        const chunks = chunk(ids, DATA_LIMIT);
        setPages(chunks);
        setPagesCount(chunks.length || 1);

        const idList = chunks[START_PAGE_NUMBER - 1];
        const items = await getItems(idList) || [];
        setProducts(items);
      }

      setIsLoading(false);
    };

    startLoad();
  }, []);

  const handleChangePage = async (newPageNumber) => {
    setIsLoading(true);

    const idList = pages[newPageNumber - 1];
    const items = await getItems(idList) || [];
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
    const newPages = chunk(ids, DATA_LIMIT);
    setPageNumber(START_PAGE_NUMBER);
    setPages(newPages);
    setPagesCount(newPages.length || 1);

    // Запрашиваем товары только если есть id
    const idList = newPages[START_PAGE_NUMBER - 1];
    const items = ids.length ? (await getItems(idList) || []) : [];
    setProducts(items);
    setIsFiltered(mode === 'apply');

    setIsLoading(false);
  };

  const paginatorProps = {
    changePage: handleChangePage,
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
