export interface CustomerProperties {
    ID: number,
    OwnerID: number,
    Name: string,
    Mobile: string
}

export default class Customer {

    //locale variables
    ID: number = -1;
    OwnerID: number = -1;
    Name: string = '';
    Mobile: string = '';

    constructor(obj: CustomerProperties) {
        this.setAttributes!(obj);
    }

    setAttributes?= (obj: any) => {
        for (let key in obj) {
            this[key] = obj[key];
        }
    }
}