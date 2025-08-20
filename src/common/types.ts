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

export type Product = {
    id: string;
    article: number;
    weight?: number;
    link: string;
    priceRub: number;
    priceCny: number;
    image: AirImage | null;
    sizes: Array<{
        id: string;
        name: string;
    }>;
    colors: Array<{
        id: string;
        name: string;
        image: AirImage | null;
    }>;
};

export type CartItem = {
    id: string;
    count: number;
};

export type CartProduct = {
    id: string;
    count: number;
    article: number;
    priceRub: number;
    image: AirImage | null;
};

export type ClientInfo = {
    name: string;
    tg_id: number;
};
