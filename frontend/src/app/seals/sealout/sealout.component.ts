import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { forEach } from "core-js/core/array";
import { SealService } from "../seal.service";
import { ToastrService } from "ngx-toastr";
import { TruckService } from "../../trucks/truck.service";
import { th } from "date-fns/locale";
@Component({
  selector: "app-sealout",
  templateUrl: "./sealout.component.html",
  styleUrls: [
    "./sealout.component.scss",
    "../../../assets/sass/libs/select.scss",
  ],
  providers: [SealService,TruckService],
  encapsulation: ViewEncapsulation.None,
})
export class SealoutComponent implements OnInit {
  constructor(
    private sealService: SealService,
    public toastr: ToastrService,
    private truckservice: TruckService
  ) {}
  keyword = "name";
  @Input() txtSealTotal: string = "0";
  @Input() txtSealExtraTotal: string = "0";
  @Input() txtTruckNo: string;
  @Input() sealNoExt: any[] = [];
  selectedOptionsQRCode: any[] = [];
  itemSealNo: any[] = [];
  itemSelectSealNo: any[] = [];
  trucks:any[]=[]
  cities = [
    { id: 1, name: "Vilnius" },
    { id: 2, name: "Kaunas" },
    { id: 3, name: "Pavilnys", disabled: true },
    { id: 4, name: "Pabradė" },
    { id: 5, name: "Klaipėda" },
  ];

  clearSelectionQRCode() {
    this.selectedOptionsQRCode = [];
  }
  getSealNo() {
    this.sealService.getSealToTxtQRCode().subscribe((res: any) => {
      this.itemSealNo = res;
    });
  }
  getTrucks() {
    this.truckservice.getTrucks().subscribe(
      (trucks) => {
        this.trucks = trucks;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  isValidChkAddItemSeal(id, pack) {
    const result = this.itemSelectSealNo.find((item) => item.id === id);
    if (result) {
      this.toastr.warning("มีหมายเลขซีลนี้ในตารางแล้ว");
      return false;
    }
    //check seal > total seal
    if (pack + this.subTotalSeal() > this.txtSealTotal) {
      this.toastr.warning("จำนวนซีลรวม มากกว่าซีลที่ต้องการ");
      return false;
    }
    return true;
  }
  genSealExtra(txt: number) {
    this.sealNoExt = [];
    if (this.txtSealExtraTotal) {
      let vCount: number = parseInt(this.txtSealExtraTotal);
      for (let index = 0; index < vCount; index++) {
        this.sealNoExt.push({ id:this.generator(),sealNo: '',pack:1,type:'พิเศษ' });
      }
    }
  }
  delSealExtra(index) {
    if (this.sealNoExt.length > 1) {
      this.sealNoExt.splice(index, 1);
    }
  }

  selectEvent() {
    let id = this.selectedOptionsQRCode;
    this.clearSelectionQRCode();
    if (!this.txtSealTotal || parseInt(this.txtSealTotal) <= 0) {
      this.toastr.warning("กรุณาระบุ จำนวนซีล");
      return;
    }
    if (this.selectedOptionsQRCode) {
      const result = this.itemSealNo.find((item) => item._id === id);
      if (!this.isValidChkAddItemSeal(id, result.pack)) {
        return;
      }
      this.itemSelectSealNo.push({
        id: result._id,
        sealNo: result.sealNo,
        pack: result.pack,
        type: "ปกติ",
      });
    } else {
      this.toastr.warning("กรุณาเลือก หมายเลขซีล/QR Code");
    }
    // do something with selected item
  }
  removeItem(item: any) {
    let index = this.itemSelectSealNo.indexOf(item);
    this.itemSelectSealNo.splice(index, 1);
  }

  onChangeSearch(val: string) {
    console.log(val);
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e) {
    console.log("focused", e.value);
    // do something when input is focused
  }
  subTotalSeal() {
    let total: number = 0;
    for (const key in this.itemSelectSealNo) {
      if (this.itemSelectSealNo[key].pack)
        total += parseInt(this.itemSelectSealNo[key].pack);
    }
    return total;
  }
  private generator(): string {
    const isString = `${this.S4()}${this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}${this.S4()}${this.S4()}`;

    return isString;
  }

  private S4(): string {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  ngOnInit(): void {
    this.getSealNo();
    this.getTrucks();
  }
}
