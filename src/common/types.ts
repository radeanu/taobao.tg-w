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

export type Product = {
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
