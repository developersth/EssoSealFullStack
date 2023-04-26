import { Component, Output, EventEmitter, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { delay } from 'rxjs/operators';
import { ToastrService } from "ngx-toastr";
import { Observable, of } from "rxjs";
@Component({
  selector: "app-crud-modal",
  templateUrl: "./crud-modal.component.html",
  styleUrls: ["./crud-modal.component.scss"]
})
export class CrudModalComponent implements OnInit {
  type = "Marketing";
  @Input() id: number;
  @Input() sealTotal: string;
  @Input() sealStartNo: string;
  @Input() data: any[]=[];
  //@Input() data:Seal[]=[];
  private sealPack: number[] = [3, 4, 5];
  private seals: any[] = [];
Object: any;
  constructor(
    public activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private toast: ToastrService,
  ) {}

  ngOnInit() {
    this.data=[]
  }

  serviceCalSeal(sealTotal: number, sealStartNo: number): Observable<any> {
    //reset values
    this.seals = [];
    let total: number = sealTotal;
    let currentEnd: number = sealStartNo + total;
    let currentNumber: number = sealStartNo;
    for (let i = 0; i < total; i++) {
      let currentSize: number = this.sealPack[i % this.sealPack.length];
      console.log(currentSize);
      let sealNo: string = `${currentNumber}-${
        currentNumber + currentSize - 1
      }`;

      if (currentNumber + currentSize <= currentEnd) {
        this.seals.push({ sealNo: sealNo, pack: currentSize, isUsed: false });
      } else if (currentEnd - currentNumber === 1) {
        this.seals.push({
          sealNo: currentNumber.toString(),
          pack: 1,
          isUsed: false,
        });
      } else if (currentEnd - currentNumber === 2) {
        this.seals.push({
          sealNo: currentNumber.toString(),
          pack: 1,
          isUsed: false,
        });
        this.seals.push({
          sealNo: (currentNumber + 1).toString(),
          pack: 1,
          isUsed: false,
        });
      } else if (currentNumber + currentSize > currentEnd) {
        this.sealPack.forEach((pack: number) => {
          if (currentNumber + pack <= currentEnd) {
            sealNo = `${currentNumber}-${currentNumber + pack - 1}`;
            this.seals.push({
              sealNo: sealNo,
              pack: pack,
              isUsed: false,
            });
          }
        });
      }
      currentNumber += currentSize;
    }
    //delay(200);
    return of(this.seals);
  }

  calculateSeal() {
    if(parseInt(this.sealTotal)>1000){
      this.toast.warning("สามารถระบุจำนวนซีลได้ไม่เกิน 1000")
      return;
    }
    if (!this.data) return;
    this.spinner.show(undefined, {
      type: "ball-triangle-path",
      size: "medium",
      bdColor: "rgba(0, 0, 0, 0.8)",
      color: "#fff",
      fullScreen: true,
    });
    this.serviceCalSeal(parseInt(this.sealTotal),parseFloat(this.sealStartNo)).pipe(delay(200)).subscribe(
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
