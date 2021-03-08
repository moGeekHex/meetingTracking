import { create } from 'apisauce';
import { DEFAULT_API_CONFIG, CommonParams } from './api-config';
import { getData, storeData } from '../utils/asyncStorage';
import { UserData } from '../utils/asyncStorage/asyncStorage.types';
import isEmpty from 'lodash/isEmpty';
import { AxiosError } from 'axios';
import { services } from './services';
import { logoutFromApp } from '../utils/general/general';

/**
 * a .ts file that contains interceptors
 */

//create instance
const api = create({
  baseURL: DEFAULT_API_CONFIG.url,
  timeout: DEFAULT_API_CONFIG.timeout
});

/**
 * interceptor functions helpers
 */
const addAccessTokenParamOnly = async (currentParams: any) => {
  try {
    const dataFromStorage: UserData = await getData('UserData');

    /**
     * if null or empty (maybe not logged in).
     * return same params
     */
    if (isEmpty(dataFromStorage)) return currentParams;

    const commonParams: any = {
      'accessToken': dataFromStorage.AccessToken
    };
    const combinedHeaders = Object.assign(currentParams, commonParams);

    return combinedHeaders;
  }
  catch (error) {
    console.log('error in addCommonParams', error);
  }
}

const addCommonParams = async (currentParams: any) => {
  try {
    const dataFromStorage: UserData = await getData('UserData');

    /**
     * if null or empty (maybe not logged in).
     * return same params
     */
    if (isEmpty(dataFromStorage)) return currentParams;

    const commonParams: CommonParams = {
      'accessToken': dataFromStorage.AccessToken,
      'loggedInUserID': dataFromStorage.LoggedInUserID
    };
    const combinedHeaders = Object.assign(currentParams, commonParams);

    return combinedHeaders;
  }
  catch (error) {
    console.log('error in addCommonParams', error);
  }
}

/**
 * request interceptor to add some things
 * and make any edition in request before send
 */
api.axiosInstance.interceptors.request.use(async (request: any) => {

  //constnats
  const currentRequestParams = request.params;
  const url = request.url;

  //edit request
  if (!url.includes('login') && !url.includes('RefreshToken')) {
    request['params'] = await addCommonParams(currentRequestParams);
  }
  else if (url.includes('GetMeetings')) {
    request['params'] = await addAccessTokenParamOnly(currentRequestParams);
  }

  //return edited request
  return request;
});


/**
 * response interceptors to edit request and retry
 * such as reauthintication
 */
api.axiosInstance.interceptors.response.use(undefined, async function (err: AxiosError) {

  const responseStatus = err.response!.status;
  const dataFromStorage: UserData = await getData('UserData');

  if (isEmpty(dataFromStorage) == false) {
    return new Promise(async (resolve, reject) => {
      try {
        if (responseStatus != 401)
          return reject();

        //constants
        const { AccessToken, RefreshToken } = dataFromStorage;
        const refresResult: any = await services.refreshToken(AccessToken, RefreshToken);

        const editedRequest = err.config;
        if (refresResult.kind == 'ok') {

          /**
           * update data in storage
           */
          dataFromStorage['AccessToken'] = refresResult.refreshData.AccessToken;
          dataFromStorage['RefreshToken'] = refresResult.refreshData.RefreshToken;
          await storeData('UserData', dataFromStorage);

          /**
           * update and retry request again
           */
          editedRequest.params['accessToken'] = refresResult.refreshData.AccessToken;
          resolve(api.axiosInstance.request(editedRequest));
        }
        else if (refresResult.kind == 'rejected') {
          logoutFromApp().then(_ => {
            reject();
          }).catch(_ => {
            reject();
          });
        }
      } catch (err) {
        console.log('reauthenticate error', err)
        reject(err);
      }
    });
  } else {
    return Promise.reject();
  }
});

//export apisauce with transform
export const apisauce = api;