export interface MettingProperties {
    ID: number;
    MeetingDateTime: number;
    DepartureDateTime: null | string;
    ArrivalDateTime: null | string;
    CustomerID: number;
    CustomerName: string;
    CustomerMobile: string;
    LocationDescription: string;
    LocationLatitude: null | number;
    LocationLongitude: null | number;
    Owner: string;
    Status: string;
}

export default class Metting {

    //locale variables
    ID: number = -1;
    MeetingDateTime: number = 0;
    DepartureDateTime: null | string = null;
    ArrivalDateTime: null | string = null;
    CustomerID: number = -1;
    CustomerName: string = '';
    CustomerMobile: string = '';
    LocationDescription: string = '';
    LocationLatitude: null | number = -1;
    LocationLongitude: null | number = -1;
    Owner: string = '';
    Status: string = '';

    constructor(obj: MettingProperties) {
        this.setAttributes!(obj);
    }

    setAttributes?= (obj: any) => {
        for (let key in obj) {
            this[key] = obj[key];
        }
    }
}