import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as OAuth from 'oauth-1.0a';
import { Router } from '@angular/router';
import { AppConstants } from '../app.constants';
import { ITwitterresponse } from '../model/twitter/twitter.model';
import { ICommonInterface } from '../model/commonInterface.model';
@Component({
  selector: 'app-twitter',
  templateUrl: './twitter.component.html',
  styleUrls: ['./twitter.component.scss']
})
export class TwitterComponent implements OnInit {


  public twitterUserLogin: string;
  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }
  public status: string;

  ngOnInit() {
    this.getUserTokens();
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
    this.httpClient.post(AppConstants.EXPRESS_URL + '/post', body)
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
    this.httpClient.get<ITwitterresponse>(AppConstants.EXPRESS_URL + '/oauth_token/1232')
      .subscribe(
        result => {
          console.log(result);
          if (result.error === false && result.token_data.oauth_callback_confirmed === 'true') {
            this.twitterUserLogin = AppConstants.TWITTER_API_URL + '/oauth/authenticate' +
              '?oauth_token=' + result.token_data.oauth_token;
          }
        },
        error => {
          console.log(error);
        });
  }

  /**
   * this is to get existing user auth_tokens from database.
   */
  public getUserTokens(): void {
    this.httpClient.get<ICommonInterface>(AppConstants.API_URL + 'flujo_client_getsocialtokens' + '/' + AppConstants.CLIENT_ID)
      .subscribe(
        result => {
          console.log(result);
        },
        error => {
          console.log(error);
        }
      );
  }

}
