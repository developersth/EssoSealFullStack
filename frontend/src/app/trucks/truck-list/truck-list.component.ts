import { Component, OnInit } from "@angular/core";
import { Truck } from "../truck.model";
import { TruckService } from "../truck.service";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { TruckModalComponent } from "../truck-modal/truck-modal.component";
import * as swalFunctions from "../../shared/services/sweetalert.service";

@Component({
  selector: "app-truck-list",
  templateUrl: "./truck-list.component.html",
  styleUrls: ["./truck-list.component.scss"],
  providers: [TruckService],
})
export class TruckListComponent implements OnInit {
  truck: Truck[];
  swal = swalFunctions;

  constructor(
    private truckService: TruckService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getTrucks();
  }

  getTrucks() {
    this.truckService.getTrucks().subscribe((data: any) => {
      this.truck = data;
    });
  }
  deleteTruck(id: string) {
    console.log(id);
    this.swal
      .ConfirmText("แจ้งเตือนการลบข้อมูล", "คุณต้องการลบข้อมูลหรือไม่?")
      .then((res) => {
        if (res) {
          this.truckService.deleteTruck(id).subscribe(
            (res: any) => {
              this.swal.showDialog("success", "ลบข้อมูลเรียบร้อยแล้วแล้ว");
              this.getTrucks();
            },
            (error: any) => {
              this.swal.showDialog("error", "เกิดข้อผิดพลาด:" + error);
            }
          );
        }
      });
  }
  addData() {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      size: "md",
    };
    const modalRef = this.modalService.open(TruckModalComponent, ngbModalOptions);
    modalRef.componentInstance.id = ''; // should be the id
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
        this.truckService.addTruck(result).subscribe(
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
  editData(item: any) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      size: "md",
    };
    const modalRef = this.modalService.open(TruckModalComponent, ngbModalOptions);
    modalRef.componentInstance.id = item._id; // should be the id
    modalRef.componentInstance.data = item;
    modalRef.result
      .then((result) => {
        this.spinner.show(undefined, {
          type: "ball-triangle-path",
          size: "medium",
          bdColor: "rgba(0, 0, 0, 0.8)",
          color: "#fff",
          fullScreen: true,
        });
        this.truckService.updateTruck(item._id,result).subscribe(
          (res: any) => {
            this.spinner.hide();
            this.swal.showDialog("success", "แก้ไขข้อมูลสำเร็จแล้ว");
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
}
