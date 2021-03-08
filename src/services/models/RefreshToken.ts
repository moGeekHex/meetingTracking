export interface RefreshTokenProperties {
    AccessToken: string,
    RefreshToken: string,
    IssueDateTime: string,
    ExpiryDateTime: string,
}

export default class RefreshToken {

    //locale variables
    AccessToken: string = '';
    RefreshToken: string = '';
    IssueDateTime: string = '';
    ExpiryDateTime: string = '';

    constructor(obj: RefreshTokenProperties) {
        this.setAttributes!(obj);
    }

    setAttributes?= (obj: RefreshTokenProperties) => {
        for (let key in obj) {
            this[key] = obj[key];
        }
    }
}