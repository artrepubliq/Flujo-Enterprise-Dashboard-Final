import { IAccessLevelModel } from './model/accessLevel.model';

export class AppConstants {
    /*Heroku */
    public static get API_URL(): string { return 'https://enterprise-api.flujo.in/v1/'; }

    public static get CLIENT_ID(): string { return localStorage.getItem('client_id'); }
    public static get THEME_ID(): string { return '32'; }
    public static get DOMAINS_API_URL(): string { return 'https://enterprise-api.flujo.in/v1/'; }
    public static get SMS_API_URL(): string { return 'https://flujo-sms-staging.herokuapp.com/v1/'; }
    // public static get ACCESS_TOKEN(): string { return 'keerthan_token'; }
    // public static get EXPRESS_URL(): string { return 'http://flujo-middleware.herokuapp.com/'; }
    // public static get EXPRESS_URL(): string { return 'http://flujo-middleware.herokuapp.com/twitter/'; }
    public static get EXPRESS_URL(): string { return 'https://flujo-node.herokuapp.com/twitter/'; }
    // public static get EXPRESS_URL(): string { return 'http://localhost:8080/twitter/'; }
    public static get EXPRESS_URL_SCHEDULE(): string { return 'https://flujo-node.herokuapp.com/sheduler/twitter/'; }
    // public static get EXPRESS_URL_MAILGUN(): string { return 'http://localhost:3000/'; }
    public static get EXPRESS_URL_MAILGUN(): string { return 'https://bulk-email-enterprise.herokuapp.com/'; }
    public static get TWITTER_API_URL(): string { return 'https://api.twitter.com'; }

}
