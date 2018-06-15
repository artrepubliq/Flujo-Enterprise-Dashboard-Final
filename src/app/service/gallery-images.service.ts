import { AppConstants } from '../app.constants';
import { IHttpResponse } from '../model/httpresponse.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICommonInterface } from '../model/commonInterface.model';
@Injectable()
export class GalleryImagesService {

    requestUrl: string;
    constructor(private httpClient: HttpClient) {

    }
    getGalleryImagesComponent = (requestUrl, CLIENT_ID) => {
        return this.httpClient.get<ICommonInterface>(AppConstants.API_URL + requestUrl + CLIENT_ID);
    }
}
