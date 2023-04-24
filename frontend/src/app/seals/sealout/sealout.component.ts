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
import { NgxSpinnerService } from "ngx-spinner";
import {
  NgbDateStruct,
  NgbModal,
  NgbModalOptions,
  ModalDismissReasons,
} from "@ng-bootstrap/ng-bootstrap";
import { RecriptComponent } from "../sealoutlist/recript/recript.component";
import { TruckModalComponent } from "app/trucks/truck-modal/truck-modal.component";
import * as swalFunctions from "./../../shared/services/sweetalert.service";

@Component({
  selector: "app-sealout",
  templateUrl: "./sealout.component.html",
  styleUrls: [
    "./sealout.component.scss",
    "../../../assets/sass/libs/select.scss",
  ],
  providers: [SealService, TruckService],
  encapsulation: ViewEncapsulation.None,
})
export class SealoutComponent implements OnInit {
  constructor(
    private sealService: SealService,
    public toastr: ToastrService,
    private truckservice: TruckService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal
  ) {}
  swal = swalFunctions;
  keyword = "name";
  @Input() txtSealTotal: string = "0";
  @Input() txtSealExtraTotal: string = "0";
  @Input() txtTruckNo: string;
  @Input() sealNoExt: any[] = [];
  selectedOptionsQRCode: any[] = [];
  itemSealNo: any[] = [];
  itemSelectSealNo: any[] = [];
  trucks: any[] = [];
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
        this.sealNoExt.push({
          id: this.generator(),
          sealNo: "",
          pack: 1,
          type: "พิเศษ",
        });
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
  validateData() {
    //check จำนวนซีล
    if (!this.txtSealTotal || this.txtSealTotal === "0") {
      this.toastr.warning("กรุณากรอก จำนวนซีล");
      return false;
    }
    //check ซีลพิเศษ
    if (parseInt(this.txtSealExtraTotal) > 0) {
      const result = this.sealNoExt.find((item) => item.sealNo === "");
      if (result) {
        this.toastr.warning("กรุณากรอก หมายเลขซีลพิเศษ");
        return false;
      }
    }
    //check ทะเบียรถ
    if (!this.txtTruckNo) {
      this.toastr.warning("กรุณาเลือก ทะเบียนรถ");
      return false;
    }
    //check item SealQrcode
    if (this.itemSelectSealNo.length === 0) {
      this.toastr.warning("กรุณาเลือก หมายเลขซีล/QR Code");
      return false;
    }
    //check count seal==txtSealTotal
    if (this.subTotalSeal() !== parseInt(this.txtSealTotal)) {
      this.toastr.warning("จำนวนซีลไม่เท่ากับจำนวนซีลรวม");
      return false;
    }
    //check sealExtra ซ้ำ
    if (this.sealNoExt.length>1) {
      let valueArr = this.sealNoExt.map(function (item) { return item.sealNo });
      let isDuplicate = valueArr.some(function (item, idx) {
        return valueArr.indexOf(item) != idx
      });
      if (isDuplicate) {
        this.toastr.warning("หมายเลขซีลพิเศษซ้ำกัน");
        return false;
      }
    }
    return true;
  }
  addTruck() {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      size: "md",
    };
    const modalRef = this.modalService.open(
      TruckModalComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.id = ""; // should be the id
    modalRef.componentInstance.data = {
      truckIdHead: "",
      TruckIdTail: "",
    }; // should be the data
    modalRef.result
      .then((result) => {
        this.spinner.show(undefined, {
          type: "ball-triangle-path",
          size: "medium",
          bdColor: "rgba(0, 0, 0, 0.8)",
          color: "#fff",
          fullScreen: true,
        });
        this.truckservice.addTruck(result).subscribe(
          (res: any) => {
            this.spinner.hide();
            this.swal.showDialog("success", "เพิ่มข้อมูลสำเร็จแล้ว");
            this.getTrucks();
          },
          (error: any) => {
            this.spinner.hide();
            this.swal.showDialog("error", "เกิดข้อผิดพลาด : " + error);
          }
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }
  addData() {
    //validation before save
    if (!this.validateData()) return;

    this.spinner.show(undefined, {
      type: "ball-triangle-path",
      size: "medium",
      bdColor: "rgba(0, 0, 0, 0.8)",
      color: "#fff",
      fullScreen: true,
    });

    const result = this.trucks.find((item) => item._id === this.txtTruckNo);
    const body = {
      sealTotal: this.txtSealTotal,
      sealTotalExtra: this.txtSealExtraTotal,
      truckId: result._id,
      truckLicense: `${result.truckIdHead}/${result.truckIdTail}`,
      sealItem: this.itemSelectSealNo,
      sealItemExtra: this.sealNoExt,
    };
    this.sealService.addSealOut(JSON.stringify(body)).subscribe(
      (res: any) => {
        this.spinner.hide();
        this.swal.showDialog("success", "เพิ่มข้อมูลสำเร็จแล้ว");
        this.showRecript(res);
      },
      (error: any) => {
        this.spinner.hide();
        this.swal.showDialog("error", "เกิดข้อผิดพลาด : " + error);
      }
    );
  }
  showRecript(item: any) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      size: "md",
    };
    const modalRef = this.modalService.open(RecriptComponent, ngbModalOptions);
    modalRef.componentInstance.id = item._id;
    modalRef.componentInstance.data = item;
  }
  ngOnInit(): void {
    this.getSealNo();
    this.getTrucks();
  }
}
