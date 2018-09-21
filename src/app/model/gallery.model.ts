export interface IGalleryObject {
  album_id: any;
  client_id?: string;
  title: string;
  images: IGalleryImageItem[];
  id: string;
}
export interface IGalleryImageItem {
  id: string;
  description?: string;
  title?: string;
  order?: string;
  media_id: string;
}


// interface for update the single image details updation

export interface IAlbumImageUpdate {
  media_id: string;
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

export interface MediaDetail {
      images: string|any;
      id: string;
      is_used: any;
      description: any;
  }
