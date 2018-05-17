export interface IGalleryObject {
    id: string;
    client_id?: string;
    title: string;
    images: IGalleryImageItem[];
    album_id: string;
  }
  export interface IGalleryImageItem {
    id: string;
    description?: string;
    title?: string;
    order?: string;
    album_id: string;
  }


  // interface for update the single image details updation

  export interface IAlbumImageUpdate {
    id: string;
    title: string;
    description: string;
    images: string;
    order: string;
  }

  // base 64 images interface
  export interface IBase64Images {
    id: string;
    images: string;
  }

  // interface to upload the images
  export interface IUploadImages {
    image: any;
    client_id: string;
  }
