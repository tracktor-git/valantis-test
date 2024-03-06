import axios from 'axios';
import md5 from 'md5';

const generateApiPassword = () => {
  const apiKey = process.env.REACT_APP_API_KEY;
  const date = new Date()
    .toLocaleDateString('ru-RU', { timeZone: 'UTC' })
    .split('.')
    .reverse()
    .join('');

  const encryptedPassword = md5(`${apiKey}_${date}`);
  return encryptedPassword;
};

const API_URL = process.env.NODE_ENV === 'development'
  ? 'http://api.valantis.store:40000/'
  : 'https://api.valantis.store:41000/';

const API_PASSWORD = generateApiPassword();

const axiosOptions = {
  headers: {
    'X-Auth': API_PASSWORD,
  },
};

export const chunk = (array, size = 1) => array.reduce((acc, _, index) => {
  if (index % size === 0) {
    const part = array.slice(index, index + size);
    return [...acc, part];
  }
  return acc;
}, []);

export const generatePages = (ids, limit) => {
  // Если не будет ни одного id - то это пустая 1-я страница без id
  const initialAcc = { 1: [] };

  const pages = chunk(ids, limit);
  return pages.reduce((acc, array, index) => ({ ...acc, [index + 1]: array }), initialAcc);
};

export const getBrands = async (attempts = 1) => {
  try {
    const response = await await axios.post(API_URL, { action: 'get_fields', params: { field: 'brand' } }, axiosOptions);
    const brands = Array.from(new Set(response.data.result.filter((name) => name !== null)));
    return brands;
  } catch (error) {
    if (!(error instanceof axios.AxiosError)) {
      console.error('Ошибка при получении наименований брендов:', error.message);
    }

    if (error.code === 'ERR_NETWORK') {
      console.error('Ошибка сети', error.message);
    }

    console.warn(attempts, 'Не удалось получить список наименований брендов', error.response.data);

    if (attempts < 5) {
      const retryResult = await getBrands(attempts + 1);
      return retryResult;
    }
  }
  return null;
};

export const getAllIDs = async (attempts = 1) => {
  try {
    const { data } = await axios.post(API_URL, { action: 'get_ids', params: { offset: 1 } }, axiosOptions);
    const ids = Array.from(new Set(data.result));
    return ids;
  } catch (error) {
    if (!(error instanceof axios.AxiosError)) {
      console.error('Ошибка при получении идентификаторов товаров:', error.message);
    }

    if (error.code === 'ERR_NETWORK') {
      console.error('Ошибка сети', error.message);
    }

    if (attempts < 5) {
      console.warn(attempts, 'Не удалось получить список ID', error.response.data);
      const retryResult = await getAllIDs(attempts + 1);
      return retryResult;
    }
  }
  return null;
};

export const getItems = async (pages, pageNumber, attempts = 1) => {
  const pageIndex = pageNumber - 1;
  const params = { ids: pages[pageIndex] };

  try {
    const newProducts = await axios.post(API_URL, { action: 'get_items', params }, axiosOptions);
    const data = newProducts.data.result;
    const filteredData = data
      .filter((product, index) => index === data.findIndex((item) => item.id === product.id));
    return filteredData;
  } catch (error) {
    if (!(error instanceof axios.AxiosError)) {
      console.error('Ошибка при получении списка товаров:', error.message);
    }

    if (error.code === 'ERR_NETWORK') {
      console.error('Ошибка сети', error.message);
    }

    console.warn(attempts, 'Не удалось получить список товаров', error.response.data);

    if (attempts < 5) {
      const retryResult = await getItems(pages, pageNumber, attempts + 1);
      return retryResult;
    }
  }
  return null;
};

export const getFilteredIDs = async (field, value, attempts = 1) => {
  const params = { [field]: value || null };

  try {
    const response = await axios.post(API_URL, { action: 'filter', params }, axiosOptions);
    const ids = response.data.result;
    const uniqIDs = new Set(ids);
    return Array.from(uniqIDs);
  } catch (error) {
    if (!(error instanceof axios.AxiosError)) {
      console.error('Ошибка при получении фильтрованных данных:', error.message);
    }

    if (error.code === 'ERR_NETWORK') {
      console.error('Ошибка сети', error.message);
    }

    console.warn(attempts, 'Не удалось получить фильтрованные данные', error.response.data);

    if (attempts < 5) {
      const retryResult = await getFilteredIDs(field, value, attempts + 1);
      return retryResult;
    }
  }
  return null;
};
