export interface UserLocationProperties {
    ID: number;
    Username: string;
    UserID: number;
    LocationDateTime: number;
    LocationDateTimeString: null | string;
    LocationLatitude: number;
    LocationLongitude: number;
}

export default class UserLocation {

    //locale variables
    ID: number = -1;
    Username: string = '';
    UserID: number = -1;
    LocationDateTime: number = 0;
    LocationDateTimeString: null | string = null;
    LocationLatitude: number = 0.0;
    LocationLongitude: number = 0.0;

    constructor(obj: UserLocationProperties) {
        this.setAttributes!(obj);
    }

    setAttributes?= (obj: any) => {
        for (let key in obj) {
            this[key] = obj[key];
        }
    }
}