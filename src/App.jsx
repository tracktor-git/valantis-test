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
  const [idsChunks, setIdsChunks] = React.useState([]);

  React.useEffect(() => {
    const startLoad = async () => {
      setIsLoading(true);

      const ids = await getAllIDs() || [];

      if (ids.length > 0) {
        const chunks = chunk(ids, DATA_LIMIT);
        setIdsChunks(chunks);
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

    const idList = idsChunks[newPageNumber - 1];
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
    const chunks = chunk(ids, DATA_LIMIT);
    setPageNumber(START_PAGE_NUMBER);
    setIdsChunks(chunks);
    setPagesCount(chunks.length || 1);

    // Запрашиваем товары только если есть id
    const idList = chunks[START_PAGE_NUMBER - 1];
    const items = ids.length ? await getItems(idList) : [];
    setProducts(items);
    setIsFiltered(mode === 'apply');

    setIsLoading(false);
  };

  const pageNavigation = (
    <Paginator
      changePage={handleChangePage}
      pageNumber={pageNumber}
      pagesCount={pagesCount}
      isLoading={isLoading}
    />
  );

  return (
    <main>
      <div className="container">
        <Header />
        {pageNavigation}
        <Filters handleFilters={handleFilters} isFiltered={isFiltered} isLoading={isLoading} />
        <Products isLoading={isLoading} products={products} />
        {!isLoading && pageNavigation}
      </div>
    </main>
  );
};

export default App;
