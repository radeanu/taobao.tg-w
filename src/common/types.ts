export type AirImgThumbnail = {
    url: string;
    height: number;
    width: number;
};

export type AirImage = {
    id: string;
    width: number;
    height: number;
    filename: string;
    size: number;
    type: string;
    url: string;
    thumbnails: {
        full: AirImgThumbnail;
        large: AirImgThumbnail;
        small: AirImgThumbnail;
    };
};

export type AirtableParams = {
    fields: string[];
    offset?: string;
    pageSize?: number;
    filterByFormula?: string;
};

export type AirProduct = {
    id: string;
    article: number;
    weight?: number;
    link: string;
    priceRub: number;
    priceCny: number;
    image: AirImage[];
    colorsPhoto: AirImage[];
    colors: string[];
    sizes: string[];
    images: AirImage[];
};

export type AirFieldSet = {
    [key: string]:
        | undefined
        | string
        | number
        | boolean
        | ReadonlyArray<string>
        | ReadonlyArray<AirImage>;
};

export type AirRecord = {
    id: string;
    createdTime: string;
    fields: AirFieldSet;
};

export type AirPagination = {
    offset: string | undefined;
    page: number;
    limit: number;
};

export type Color = {
    id: string;
    name: string;
    image: AirImage | null;
};

export type Size = {
    id: string;
    name: string;
};

export type Product = {
    id: string;
    article: number;
    weight?: number;
    link: string;
    priceRub: number;
    priceCny: number;
    image: AirImage | null;
    sizes: Size[];
    colors: Color[];
    images: AirImage[];
};

export type CartItem = {
    id: string;
    productId: string;
    count: number;
    sizeId: string | null;
    colorId: string;
    _v: number; // version
};

export type CartProduct = Product & { cart: CartItem & { color?: Color; size?: Size } };

export type ClientInfo = {
    name: string;
    tg_id: number;
};

export type Client = {
    id: string;
    name: string;
    tg_id: number;
};

export type Order = {
    id: string;
    number: number;
    createdAt: string;
    status: string;
    price: number;
    positions: string[];
};
