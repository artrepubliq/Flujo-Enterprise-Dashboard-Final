import { IAccessLevelModel } from './model/accessLevel.model';

export class AppConstants {
    /** server */
    // public static get API_URL(): string { return 'http://flujo.in/dashboard/flujo.in_api_client/'; }

    /*Staging*/

    // public static get API_URL(): string { return 'http://flujo.in/dashboard/flujo_staging/v1/'; }

    /**this is heroku cloud url for production */
    // public static get API_URL(): string { return 'https://flujo-api-pro.herokuapp.com'; }

    /**this is heroku cloud url for staging */
    // public static get API_URL(): string { return 'https://flujo-client-api.herokuapp.com'; }

    // public static get API_URL(): string { return 'http://flujo.in/dashboard/flujo_staging/v1/'; }

    /*Heroku */
    public static get API_URL(): string { return 'http://flujo-client-api.herokuapp.com/v1/'; }

    public static get CLIENT_ID(): string { return localStorage.getItem('client_id'); }
    public static get THEME_ID(): string { return '32'; }

//     public static get ACCESS_TOKEN(): string { return 'keerthan_token'; }
    // public static get EXPRESS_URL(): string { return 'http://flujo-middleware.herokuapp.com/'; }
    // public static get EXPRESS_URL(): string { return 'http://flujo-middleware.herokuapp.com/twitter/'; }
    // public static get EXPRESS_URL(): string { return 'https://flujo-node.herokuapp.com/twitter/'; }
    public static get EXPRESS_URL(): string { return 'http://localhost:8080/twitter/'; }
    public static get TWITTER_API_URL(): string { return 'https://api.twitter.com'; }
    public static get DEFAULT(): Array<IAccessLevelModel> {
        return [
            { name: 'Editor', feature_id: 1, enable: false, read: false, write: false, order: '1' },
            { name: 'Social', feature_id: 2, enable: false, read: false, write: false, order: '2' },
            { name: 'Mail', feature_id: 3, enable: false, read: false, write: false, order: '3' },
            { name: 'SMS', feature_id: 4, enable: false, read: false, write: false, order: '4' },
            { name: 'Manage Reports', feature_id: 5, enable: false, read: false, write: false, order: '5' },
            { name: 'Analytics', feature_id: 6, enable: false, read: false, write: false, order: '6' },
            { name: 'Feedback', feature_id: 7, enable: false, read: false, write: false, order: '7' },
            { name: 'Change Maker', feature_id: 8, enable: false, read: false, write: false, order: '8' },
            { name: 'Surveys', feature_id: 9, enable: false, read: false, write: false, order: '9' },
            { name: 'Database', feature_id: 10, enable: false, read: false, write: false, order: '10' },
            { name: 'Drive', feature_id: 11, enable: false, read: false, write: false, order: '11' },
            { name: 'Team', feature_id: 12, enable: false, read: false, write: false, order: '12' },
            { name: 'Logo', feature_id: 13, enable: false, read: false, write: false, order: '13' },
            { name: 'Media Management', feature_id: 14, enable: false, read: false, write: false, order: '14' },
            { name: 'Theme Global Configuration', feature_id: 15, enable: false, read: false, write: false, order: '15' },
            { name: 'SMTP', feature_id: 16, enable: false, read: false, write: false, order: '16' },
            { name: 'User Management', feature_id: 17, enable: false, read: false, write: false, order: '17' },
            { name: 'Social links update', feature_id: 18, enable: false, read: false, write: false, order: '18' },
            { name: 'Biography', feature_id: 19, enable: false, read: false, write: false, order: '19' },
            { name: 'Create Module', feature_id: 20, enable: false, read: false, write: false, order: '20' },
            { name: 'Terms & Conditions', feature_id: 21, enable: false, read: false, write: false, order: '21' },
            { name: 'Privacy & Policy', feature_id: 22, enable: false, read: false, write: false, order: '22' },
            { name: 'Change Password', feature_id: 23, enable: true, read: true, write: true, order: '23' },
            { name: 'Problem Category', feature_id: 24, enable: false, read: false, write: false, order: '24' },
            { name: 'Area Category', feature_id: 25, enable: false, read: false, write: false, order: '25' },
            { name: 'Settings', feature_id: 26, enable: false, read: false, write: false, order: '26' },
            { name: 'SMS Template Configuration', feature_id: 27, enable: false, read: false, write: false, order: '27' },
            { name: 'Email Template', feature_id: 28, enable: false, read: false, write: false, order: '28' },
            { name: 'Social Configuration', feature_id: 29, enable: false, read: false, write: false, order: '29' },
            { name: 'Choose platform', feature_id: 30, enable: false, read: false, write: false, order: '30' },
            { name: 'profile', feature_id: 31, enable: true, read: true, write: true, order: '31' },
            { name: 'WhatsApp', feature_id: 32, enable: false, read: false, write: false, order: '32' }
        ];
    }
}
