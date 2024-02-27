import axios from 'axios';
import md5 from 'md5';

export const generateApiPassword = () => {
  const apiKey = process.env.REACT_APP_API_KEY;
  const date = new Date()
    .toLocaleDateString('ru-RU')
    .split('.')
    .reverse()
    .join('');

  const encryptedPassword = md5(`${apiKey}_${date}`);
  return encryptedPassword;
};

const API_URL = 'http://api.valantis.store:40000/';
const API_PASSWORD = generateApiPassword();

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

export const generatePages = (ids, limit) => {
  const pages = chunk(ids, limit);
  return pages.reduce((acc, array, index) => ({ ...acc, [index + 1]: array }), {});
};

export const getBrands = async (attempts = 1) => {
  const emptyResult = [];

  try {
    const response = await await axios.post(API_URL, { action: 'get_fields', params: { field: 'brand' } }, axiosOptions);
    const brands = Array.from(new Set(response.data.result.filter((name) => name !== null)));
    return brands;
  } catch (error) {
    if (!(error instanceof axios.AxiosError)) {
      console.error('Ошибка при получении наименований брендов:', error.message);
      return emptyResult;
    }

    if (error.code === 'ERR_NETWORK') {
      console.error('Ошибка сети', error.message);
      return emptyResult;
    }

    console.warn(attempts, 'Не удалось получить список наименований брендов', error.response.data);

    if (attempts < 5) {
      const retryResult = await getBrands(attempts + 1);
      return retryResult;
    }

    return emptyResult;
  }
};

export const getAllIDs = async (attempts = 1) => {
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

    if (error.code === 'ERR_NETWORK') {
      console.error('Ошибка сети', error.message);
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

export const getItems = async (pages, page, attempts = 1) => {
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

    if (error.code === 'ERR_NETWORK') {
      console.error('Ошибка сети', error.message);
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

export const filterItems = async (field, value, attempts = 1) => {
  try {
    const response = await axios.post(API_URL, { action: 'filter', params: { [field]: value || null } }, axiosOptions);
    const ids = response.data.result;
    return Array.from(new Set(ids));
  } catch (error) {
    if (!(error instanceof axios.AxiosError)) {
      console.error('Ошибка при получении фильтрованных данных:', error.message);
      return [];
    }

    if (error.code === 'ERR_NETWORK') {
      console.error('Ошибка сети', error.message);
      return [];
    }
    console.warn(attempts, 'Не удалось получить фильтрованные данные', error?.response?.data);

    if (attempts < 5) {
      const retryResult = await filterItems(field, value, attempts + 1);
      return retryResult;
    }

    return [];
  }
};
