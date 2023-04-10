import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { DatePipe } from '@angular/common';
import { CrudModalComponent } from "./crud-modal/crud-modal.component";
import { NgbDateStruct, NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { SealService } from "../seal.service";
import { NgxSpinnerService } from "ngx-spinner";
import * as swalFunctions from './../../shared/services/sweetalert.service';
import { th } from "date-fns/locale";

const now = new Date();
let swal=swalFunctions;
@Component({
  selector: "app-sealin",
  templateUrl: "./sealin.component.html",
  styleUrls:  ['./sealin.component.scss','../../../assets/sass/libs/datepicker.scss'],
  providers: [SealService],

})
export class SealinComponent implements OnInit {
  constructor(private modalService: NgbModal,private sealService:SealService,private spinner: NgxSpinnerService) {}
  ngOnInit(): void {
    this.selectToday();
    this.getSeal();
  }

  displayMonths = 2;
  dtStart: NgbDateStruct;
  dtEnd: NgbDateStruct;
  page = 1;
  pageSize = 10;
  pageSizes = [10, 20, 50];
  currentPage = 1;
  searchTerm: string;
 
  Seal:any[] = [];
  filteredItems:any[]=[]
  pageChanged(event: any): void {
    this.page = event.page;
  }
  filterItems() {
    this.page = 1; // รีเซ็ตหน้าเป็นหน้าที่ 1 เมื่อทำการกรองข้อมูล
    if (this.searchTerm === '') {
      // กรณีไม่มีคำค้นหา ให้แสดงข้อมูลทั้งหมด
      this.filteredItems = this.Seal;
    } else {
      // กรณีมีคำค้นหา ให้กรองข้อมูลตามคำค้นหา
      this.filteredItems =  this.Seal.filter(item =>
        item.id.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.sealNo.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.pack.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
  isDisabled(date: NgbDateStruct, current: {month: number}) {
    return date.month !== current.month;
  }
  
  // Selects today's date
  selectToday() {
    this.dtStart = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
    this.dtEnd = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()+1};
  }

  // Custom Day View Starts
  isWeekend(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.getDay() === 0 || d.getDay() === 6;
  }
  format(date: NgbDateStruct): string
  {
    return date?date.year+"-"+('0'+date.month).slice(-2)+"-"+('0'+date.day).slice(-2):null
  }
  
  getSeal(){

    let startDate:string = this.format(this.dtStart);
    let endDate:string = this.format(this.dtEnd);
    this.sealService.getSeal(startDate,endDate).subscribe(
      (res:any)=>{
        this.Seal=res;
        console.log(this.Seal);
      }
    );
  }
  addTask() {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      size:"xl"
    };
    const modalRef = this.modalService.open(CrudModalComponent, ngbModalOptions);
    modalRef.componentInstance.id = 0; // should be the id
    modalRef.componentInstance.data=[];
    modalRef.result.then((result) => {
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
          swal.showDialog("success","เพิ่มข้อมูลสำเร็จแล้ว");
          this.getSeal();
        },
        (error: any) => {
          swal.showDialog("error","เกิดข้อผิดพลาด:"+error);
        }
      );

    }).catch((error) => {
      console.log(error);
    });

    // modalRef.componentInstance.data = {
    //   title: "",
    //   message: "",
    //   type: "Marketing",
    // }; // should be the data
  }
}
