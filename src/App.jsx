import React from 'react';
import axios from 'axios';
import md5 from 'md5';

import Loader from './Components/Loader';
import ProductItem from './Components/ProductItem';
import Paginator from './Components/Paginator';
import Header from './Components/Header';

const generateApiPassword = () => {
  const date = new Date()
    .toLocaleDateString('ru-RU')
    .split('.')
    .reverse()
    .join('');
  
  return `Valantis_${date}`;
};

const API_URL = 'http://api.valantis.store:40000/';
const API_PASSWORD = md5(generateApiPassword());

const axiosOptions = {
  headers: {
    'X-Auth': API_PASSWORD,
  },
};

const chunk = (array, size) => {
  const chunks = [];
  
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  
  return chunks;
}

const generatePages = (ids, limit) => {
    const pages = chunk(ids, limit);
    return pages.reduce((acc, array, index) => ({ ...acc, [index + 1] : array }), {});
};

const getAllIDs = async (attempts = 1) => {
  try {
    const { data } = await axios.post(API_URL, { action: 'get_ids', params: { offset: 1 } }, axiosOptions);
    const ids = Array.from(new Set(data.result));
    return ids;
  } catch(error) {
    console.warn(attempts, 'Не удалось получить список ID', error?.response?.data);    
    if (attempts < 5) {
      return await getAllIDs(attempts + 1);
    }
    return [];
  }
};

const getItems = async (pages, page, attempts = 1) => {
  try {
    const newProducts = await axios.post(API_URL, { action: 'get_items', params: { ids: pages[page] } }, axiosOptions);
    const data = newProducts.data.result;
    const filteredData = data.filter((product, index) => index === data.findIndex((item) => item.id === product.id));
    return filteredData;
  } catch(error) {
    console.warn(attempts, 'Не удалось получить список товаров -->', error?.response?.data);
    if (attempts < 5) {
      return await getItems(pages, page, attempts + 1);
    }
    return [];
  }  
};

const Page = ({ pagesCount, pageNumber }) => {
  if (!pagesCount) {
    return <Loader />;
  }

  return <span>Страница {pageNumber} из {pagesCount}</span>;
};

const App = () => {
  const [products, setProducts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(0);
  const [pages, setPages] = React.useState({});

  const DATA_LIMIT = 50;
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
          setPageNumber(1);
        }
        setIsLoading(false);
      };

      setItems();
    }
  }, [pagesCount, pages]);

  const handleChangePage = async (direction) => {
    const map = {
      next: pageNumber + 1,
      previous: pageNumber - 1,
    };

    const newPageNumber = map[direction];
    setIsLoading(true);
    const items = await getItems(pages, newPageNumber);
    setProducts(items);

    if (items.length) {
      setPageNumber(newPageNumber);
    }

    setIsLoading(false);
  };

  return (
    <main>
      <div className="container">
        <Header />
        <Paginator
          onNextClick={() => handleChangePage('next')}
          onPreviousClick={() => handleChangePage('previous')}
          isNextDisabled={pageNumber === pagesCount || isLoading}
          isPrevDisabled={pageNumber === 1 || isLoading}
        >
          {
            isLoading ?
              <Loader /> :
              <Page pagesCount={pagesCount} pageNumber={pageNumber} />
          }
        </Paginator>
        <div className="products-wrapper">
          {
            products.length > 0 ? (
              products.map((product) => <ProductItem key={product.id} data={product}/>)
            ) : 'Нет товаров для отображения'
          }
        </div>
      </div>
    </main>
  );
}

export default App;
