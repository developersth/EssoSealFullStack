import { th } from "date-fns/locale";
import { DatePipe } from '@angular/common';
import { create } from "core-js/core/object";
import { number } from "ngx-custom-validators/src/app/number/validator";
export class Seal {
  public _id :string;
  public id :string;
  public sealNo: string;
  public pack: number;
  public isUsed: boolean;
  public checked:boolean;
  public createAt:Date;
  public createAtSt:string;
  constructor(_id:string, sealNo: string, pack: number, isUsed: boolean,createAt:Date,private datePipe: DatePipe) {
    this._id =_id;
    this.sealNo = sealNo;
    this.pack = pack;
    this.isUsed = isUsed;
    this.createAt=createAt;

  }
}
