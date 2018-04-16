interface AuthConfig {
    CLIENT_ID: string;
    CLIENT_DOMAIN: string;
    AUDIENCE: string;
    REDIRECT: string;
    SCOPE: string;
  }
  export const AUTH_CONFIG: AuthConfig = {
    CLIENT_ID: 'ig2WMBnfpVXJwg1UNvzA3t1JjAOYBybu',
    CLIENT_DOMAIN: 'flujosass.auth0.com', // e.g., you.auth0.com
    // AUDIENCE: 'http://localhost:3001',
    AUDIENCE: '',
    // REDIRECT: 'http://localhost:4200/callback',
    REDIRECT: 'http://flujo.in/callback',
    SCOPE: 'openid profile email'
  };
  