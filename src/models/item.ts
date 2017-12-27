export class Item {

  name: string;
  id?: number;
  nAvailable: number;
  price: number;
  selected?: boolean;
  nSelected?: number;

  constructor(fields: any) {
    // Quick and dirty extend/assign fields to this model
    for (const f in fields) {
      this[f] = fields[f];
    }
  }

}
