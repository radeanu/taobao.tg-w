import axios from 'axios';

const apiKey = import.meta.env.VITE_AIR_API_KEY;
const airBase = import.meta.env.VITE_AIR_BASE;

const airSizeTable = import.meta.env.VITE_AIR_SIZES_TABLE;
const airColorsTable = import.meta.env.VITE_AIR_COLORS_TABLE;
const airProductsTable = import.meta.env.VITE_AIR_PRODUCTS_TABLE;

const headers = {
    common: {
        Authorization: `Bearer ${apiKey}`
    }
};

export const productApi = axios.create({
    headers,
    baseURL: `https://api.airtable.com/v0/${airBase}/${airProductsTable}`
});

export const sizeApi = axios.create({
    headers,
    baseURL: `https://api.airtable.com/v0/${airBase}/${airSizeTable}`
});

export const colorApi = axios.create({
    headers,
    baseURL: `https://api.airtable.com/v0/${airBase}/${airColorsTable}`
});
