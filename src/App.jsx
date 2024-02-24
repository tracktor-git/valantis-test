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

const chunk = (array, size = 1) => array.reduce((acc, _, index) => {
  if (index % size === 0) {
    const part = array.slice(index, index + size);
    return [...acc, part];
  }
  return acc;
}, []);

const generatePages = (ids, limit) => {
  const pages = chunk(ids, limit);
  return pages.reduce((acc, array, index) => ({ ...acc, [index + 1]: array }), {});
};

const getAllIDs = async (attempts = 1) => {
  const emptyResult = [];

  try {
    const { data } = await axios.post(API_URL, { action: 'get_ids', params: { offset: 1 } }, axiosOptions);
    const ids = Array.from(new Set(data.result));
    return ids;
  } catch (error) {
    if (!(error instanceof axios.AxiosError)) {
      console.error('Ошибка при получении идентификаторов товаров:', error.message);
      return emptyResult;
    }

    console.warn(attempts, 'Не удалось получить список ID', error.response.data);

    if (attempts < 5) {
      const retryResult = await getAllIDs(attempts + 1);
      return retryResult;
    }

    return emptyResult;
  }
};

const getItems = async (pages, page, attempts = 1) => {
  const emptyResult = [];

  try {
    const newProducts = await axios.post(API_URL, { action: 'get_items', params: { ids: pages[page] } }, axiosOptions);
    const data = newProducts.data.result;
    const filteredData = data
      .filter((product, index) => index === data.findIndex((item) => item.id === product.id));
    return filteredData;
  } catch (error) {
    if (!(error instanceof axios.AxiosError)) {
      console.error('Ошибка при получении списка товаров:', error.message);
      return emptyResult;
    }

    console.warn(attempts, 'Не удалось получить список товаров', error.response.data);

    if (attempts < 5) {
      const retryResult = await getItems(pages, page, attempts + 1);
      return retryResult;
    }

    return emptyResult;
  }
};

const Page = ({ pagesCount, pageNumber }) => {
  if (!pagesCount) {
    return <Loader />;
  }

  return <span>{`Страница ${pageNumber} из ${pagesCount}`}</span>;
};

const DATA_LIMIT = 50;

const App = () => {
  const [products, setProducts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentPageNumber, setCurrentPageNumber] = React.useState(0);
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
              : <Page pagesCount={pagesCount} pageNumber={currentPageNumber} />
          }
        </Paginator>
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
