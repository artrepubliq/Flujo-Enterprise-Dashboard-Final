import {EventEmitter, Injectable, OnDestroy} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as auth0 from 'auth0-js';
import { AUTH_CONFIG } from './auth-config';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse,HttpRequest,HttpResponse } from '@angular/common/http';
import * as _ from 'underscore';
import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
@Injectable()
export class LoginAuthService {
  modelShow: boolean;
    sessionOut: number;
  userProfile: any;
  customLoggedIn: boolean;
  public date = new Date();
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  customLoggedIn$ = new BehaviorSubject<boolean>(this.customLoggedIn);
  private pingRequest: HttpRequest<any>;
  private pingInterval: number = 10 * 60;
  private pingHandle: any
  /*
   * An event emitted when the service is pinging.
   */
  public onPing: EventEmitter<any> = new EventEmitter;

  /*
   * An event emitted when the service has pinged an HTTP endpoint and received a response.
   */
  public onPingResponse: EventEmitter<HttpResponse<any>> = new EventEmitter<HttpResponse<any>>();
  constructor(private idle: Idle, private keepalive: Keepalive,private router: Router, private http: HttpClient) {
    
    idle.setIdle(20);
    this.sessionOut = idle.setTimeout(300);
    
    idle.onTimeoutWarning.subscribe((countdown:number) => {
      console.log('TimeoutWarning: ' + countdown);
      if(countdown=290){
        this.modelShow = true;
      }
    });

    idle.onTimeout.subscribe(() => {
    //   console.log('Timeout');
      localStorage.clear();
      this.router.navigate(['/login']);
    });
    idle.watch();
    this.keepalive.interval(300);

     this.keepalive.onPing.subscribe(() => this.lastPing = new Date());

     console.log(this.keepalive)
  }
  ngOnInit(): void {
    this.modelShow = false;
  }
  public hasPingHandle(): boolean {
    return this.pingHandle !== null && typeof this.pingHandle !== 'undefined';
  }
  setLoggedInCustom(value: boolean) {
    // Update login status subject
    this.customLoggedIn$.next(value);
    this.customLoggedIn = value;

  }

  public _setSession(authResult) {
    const expTime = this.sessionOut * 1000+ Date.now();
    // Save session data and update login status subject
    localStorage.setItem('token', authResult.access_token);
    console.log(localStorage.getItem("token"));
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('nickname', authResult.user_name);
    localStorage.setItem('expires_at', JSON.stringify(expTime));
    this.router.navigate(['/admin']);
    this.setLoggedInCustom(true);
  }
  getCustomLoginStatus(){
    // console.log(this.customLoggedIn);
    return this.customLoggedIn;
  }

  logout() {
    if(this.customLoggedIn){
      this.setLoggedInCustom(false);
      this.router.navigate(['/login']);
      console.log(this.customLoggedIn);
    }
    
    // Remove tokens and profile and update login status subject
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('expires_at');
    
  }

  get authenticated(): boolean {
    // Check if current date is greater than expiration
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    // console.log(expiresAt);
    // console.log(Date.now());
    // console.log(Date.now() < expiresAt);
    this.setLoggedInCustom(Date.now() < expiresAt);
    return Date.now() < expiresAt;
  }
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
}
