import RefreshToken, { RefreshTokenProperties } from "./RefreshToken";

export interface LoginProperties extends RefreshTokenProperties {
    LoggedInUserID: number,
    ShowTeamLocations: string,
    username?: string
}

export default class Login extends RefreshToken {

    //locale variables
    LoggedInUserID: number = -1;
    ShowTeamLocations: string = ''
    username?: string

    constructor(obj: LoginProperties) {
        super(obj);
        this.setAttributes!(obj);
    }

    setAttributes?= (obj: any) => {
        for (let key in obj) {
            this[key] = obj[key];
        }
    }
}