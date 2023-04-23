import { th } from "date-fns/locale";
import { DatePipe } from "@angular/common";
export class Seal {
  public _id: string;
  public id: { increment: number };
  public sealNo: string;
  public pack: number;
  public isUsed: boolean;
  public checked: boolean;
  public createAt: Date;
  public createAtSt: string;
  constructor() {
    this.id.increment = 0;
    this.sealNo = '';
    this.pack = 0;
    this.isUsed = false;
    this.checked = false;
  }
}
