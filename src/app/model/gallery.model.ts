export interface IGalleryObject{
    id:number;
    title: string;
    images: IGalleryImages[];
  }
  export interface IGalleryImages{
    id: string;
    description?:string;
    title?:string;
    order?:string;
  }