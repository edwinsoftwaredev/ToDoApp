import {environment} from 'src/environments/environment';

export const SERVER_API_URL = 'https://localhost:5001/';
export const REDIRECT_URI = environment.production ? 'http://localhost:4200/auth/codes' : 'http://localhost:9876/auth/codes';
export const REDIRECT_LOGOUT = 'http://localhost:4200/logout';

