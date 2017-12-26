export class Sale {

    value: number;
    paid: boolean;
    paidValue: number;
    id?: number;
    createdAt?: any;
    updatedAt?: any;
    debtor?: string;
  
    constructor(fields: any) {
        // Quick and dirty extend/assign fields to this model
        for (const f in fields) {
            this[f] = fields[f];
        }
    }

    clearSale() {
        this.value = 0;
        this.paid = true;
        this.paidValue = 0;
        this.debtor = null;
    }
  
}
  