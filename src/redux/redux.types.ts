import Login from "../services/models/Login";
import Metting from '../services/models/Metting';
import User from "../services/models/User";
import CustomerModel from "../services/models/Customer";
import MettingStatus from "../services/models/MettingStatus";
import UserLocation from "../services/models/UserLocation";

/**
 * A .ts filr that contains redux types
 */
export type Dispatch = ({ type, error, payload }:
    { type: string, error?: string, payload?: any }) => void

export interface Action {
    type: string,
    error?: string,
    payload?: any,
    message?: string
}

/**
 * Common redux interface
 */
export interface Common {
    loading: boolean,
    error?: string,
    success: boolean
}

/**
 * Auth redux interface
 */
export interface Auth extends Common {
    userData: Login | {}
};

/**
 * Location redux interface
 */
export interface Location {
    lat: number,
    lng: number,
    description: string
}

/**
 * trip redux interface
 */
export interface Trip extends Common {
    verificationCodeData: { message: string, verificationCode: string } | any;
    verificationCodeRequest: {
        isRequestVerificationCodeEnabled: 'ON' | 'OFF',
        requestVerificationCodeTime: number
    };
    isMettingConfirmed: boolean;
    confirmingMetting: boolean;
    confirmMettingError: string | undefined;
};

/**
 * Mettings redux interface
 */
export interface Mettings extends Common {
    mettings: Metting[];
    selectedMettingId: string | null;
    mettingDetails: Metting | {};
    mettingStatuses: Array<MettingStatus>;

    creatingMetting: boolean;
    creatingMettingSuccess: boolean;
    creatingMettingError: string | undefined;

    cancelingMetting: boolean;
    cancelingMettingSuccess: boolean;
    cancelingMettingError: string | undefined;
}

/**
 * Team location interface redux
 */
export interface TeamLocations extends Common {
    users: Array<User>;
    userLocation: UserLocation|{};
}

/**
 * customers interface redux
 */
export interface Customer extends Common {
    customers: CustomerModel[]
}

/**
 * Metting filters interface redux
 */
export interface MettingFilters {
    startTime: number | string;
    endTime: number | string;
    selectedDate: Date;
    selectedUsers: Array<any>;
    selectedStatuses: Array<any>;
    users: Array<any> | null;
    statuses: Array<any> | null;
}