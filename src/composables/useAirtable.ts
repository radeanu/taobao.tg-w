import Airtable from 'airtable';

const apiKey = import.meta.env.VITE_AIR_API_KEY;
const airBase = import.meta.env.VITE_AIR_BASE;

const airSizeTable = import.meta.env.VITE_AIR_SIZES_TABLE;
const airColorsTable = import.meta.env.VITE_AIR_COLORS_TABLE;
const airProductsTable = import.meta.env.VITE_AIR_PRODUCTS_TABLE;

export function useAirtable() {
    const airtable = new Airtable({ apiKey });

    const base = airtable.base(airBase);

    const sizeTable = base.table(airSizeTable);
    const colorTable = base.table(airColorsTable);
    const productTable = base.table(airProductsTable);

    return {
        base,
        sizeTable,
        colorTable,
        productTable
    };
}
