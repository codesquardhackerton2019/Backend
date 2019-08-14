import { GaxiosResponse } from "gaxios";
import { google, oauth2_v2 } from 'googleapis';
import { oauth2Client } from '../config/oauth';

async function getGoogleUserInfo (authorizationCode: string)
: Promise<GaxiosResponse<oauth2_v2.Schema$Userinfoplus>> {
  try {
    const { tokens } = await oauth2Client.getToken(authorizationCode);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      version: 'v2',
      auth: oauth2Client,
    });

    return oauth2.userinfo.get();
  } catch (error) {
    throw error;
  }
}

export default {
  getGoogleUserInfo,
};
