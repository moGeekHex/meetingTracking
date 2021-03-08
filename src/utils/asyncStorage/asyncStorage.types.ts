import Login from "../../services/models/Login";

/**
 * a .ts file that contains interafces and types for storage
 */

/**
 * User data interface
 */
export interface UserData extends Login {

}

/**
 * RequestVerificationCode interface
 */
export interface RequestVerificationCode {
    requestVerificationCodeTime: string;
}

/**
 * The models type
 * data that will be store or get from storage
 * should be one of this
 */
export type StorageModels = UserData | RequestVerificationCode;

/**
 * Storage keys types
 */
export type StorageKeys = 'UserData' | 'RequestVerificationCode'; 