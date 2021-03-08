import { ApisauceInstance, ApiResponse, create } from 'apisauce';
import * as ApiTypes from './api.types';
import { getGeneralApiProblem } from './api-problem';
import Login from './models/Login';
import { apisauce } from './interception';
import Metting from './models/Metting';
import User from './models/User';
import Customer from './models/Customer';
import { DEFAULT_API_CONFIG } from './api-config';
import MettingStatus from './models/MettingStatus';
import isEmpty from 'lodash/isEmpty';
import UserLocation from './models/UserLocation';

/**
 * A class for services
 * 'login' and 'refresh' are not included in interception
 */
class Api {

    /**
      * The underlying apisauce instance which performs the requests.
     */
    apisauce: ApisauceInstance

    /**
     * constrctor
     * assign config to apisauce
     */
    constructor() {
        this.apisauce = apisauce;
    }

    /**
     * The api handlers
     */

    /**
     * A function to login
     * @param username @param password 
     */
    async login(username: string, password: string): Promise<ApiTypes.LoginApi> {

        // make the api call
        const params = {
            username: username,
            password: password
        };
        const api = create({
            baseURL: DEFAULT_API_CONFIG.url,
            params: params
        });
        const response: ApiResponse<any> = await api.get(`/login`);

        const serializeLoginData = (loginData: any) => {
            return new Login({
                AccessToken: loginData.AccessToken,
                RefreshToken: loginData.RefreshToken,
                LoggedInUserID: loginData.LoggedInUserID,
                IssueDateTime: loginData.IssueDateTime,
                ExpiryDateTime: loginData.ExpiryDateTime,
                ShowTeamLocations: loginData.ShowTeamLocations
            });
        };

        try {
            if (response.status == 400)
                return { kind: 'rejected', message: 'Invalid credintials' };


            //here im sure every thing is ok
            const serializedLoginData = serializeLoginData(response.data);
            return { kind: "ok", login: serializedLoginData };
        }
        catch (error) {
            console.log('errro in login', error);
            return { kind: 'unknown' };
        }

    }

    /**
     * A function to forgot password
     * @param email 
     */
    async forgotPassword(email: any): Promise<ApiTypes.ForgotPasswordApi> {

        // make the api call
        const response: ApiResponse<any> = await this.apisauce.post(`/forgotpassword`);

        // the typical ways to die when calling an api
        if (!response.ok) {
            const problem = getGeneralApiProblem(response)
            if (problem) return problem
        }

        //here im sure every thing is ok
        return { kind: "ok" };
    }

    /**
     * A function to get and filter mettings
     */
    async getMettings(from: string, to: string, statuses: string, users: string): Promise<ApiTypes.MettingsApi> {

        // make the api call
        const params: any = {
            fromDate: from,
            toDate: to,
            usersids: users
        };

        if (statuses) {
            params.statuses = statuses;
        }
        const response: ApiResponse<any> = await this.apisauce.get(`/GetMeetings`, params);

        // the typical ways to die when calling an api
        if (!response.ok) {
            const problem = getGeneralApiProblem(response)
            if (problem) return problem
        }

        const handleMettingDateTime = (mettingDateTime: string) => {
            mettingDateTime = mettingDateTime.replace(/\//g, '');
            mettingDateTime = mettingDateTime.replace('(', '');
            mettingDateTime = mettingDateTime.replace(')', '');
            mettingDateTime = mettingDateTime.replace('Date', '');
            return parseInt(mettingDateTime);
        };

        const serializeMetting = (rawMetting: any) => {
            return new Metting({
                ID: rawMetting.ID,

                //millisecond as string
                MeetingDateTime: handleMettingDateTime(rawMetting.MeetingDateTime),

                DepartureDateTime: rawMetting.DepartureDateTime,
                ArrivalDateTime: rawMetting.ArrivalDateTime,
                CustomerID: rawMetting.CustomerID,
                CustomerName: rawMetting.CustomerName,
                CustomerMobile: `${rawMetting.CustomerMobile}`,
                LocationDescription: rawMetting.locationDescription,
                LocationLatitude: rawMetting.LocationLatitude,
                LocationLongitude: rawMetting.LocationLongitude,
                Owner: rawMetting.Owner,
                Status: rawMetting.Status
            });
        };

        //if null thats mean date not exist (error in back end) should todo
        if (isEmpty(response.data))
            return { kind: "ok", mettings: [] };

        if (response.data.StatusCode == 400)
            return { kind: 'rejected', message: response.data.StatusMessage };

        //here im sure every thing is ok
        const serializedMettings: Metting[] = response.data.Meetings.map(serializeMetting);
        return { kind: "ok", mettings: serializedMettings };
    }

    /**
     * A function to request verification code
     */
    async requestMettingVerificationCodeCode(meetingID: string): Promise<ApiTypes.RequestMettingVerificationCode> {

        // make the api call
        const params = {
            meetingID: meetingID
        };
        const response: ApiResponse<any> =
            await this.apisauce.get(`/GetMeetingVerificationCode`, params);

        // the typical ways to die when calling an api
        if (!response.ok) {
            const problem = getGeneralApiProblem(response)
            if (problem) return problem
        }


        if (response.data.StatusCode == 400)
            return { kind: 'rejected', message: response.data.StatusMessage };

        //here im sure every thing is ok
        const verificationCodeData = {
            message: response.data.StatusMessage,
            verificationCode: response.data.VerificationCode
        }
        return { kind: "ok", VerificationCodeData: verificationCodeData };
    }

    /**
     * A function to confirm metting
     * departureDateTime and arrivalDateTime formt ' yyyy-MM-ddTHH:mm:ss'
     */
    async confirmMeeting(mettingId: number, verificationCode: string,
        departureDateTime: string, arrivalDateTime: string,
        locations: string, notes: string): Promise<ApiTypes.ConfirmTrip> {

        // make the api call
        const params = {
            meetingid: mettingId,
            verificationCode: verificationCode,
            departureDateTime: departureDateTime,
            arrivalDateTime: arrivalDateTime,
            notes: notes,
            locations: `${JSON.stringify(locations)}`.replace(/"/g, '')
        };
 
        const response: ApiResponse<any> = await this.apisauce.get('/ConfirmMeeting', params);
   
        // the typical ways to die when calling an api
        if (!response.ok) {
            const problem = getGeneralApiProblem(response)
            if (problem) return problem
        }


        //here im sure every thing is ok
        return { kind: "ok" };
    }

    /**
     * A function to get team agent locations
     * @param userId @example 1 
     */
    async getUserLocation(userId: number): Promise<ApiTypes.GetUsersLocation> {

        // make the api call
        const params = {
            userID: userId
        };
        const response: ApiResponse<any> = await this.apisauce.get(`/GetUserLocation`, params);
        
        // the typical ways to die when calling an api
        if (!response.ok) {
            const problem = getGeneralApiProblem(response)
            if (problem) return problem
        }

        const handleMettingDateTime = (mettingDateTime: string) => {
            mettingDateTime = mettingDateTime.replace(/\//g, '');
            mettingDateTime = mettingDateTime.replace('(', '');
            mettingDateTime = mettingDateTime.replace(')', '');
            mettingDateTime = mettingDateTime.replace('Date', '');
            return parseInt(mettingDateTime);
        };

        const serializeUserLocation = (rawUserLocation: any) => {
            return new UserLocation({
                ID: rawUserLocation.ID,
                UserID: rawUserLocation.UserID,
                Username: rawUserLocation.Username,
                LocationDateTimeString: rawUserLocation.LocationDateTimeString,
                LocationDateTime: handleMettingDateTime(rawUserLocation.LocationDateTime),
                LocationLatitude: parseFloat(rawUserLocation.LocationLatitude),
                LocationLongitude: parseFloat(rawUserLocation.LocationLatitude),
            });
        }

        try {
            if (response.data.StatusCode == 400)
                return { kind: 'rejected', message: response.data.StatusMessage };

            if (response.status == 400)
                return { kind: 'rejected', message: response.data.StatusMessage };

            //here im sure every thing is ok
            const serializedUserLocation: UserLocation = serializeUserLocation(response.data.UserLocation);
            return { kind: "ok", userLocation: serializedUserLocation };
        }
        catch (error) {
            console.log('errro in getUsersLocation', error);
            return { kind: 'unknown' };
        }
    }

    /**
     * A function to fetch metting details
     * @param mettingId 
     */
    async fetchMettingDetails(mettingId: string): Promise<ApiTypes.MettingsDetails> {

        // make the api call
        const response: ApiResponse<any> = await this.apisauce.get(`/GetMeetingByID`,
            { meetingID: mettingId });

        // the typical ways to die when calling an api
        if (!response.ok) {
            const problem = getGeneralApiProblem(response)
            if (problem) return problem
        }

        const handleMettingDateTime = (mettingDateTime: string) => {
            mettingDateTime = mettingDateTime.replace(/\//g, '');
            mettingDateTime = mettingDateTime.replace('(', '');
            mettingDateTime = mettingDateTime.replace(')', '');
            mettingDateTime = mettingDateTime.replace('Date', '');
            return parseInt(mettingDateTime);
        };

        const serializeMetting = (rawMetting: any) => {
            return new Metting({
                ID: rawMetting.ID,

                //milli seconds
                MeetingDateTime: handleMettingDateTime(rawMetting.MeetingDateTime),

                DepartureDateTime: rawMetting.DepartureDateTime,
                ArrivalDateTime: rawMetting.ArrivalDateTime,
                CustomerID: rawMetting.CustomerID,
                CustomerName: rawMetting.CustomerName,
                CustomerMobile: `${rawMetting.CustomerMobile}`,
                LocationDescription: rawMetting.LocationDescription,
                LocationLatitude: rawMetting.LocationLatitude,
                LocationLongitude: rawMetting.LocationLongitude,
                Owner: rawMetting.Owner,
                Status: rawMetting.Status
            });
        }

        try {

            if (response.data.StatusCode == 400)
                return { kind: 'rejected', message: response.data.StatusMessage };

            //here im sure every thing is ok
            const serializedMetting: Metting = serializeMetting(response.data.MeetingDetails);
            return { kind: "ok", mettingDetails: serializedMetting };
        }
        catch (error) {
            console.log('errro in login', error);
            return { kind: 'unknown' };
        }
    }

    /**
     * A function to refresh token
     * @param accessToken @param refreshToken
     */
    async refreshToken(accessToken: string, refreshToken: string): Promise<ApiTypes.RefreshTokenApi> {

        // make the api call
        const params = {
            aToken: accessToken,
            rToken: refreshToken
        }
        const api = create({
            baseURL: DEFAULT_API_CONFIG.url,
            params: params
        });
        const response: ApiResponse<any> = await api.get(`/RefreshToken`);

        // the typical ways to die when calling an api
        if (!response.ok) {
            const problem = getGeneralApiProblem(response)
            if (problem) return problem
        }

        try {
            if (response.status == 400)
                return { kind: 'rejected' };

            //here im sure every thing is ok
            return { kind: "ok", refreshData: response.data };
        }
        catch (error) {
            console.log('errro in login', error);
            return { kind: 'unknown' };
        }
    }

    /**
     * Get a users
     */
    async getUsers(): Promise<ApiTypes.GetUsersApi> {

        // make the api call
        const response: ApiResponse<any> = await this.apisauce.get(`/GetUsers`);
    
        // the typical ways to die when calling an api
        if (!response.ok) {
            const problem = getGeneralApiProblem(response)
            if (problem) return problem
        }

        const serializeUser = (rawUser: User) => {
            return new User({
                ID: rawUser.ID,
                ManagerID: rawUser.ManagerID,
                Name: rawUser.Name
            });
        }

        try {
            if (response.data.StatusCode == 400)
                return { kind: 'rejected', message: response.data.StatusMessage };

            //here im sure every thing is ok
            const serializedUsers: User[] = response.data.Users.map(serializeUser);
            return { kind: "ok", users: serializedUsers };
        }
        catch (error) {
            console.log('errro in getUsers', error);
            return { kind: 'unknown' };
        }
    }

    /**
     * Get a customers
     */
    async getCustomers(): Promise<ApiTypes.GetCustomersApi> {

        // make the api call
        const response: ApiResponse<any> = await this.apisauce.get(`/GetCustomers`);

        // the typical ways to die when calling an api
        if (!response.ok) {
            const problem = getGeneralApiProblem(response)
            if (problem) return problem
        }

        const serializeCustomer = (rawCustomer: Customer) => {
            return new Customer({
                ID: rawCustomer.ID,
                OwnerID: rawCustomer.OwnerID,
                Name: rawCustomer.Name,
                Mobile: rawCustomer.Mobile
            });
        }

        try {
            if (response.data.StatusCode == 400)
                return { kind: 'rejected', message: response.data.StatusMessage };

            //here im sure every thing is ok
            const serializedCustomers: Customer[] =
                response.data.Customers.map(serializeCustomer);
            return { kind: "ok", customers: serializedCustomers };
        }
        catch (error) {
            console.log('errro in getCustomers', error);
            return { kind: 'unknown' };
        }
    }

    /**
     * Craete a new metting
     */
    async createNewMetting(customerId: number, mettingDateTime: string,
        locationDescription: string, description: string):
        Promise<ApiTypes.CreateNewMettingApi> {

        // make the api call
        const params = {
            customerID: customerId,
            meetingDateTime: mettingDateTime,
            locationDescription: locationDescription,
            description: description
        };
        const response: ApiResponse<any> = await this.apisauce.get(`/NewMeeting`, params);

        // the typical ways to die when calling an api
        if (!response.ok) {
            const problem = getGeneralApiProblem(response)
            if (problem) return problem
        }

        try {
            if (response.status != 200)
                return { kind: 'rejected', message: response.data.StatusMessage };

            return { kind: "ok" };
        }
        catch (error) {
            console.log('errro in createNewMetting', error);
            return { kind: 'unknown' };
        }
    }

    /**
     * Get a metting statuses
     */
    async getMettingStatuses(): Promise<ApiTypes.GetMeetingStatuses> {

        // make the api call
        const response: ApiResponse<any> = await this.apisauce.get(`/GetMeetingStatuses`);

        // the typical ways to die when calling an api
        if (!response.ok) {
            const problem = getGeneralApiProblem(response)
            if (problem) return problem
        }

        const serializeMettingStatus = (mettingStatusRaw: any) => {
            return new MettingStatus({
                ID: mettingStatusRaw.ID,
                Name: mettingStatusRaw.Name
            });
        }

        try {
            if (response.data.StatusCode == 400)
                return { kind: 'rejected', message: response.data.StatusMessage };

            //serialize data
            const serializedMettingStatuses = response.data.MeetingStatuses.map(serializeMettingStatus);
            return { kind: "ok", statuses: serializedMettingStatuses };
        }
        catch (error) {
            console.log('errro in getMettingStatuses', error);
            return { kind: 'unknown' };
        }
    }

    /**
     * Cancels a metting
     */
    async cancelMeeting(meetingId: any, notes: string): Promise<ApiTypes.CancelMetting> {

        // make the api call
        const params = {
            meetingid: meetingId,
            notes: notes
        };
        const response: ApiResponse<any> = await this.apisauce.get(`/CancelMeeting`, params);

        // the typical ways to die when calling an api
        if (!response.ok) {
            const problem = getGeneralApiProblem(response)
            if (problem) return problem
        }

        return { kind: "ok" };
    }

    /**
     * Post user locations to server
     * 
     */
    async postUserLocations(userLocations: string[] | string): Promise<ApiTypes.CancelMetting> {
        try {
            const endPoint = `updateuserlocations?locations=${JSON.stringify(userLocations)}`
                .replace(/"/g, '');

            const response: ApiResponse<any> = await this.apisauce.get(endPoint);

            // the typical ways to die when calling an api
            if (!response.ok) {
                const problem = getGeneralApiProblem(response)
                if (problem) return problem
            }

            return { kind: "ok" };
        }
        catch (error) {
            console.log('error in postUserLocations 101', error);
            return { kind: 'rejected' };
        }
    }
}

/**
 * craete object from api and export it
 */
export const services = new Api();