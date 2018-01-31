export interface IGalleryObject{
    id:number;
    title: string;
    images: IGalleryImageItem[];
  }
  export interface IGalleryImageItem{
    id: string;
    description?:string;
    title?:string;
    order?:string;
  }