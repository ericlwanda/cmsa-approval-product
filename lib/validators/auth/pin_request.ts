import axios from 'axios';
import https from 'https';
import btoa from 'btoa';

const CONTENT_TYPE = 'application/json';
const API_KEY = process.env.BEAM_OTP_KEY;
const SECRET_KEY = process.env.BEAM_OTP_SECRET;
const APP_ID = process.env.APP_ID;

export async function requestOTP(msisdn: string) {
  try {

    if (!API_KEY || !SECRET_KEY || !APP_ID) {
        return { error: 'API key, secret key, and app ID must be set in environment variables'};
      }
      
    const response = await axios.post(
      `${process.env.BEAM_OTP_BASE_URL}/v1/request`,
      {
       appId: APP_ID,
        msisdn,
      },
      {
        headers: {
          'Content-Type': CONTENT_TYPE,
          Authorization: 'Basic ' + btoa(`${API_KEY}:${SECRET_KEY}`),
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: process.env.NODE_ENV !== 'production',
        }),
      }
    );

    return response.data;
  } catch (error:any) {
    console.error('error',error.response.data.data.message.message);
    return  { error: error.response.data.data.message.message };
  }
}
