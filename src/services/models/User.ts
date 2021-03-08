export interface UserProperties {
    ID: number,
    ManagerID: number,
    Name: string
}

export default class User {

    //locale variables
    ID: number = -1;
    ManagerID: number = -1;
    Name: string = '';

    constructor(obj: UserProperties) {
        this.setAttributes!(obj);
    }

    setAttributes?= (obj: any) => {
        for (let key in obj) {
            this[key] = obj[key];
        }
    }
}