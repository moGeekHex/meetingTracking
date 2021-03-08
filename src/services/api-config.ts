import { create } from 'apisauce';

/**
 * common params interface
 */
export interface CommonParams {
    accessToken: string,
    loggedInUserID: number
}

/**
 * The options used to configure the API.
 */
export interface ApiConfig {

    /**
     * The URL of the api.
     */
    url: string

    /**
     * Milliseconds before we timeout the request.
     */
    timeout: number
}

/**
 * The default configuration for the app.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
    url: "http://tigercrm.tigergroup-company.com:4298/mobile",
    timeout: 10000
}

