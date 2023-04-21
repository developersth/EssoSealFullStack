import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";

import {
  NgbDateStruct,
  NgbModal,
  NgbModalOptions,
  ModalDismissReasons,
} from "@ng-bootstrap/ng-bootstrap";
import { SealService } from "../seal.service";
import { NgxSpinnerService } from "ngx-spinner";
import * as swalFunctions from "../../shared/services/sweetalert.service";
import { th } from "date-fns/locale";
import { Seal } from "../seal.model";
import { forEach } from "core-js/core/array";
import { RecriptComponent } from "./recript/recript.component";

const now = new Date();
let swal = swalFunctions;
@Component({
  selector: "app-sealin",
  templateUrl: "./sealoutlist.component.html",
  styleUrls: [
    "./sealoutlist.component.scss",
    "../../../assets/sass/libs/datepicker.scss",
  ],
  providers: [SealService],
})
export class SealOutListComponent implements OnInit {
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
    this.filterItems();
    this.window = window;
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
  Seal: Seal[] = [];
  filteredItems: any[] = [];
  pageChanged(event: any): void {
    this.page = event.page;
  }
  filterItems() {
    this.page = 1; // รีเซ็ตหน้าเป็นหน้าที่ 1 เมื่อทำการกรองข้อมูล
    if (this.searchTerm === "") {
      // กรณีไม่มีคำค้นหา ให้แสดงข้อมูลทั้งหมด
      this.filteredItems = this.Seal;
    } else {
      // กรณีมีคำค้นหา ให้กรองข้อมูลตามคำค้นหา
      this.filteredItems = this.Seal.filter(
        (item) =>
          item._id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          item.sealNo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          item.pack
            .toString()
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
      );
    }
  }
  checkAllItems() {
    for (let item of this.Seal) {
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
    let startDate = new Date(this.dtStart.year, this.dtStart.month - 1, this.dtStart.day);
    let endDate = new Date(this.dtEnd.year, this.dtEnd.month - 1, this.dtEnd.day);
    this.sealService.getSealOutAll(startDate, endDate).subscribe((res: any) => {
      this.Seal = res;
    });
  }

  deleteData(id: string) {
    console.log(id);
    swal
      .ConfirmText("แจ้งเตือนการลบข้อมูล", "คุณต้องการลบข้อมูลหรือไม่?")
      .then((res) => {
        if (res) {
          this.sealService.deleteSealOut(id).subscribe(
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
  printSlip(item:any) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      size: "md",
    };
    const modalRef = this.modalService.open(
      RecriptComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.id = item._id;
    modalRef.componentInstance.data = item;
  }
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

}
