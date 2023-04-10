import { th } from "date-fns/locale";
import { DatePipe } from '@angular/common';
let dateString = '2023-04-10T17:01:12.075Z';
export class Seal {
  public id :string;
  public sealNo: string;
  public pack: number;
  public isUsed: boolean;
  public checked:boolean;
  public createAt:Date;
  public createAtString:string;
  // constructor(id:string, sealNo: string, pack: number, isUsed: boolean,createAt:Date,private datePipe: DatePipe) {
  //   this.id =id;
  //   this.sealNo = sealNo;
  //   this.pack = pack;
  //   this.isUsed = isUsed;
  //   this.createAt=createAt;
  // }
}
