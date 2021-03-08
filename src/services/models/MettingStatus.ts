export type MettingStatusTypes = 'All' | 'New' | 'Completed' | 'Cancelled';

export interface MettingStatusProperties {
    ID: number;
    Name: MettingStatusTypes;
}

export default class MettingStatus {

    //locale variables
    ID: number = -1;
    Name: MettingStatusTypes = 'All';

    constructor(obj: MettingStatusProperties) {
        this.setAttributes!(obj);
    }

    setAttributes?= (obj: any) => {
        for (let key in obj) {
            this[key] = obj[key];
        }
    }
}