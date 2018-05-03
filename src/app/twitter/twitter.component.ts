import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as OAuth from 'oauth-1.0a';

@Component({
  selector: 'app-twitter',
  templateUrl: './twitter.component.html',
  styleUrls: ['./twitter.component.scss']
})
export class TwitterComponent implements OnInit {

  constructor(
    private httpClient: HttpClient,
  ) { }
  public status: string;

  ngOnInit() {

  }
  postStatus() {
    const oauth = {
      'consumer_key': 'rBf3yuBU4eBcC0qJ7rc7BOwDk',
      'consumer_secret': 'HkVUiTgq2fy2jYzgcYJlWcT39O6kkFilk5sywslUAkh9mw1mzq',
      'token': 'lhGCwgAAAAAA5ogYAAABYxo9bZE',
      'token_secret': 'dN7Fjftsnwh3E3CsdKXzWPKZA54k8Qaq',
      'verifier': 'tKk1pXRQyfXVPkIyJuq2wzqUQSwANIsQ'
    };
    const body = { status: this.status };
    this.httpClient.post('http://flujo-middleware.herokuapp.com/post', body)
      .subscribe(
        result => {
          console.log(result);
        },
        error => {
          console.log(error);
        }
      );
  }

  public signInTwitter(): void {
    this.httpClient.get('http://flujo-middleware.herokuapp.com/oauth_token')
      .subscribe(
        result => {
          console.log(result);
        },
        error => {
          console.log(error);
        });
  }

}
