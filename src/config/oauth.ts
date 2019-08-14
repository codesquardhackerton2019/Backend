import { google } from 'googleapis';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL } from '../util/secrets';

export const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL,
);

const scopes = [
  'https://www.googleapis.com/auth/plus.login',
  'https://www.googleapis.com/auth/userinfo.email',
];

export const googleAuthUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});
