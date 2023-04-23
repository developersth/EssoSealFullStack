import { Component, OnInit } from "@angular/core";
import { User } from "../user.model";
import { UserService } from "../user.service";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { UserEditComponent } from "../user-edit/user-edit.component";
import { NgxSpinnerService } from "ngx-spinner";
import * as swalFunctions from "./../../shared/services/sweetalert.service";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"],
})
export class UserListComponent implements OnInit {
  users: User[];
  user: User;
  swal = swalFunctions;

  constructor(
    private userService: UserService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().subscribe((user: any) => {
      this.users = user;
    });
  }
  deleteUser(id: string) {
    console.log(id);
    this.swal
      .ConfirmText("แจ้งเตือนการลบข้อมูล", "คุณต้องการลบข้อมูลหรือไม่?")
      .then((res) => {
        if (res) {
          this.userService.deleteUser(id).subscribe(
            (res: any) => {
              this.swal.showDialog("success", "ลบข้อมูลเรียบร้อยแล้วแล้ว");
              this.getUsers();
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
    const modalRef = this.modalService.open(UserEditComponent, ngbModalOptions);
    modalRef.componentInstance.id = ''; // should be the id
    modalRef.componentInstance.data = { username: '', password: '', name: '',email:'',role:{name:'user'},isActive:true }; // should be the data
    modalRef.result
      .then((result) => {
        this.spinner.show(undefined, {
          type: "ball-triangle-path",
          size: "medium",
          bdColor: "rgba(0, 0, 0, 0.8)",
          color: "#fff",
          fullScreen: true,
        });
        this.userService.createUser(result).subscribe(
          (res: any) => {
            this.spinner.hide();
            this.swal.showDialog("success", "เพิ่มข้อมูลสำเร็จแล้ว");
            this.getUsers();
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
    const modalRef = this.modalService.open(UserEditComponent, ngbModalOptions);
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
        this.userService.updateUser(item._id,result).subscribe(
          (res: any) => {
            this.spinner.hide();
            this.swal.showDialog("success", "แก้ไขข้อมูลสำเร็จแล้ว");
            this.getUsers();
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