import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders,HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class HttpService {

    url: string = "http://flujo.in/dashboard/flujo.in_api_client"
    // url: string = "http://localhost:8080"
    constructor(private http: HttpClient) { }

    getAll(req_url) {
        return this.http.get(this.url+req_url);
    }

    getById(id: string, req_url:string) {
        return this.http.get(this.url+req_url + id);
    }

    create(data: object,req_url) {
        return this.http.post(this.url+req_url, data);
    }

    update(user: object) {
        // return this.http.put('/api/users/' + user.id, user);
    }

    delete(id: string, req_url: string) {
        return this.http.delete(this.url+req_url+ id);
    }

    updatePost(payload, req_url) {
      return  this.http
          .post(this.url+req_url, payload, {
            
            headers: new HttpHeaders().set('Authorization', 'some-token')
          });
          
      }
}