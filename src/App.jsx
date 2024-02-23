import React from 'react';
import axios from 'axios';
import md5 from 'md5';

import Loader from './Loader';
import ProductItem from './ProductItem';
import Paginator from './Paginator';

import logo from './logo.svg';

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

const App = () => {
  const [products, setProducts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(0);

  const DATA_LIMIT = 50;
  const offsetRef = React.useRef(1);

  const getUniqIds = async () => {
    const ids = [];
    
    const iter = async () => {
      if (ids.length >= DATA_LIMIT) {
        return;
      }

      const params = {
        limit: DATA_LIMIT - ids.length,
        offset: offsetRef.current,
      };

      try {
        const response = await axios.post(API_URL, { action: 'get_ids', params }, axiosOptions);

        if (!response.data.result) {
          return;
        }

        const uniqIDs = Array.from(new Set(response.data.result));
        uniqIDs.forEach((id) => {
          if (!ids.includes(id)) {
            ids.push(id);
          }
        });

        offsetRef.current += DATA_LIMIT;
        
        await iter();
      } catch(error) {
        if (error instanceof axios.AxiosError) {
          if (error.response.status === 401) {
            console.log('Ошибка авторизации API', error.response.data);
            return [];
          }
          console.warn('Ошибка получения данных, ИД', error?.response?.data);
          await iter();
        } else {
          console.log('Произошла сетевая ошибка');
        }
      }
    };

    await iter();

    return ids;
  };

  const getProducts = async () => {
    try {
      const ids = await getUniqIds();
      const response = await axios.post(API_URL, { action: 'get_items', params: { ids } }, axiosOptions);
      const data = response.data.result;
      const filteredData = data.filter((product, index) => index === data.findIndex((item) => item.id === product.id));
      return filteredData;
    } catch(error) {
      if (error instanceof axios.AxiosError) {
        if (error.response.status === 401) {
          console.log('Ошибка авторизации API', error.response.data);
          return [];
        }
        console.warn('Ошибка получения продуктов, ИД ошибки:', error?.response?.data);
        const items = await getProducts();
        return items;
      } else {
        console.log('Произошла сетевая ошибка');
      }
    }
  };

  const handleGetProducts = async () => {
    setIsLoading(true);
    const newProducts = await getProducts();
    setProducts(newProducts);
    setPageNumber((previousPageNumber) => previousPageNumber + 1);
    setIsLoading(false);
  };

  const handleGetPrevious = async () => {
    offsetRef.current = offsetRef.current + 1 - (DATA_LIMIT * 2);
    setIsLoading(true);
    const newProducts = await getProducts();
    setProducts(newProducts);
    setPageNumber((previousPageNumber) => previousPageNumber - 1);
    setIsLoading(false);
  };

  return (
    <main>
      <div className="container">
        <div className="logo">
        <h1>Ювелирная мастерская</h1>
          <a href="./">
            <img src={logo} alt="Valantis logo" />
          </a>
        </div>
        <Paginator onNextClick={handleGetProducts} onPreviousClick={handleGetPrevious} pageNumber={pageNumber} isNextDisabled={isLoading} />
        {isLoading && <Loader />}
        <div className="products-wrapper">
          {
            products.length > 0 && (
              products.map((product) => <ProductItem key={product.id} data={product}/>)
            )
          }
        </div>
      </div>
    </main>
  );
}

export default App;
