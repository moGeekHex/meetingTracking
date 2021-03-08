import { GeneralApiProblem } from "./api-problem";
import Login from "./models/Login";
import RefreshToken from "./models/RefreshToken";
import Metting from './models/Metting';
import User from "./models/User";
import Customer from "./models/Customer";
import MettingStatus from "./models/MettingStatus";
import UserLocation from "./models/UserLocation";

/**
 * interfaces and types that will be used here
 */
type Path = {
    time: number,
    lat: number,
    lng: number
};

/**
 * A file that contains all api types
 */

/**
 * response interfaces
 */
export type LoginApi = { kind: "ok"; login: Login } |
{ kind: "rejected" | "unknown"; message?: string } | GeneralApiProblem;

export type RefreshTokenApi = { kind: "ok"; refreshData: RefreshToken } |
{ kind: "rejected" | "unknown"; message?: string } | GeneralApiProblem;

export type ForgotPasswordApi = { kind: "ok"; } |
{ kind: "rejected" | "unknown"; message?: string } | GeneralApiProblem;

export type MettingsApi = { kind: "ok"; mettings: Metting[] } |
{ kind: "rejected" | "unknown"; message?: string } | GeneralApiProblem;

export type MettingsDetails = { kind: "ok"; mettingDetails: Metting } |
{ kind: "rejected" | "unknown"; message?: string } | GeneralApiProblem;

export type GetUsersApi = { kind: "ok"; users: User[] } |
{ kind: "rejected" | "unknown"; message?: string } | GeneralApiProblem;

export type GetCustomersApi = { kind: "ok"; customers: Customer[] } |
{ kind: "rejected" | "unknown"; message?: string } | GeneralApiProblem;

export type CreateNewMettingApi = { kind: "ok" } |
{ kind: "rejected" | "unknown"; message?: string } | GeneralApiProblem;

export type GetMeetingStatuses = { kind: "ok", statuses: MettingStatus[] } |
{ kind: "rejected" | "unknown"; message?: string } | GeneralApiProblem;

export type RequestMettingVerificationCode = { kind: "ok", VerificationCodeData: { message: string, verificationCode: string } } |
{ kind: "rejected" | "unknown"; message?: string } | GeneralApiProblem;

export type GetUsersLocation = { kind: "ok", userLocation: UserLocation } |
{ kind: "rejected" | "unknown"; message?: string } | GeneralApiProblem;

export type ConfirmTrip = { kind: "ok" } | GeneralApiProblem;

export type CancelMetting = { kind: "ok" } | GeneralApiProblem;
