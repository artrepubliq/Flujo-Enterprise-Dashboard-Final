export interface IGalleryObject{
    id:string;
    client_id?: string;
    title: string;
    images: IGalleryImageItem[];
  }
  export interface IGalleryImageItem{
    id: string;
    description?:string;
    title?:string;
    order?:string;
  }


  //interface for update the single image details updation

  export interface IAlbumImageUpdate{
    id: string;
    title: string;
    description: string;
    image: string;
    order: string;
  }

  //base 64 images interface
  export interface IBase64Images{
    id: string;
    image: string;
  }