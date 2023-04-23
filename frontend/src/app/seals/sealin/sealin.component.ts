import { Component, OnInit, ViewEncapsulation, ViewChild, DoCheck } from "@angular/core";
import { CrudModalComponent } from "./crud-modal/crud-modal.component";

import {
  NgbDateStruct,
  NgbModal,
  NgbModalOptions,
  ModalDismissReasons,
} from "@ng-bootstrap/ng-bootstrap";
import { SealService } from "../seal.service";
import { NgxSpinnerService } from "ngx-spinner";
import * as swalFunctions from "./../../shared/services/sweetalert.service";
import { th } from "date-fns/locale";
import { Seal } from "../seal.model";
import { forEach } from "core-js/core/array";

const now = new Date();
let swal = swalFunctions;
@Component({
  selector: "app-sealin",
  templateUrl: "./sealin.component.html",
  styleUrls: [
    "./sealin.component.scss",
    "../../../assets/sass/libs/datepicker.scss",
  ],
  providers: [SealService],
})
export class SealinComponent implements OnInit {
  window: any;
  private mediaQueryList: MediaQueryList;
  constructor(
    private modalService: NgbModal,
    private sealService: SealService,
    private spinner: NgxSpinnerService
  ) {
    this.mediaQueryList = window.matchMedia("print");
    this.mediaQueryList.addListener(this.handleMediaQueryChange);
  }

  displayMonths = 2;
  dtStart: NgbDateStruct;
  dtEnd: NgbDateStruct;
  page = 1;
  pageSize = 10;
  pageSizes = [10, 20, 50, 100];
  currentPage = 1;
  searchTerm: string = "";
  closeResult: string;
  checkedAll: boolean = false;
  sealNo: string;
  sealItem: Seal[] = [];
  filterItems: Seal[] = [];
  enableBtnDelete: boolean = false;

  ngOnDestroy() {
    this.mediaQueryList.removeListener(this.handleMediaQueryChange);
  }

  handleMediaQueryChange(mql: MediaQueryListEvent) {
    if (mql.matches) {
      console.log("Print dialog is open");
    } else {
      console.log("Print dialog is closed");
    }
  }
  ngOnInit(): void {
    this.selectToday();
    this.getSeal();
    this.window = window;
  }


  pageChanged(event: any): void {
    this.page = event.page;
  }
  searchItem() {
    this.page = 1; // รีเซ็ตหน้าเป็นหน้าที่ 1 เมื่อทำการกรองข้อมูล
    this.searchTerm = this.searchTerm.trim().toLowerCase();
    if (this.searchTerm === "") {
      // กรณีไม่มีคำค้นหา ให้แสดงข้อมูลทั้งหมด
      this.filterItems = this.sealItem;
    } else {
      // กรณีมีคำค้นหา ให้กรองข้อมูลตามคำค้นหา
      this.filterItems = this.sealItem.filter(
        (item) =>
          item.id.increment.toString().includes(this.searchTerm) ||
          item.sealNo.toLowerCase().includes(this.searchTerm) ||
          item.pack
            .toString()
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
      );
    }
  }
  onItemChecked(item: any, isChecked: boolean) {
    // Do something with the checked item
    if(isChecked) {
      this.enableBtnDelete=true;
    }else{
      this.enableBtnDelete=false;
    }
    console.log(item.name + ' was ' + (isChecked ? 'checked' : 'unchecked'));
  }
  checkAllItems() {
    for (let item of this.sealItem) {
      if (this.checkedAll) {
        item.checked = true;
      } else {
        item.checked = false;
      }
    }
  }
  isDisabled(date: NgbDateStruct, current: { month: number }) {
    return date.month !== current.month;
  }

  // Selects today's date
  selectToday() {
    this.dtStart = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
    };
    this.dtEnd = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate() + 1,
    };
  }

  // Custom Day View Starts
  isWeekend(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.getDay() === 0 || d.getDay() === 6;
  }

  format(date: NgbDateStruct): string {
    return date
      ? date.year +
          "-" +
          ("0" + date.month).slice(-2) +
          "-" +
          ("0" + date.day).slice(-2)
      : null;
  }

  getSeal() {
    let startDate: string = this.format(this.dtStart);
    let endDate: string = this.format(this.dtEnd);
    this.sealService.getSeal(startDate, endDate).subscribe((res: any) => {
      this.sealItem = res;
      this.searchItem();
    });
  }
  // Open default modal
  showQRCode(item: any, content: any) {
    this.sealNo = item.sealNo;
    this.modalService.open(content, { size: "sm" }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  // This function is used in open
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
  DeleteData(id: string) {

    swal
      .ConfirmText("แจ้งเตือนการลบข้อมูล", "คุณต้องการลบข้อมูลหรือไม่?")
      .then((res) => {
        if (res) {
          this.sealService.deleteSeal(id).subscribe(
            (res: any) => {
              swal.showDialog("success", "ลบข้อมูลเรียบร้อยแล้วแล้ว");
              this.getSeal();
            },
            (error: any) => {
              swal.showDialog("error", "เกิดข้อผิดพลาด:" + error);
            }
          );
        }
      });
  }
  deleteAll() {
    swal
      .ConfirmText("แจ้งเตือนการลบข้อมูล", "คุณต้องการลบข้อมูลหรือไม่?")
      .then((res) => {
        if (res) {
          let body=this.filterItems.filter(item => item.checked===true);
          console.log(this.filterItems);
          this.sealService.deleteSealAll(body).subscribe(
            (res: any) => {
              swal.showDialog("success", "ลบข้อมูลเรียบร้อยแล้วแล้ว");
              this.getSeal();
            },
            (error: any) => {
              swal.showDialog("error", "เกิดข้อผิดพลาด:" + error);
            }
          );
        }
      });
  }
  async printQRCode() {
    //  const printContents = document.getElementById("printDivQR").cloneNode(true);
    //  const iframe = document.createElement("iframe");
    //  iframe.setAttribute("style", "visibility:hidden; height:0; width:0; position:absolute;");
    //  document.body.appendChild(iframe);
    //  iframe.contentDocument.body.appendChild(printContents);
    //  iframe.contentWindow.print();
    //  document.body.removeChild(iframe);
    let printWindow: Window;
    let qrCodeElement = document.querySelector("qrcode");
    let canvasElement = qrCodeElement.querySelector("canvas");

    printWindow = window.open(null, "_blank", "width=600,height=450");
    let body = `<html><head><style>@media print{img{max-width:100%;height:auto;}}' +
    '</style></head><body><img src='${canvasElement.toDataURL()}'>  <h3>${
      this.sealNo
    }<h3></body></html>`;

    printWindow.document.write(body);
    printWindow.document.close();
    this.sleep(300).then(() => {
      if (printWindow) {
        printWindow.print();
        printWindow.close();
      }
    });
    //await this.sleep(500);
  }
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  addData() {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      size: "xl",
    };
    const modalRef = this.modalService.open(
      CrudModalComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.id = 0; // should be the id
    modalRef.componentInstance.data = [];
    modalRef.result
      .then((result) => {
        this.spinner.show(undefined, {
          type: "ball-triangle-path",
          size: "medium",
          bdColor: "rgba(0, 0, 0, 0.8)",
          color: "#fff",
          fullScreen: true,
        });
        this.sealService.addSeal(result).subscribe(
          (res: any) => {
            this.spinner.hide();
            swal.showDialog("success", "เพิ่มข้อมูลสำเร็จแล้ว");
            this.getSeal();
          },
          (error: any) => {
            this.spinner.hide();
            swal.showDialog("error", "เกิดข้อผิดพลาด : " + error);
          }
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
