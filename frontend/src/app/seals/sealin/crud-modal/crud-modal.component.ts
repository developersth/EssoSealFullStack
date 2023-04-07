import { Component, Output, EventEmitter, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { SealService } from "app/seals/seal.service";
import { delay } from 'rxjs/operators';
@Component({
  selector: "app-crud-modal",
  templateUrl: "./crud-modal.component.html",
  styleUrls: ["./crud-modal.component.scss"],
  providers: [SealService],
})
export class CrudModalComponent implements OnInit {
  type = "Marketing";
  @Input() id: number;
  @Input() sealTotal: string;
  @Input() sealStartNo: string;
  @Input() data: any[]=[];
  //@Input() data:Seal[]=[];
Object: any;
  constructor(
    public activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private sealService: SealService
  ) {}

  ngOnInit() {
    this.data=[]
  }

  calculateSeal() {
    if (!this.data) return;
    console.log(this.data);
    this.spinner.show(undefined, {
      type: "ball-triangle-path",
      size: "medium",
      bdColor: "rgba(0, 0, 0, 0.8)",
      color: "#fff",
      fullScreen: true,
    });
    this.sealService.calculateSeal(parseInt(this.sealTotal),parseFloat(this.sealStartNo)).pipe(delay(500)).subscribe(
      (res: any) => {
        this.data = res;
        this.spinner.hide();
      },
      (error:any) => {
        console.log(error.message)
        this.spinner.hide();
      }
    );
  }
  removeData(item) {
    var index = this.data.indexOf(item);
    this.data.splice(index, 1);
  }
  submitForm() {
    this.activeModal.close(this.data);
  }
}
