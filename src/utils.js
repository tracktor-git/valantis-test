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

const uniq = (coll) => Array.from(new Set(coll));

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
    const { data } = await await axios.post(API_URL, { action: 'get_fields', params: { field: 'brand' } }, axiosOptions);
    const brandNames = uniq(data.result).filter((name) => name !== null);
    return brandNames;
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
    const ids = uniq(data.result);
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

const filterItems = (items) => items
  .filter((item, index) => index === items.findIndex(({ id }) => id === item.id));

export const getItems = async (idList, attempts = 1) => {
  const postData = {
    action: 'get_items',
    params: { ids: idList },
  };

  try {
    const newProducts = await axios.post(API_URL, postData, axiosOptions);
    const data = newProducts.data.result;
    const filteredData = filterItems(data);
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
      const retryResult = await getItems(idList, attempts + 1);
      return retryResult;
    }
  }
  return null;
};

export const getFilteredIDs = async (field, value, attempts = 1) => {
  const postData = {
    action: 'filter',
    params: { [field]: value || null },
  };

  try {
    const response = await axios.post(API_URL, postData, axiosOptions);
    const ids = uniq(response.data.result);
    return ids;
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
