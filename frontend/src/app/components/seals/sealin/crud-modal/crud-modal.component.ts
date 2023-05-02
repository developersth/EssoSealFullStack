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
  @Input() data: any[] = [];
  //@Input() data:Seal[]=[];
  private sealPack: number[] = [3, 4, 5];
  private seals: any[] = [];
  cbSealPack: string = "1";
  Object: any;
  sealNoItem: any[] = [];
  constructor(
    public activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private toast: ToastrService,
  ) { }

  ngOnInit() {
    this.data = []
  }

  serviceCalSeal(sealTotal: number, sealStartNo: number): Observable<any> {
    //reset values
    this.seals = [];
    let total: number = sealTotal;
    let currentEnd: number = sealStartNo + total;
    let currentNumber: number = sealStartNo;
    let currentSize: number = 0;
    let sealNo: string;
    let sealBetween: string;

    for (let i = 0; i < total; i++) {
      this.sealNoItem = [];
      //pack 3
      if (this.cbSealPack === '2') {
        currentSize = 3;
        sealBetween = `${currentNumber}-${currentNumber + currentSize - 1}`;

        if (currentNumber + currentSize <= currentEnd) {
          for (let index = 0; index < currentSize; index++) {
            this.sealNoItem.push({
              sealNo: (currentNumber + index).toString(),
            });
          }
          this.seals.push({ sealBetween: sealBetween, sealNoItem: this.sealNoItem, pack: currentSize, isUsed: false });
        }
        else if (currentEnd - currentNumber === 2) {
          for (let index = 0; index < 2; index++) {
            this.sealNoItem.push({
              sealNo: (currentNumber + index).toString(),
            });
          }
          this.seals.push({
            sealBetween: currentNumber.toString(),
            sealNoItem: this.sealNoItem,
            pack: 1,
            isUsed: false,
          });
          this.seals.push({
            sealBetween: (currentNumber + 1).toString(),
            sealNoItem: this.sealNoItem,
            pack: 1,
            isUsed: false,
          });
        }
        else if (currentEnd - currentNumber === 1) {
          this.sealNoItem.push({ sealNo: (currentNumber).toString() });
          this.seals.push({
            sealBetween: currentNumber.toString(),
            sealNoItem: this.sealNoItem,
            pack: 1,
            isUsed: false,
          });
        }
      }
      //pack 3 4 5
      else {
        currentSize = this.sealPack[i % this.sealPack.length];
        sealBetween = `${currentNumber}-${currentNumber + currentSize - 1}`;

        if (currentNumber + currentSize <= currentEnd) {
          for (let index = 0; index < currentSize; index++) {
            this.sealNoItem.push({
              sealNo: (currentNumber + index).toString(),
            });
          }
          this.seals.push({ sealBetween: sealBetween, sealNoItem: this.sealNoItem, pack: currentSize, isUsed: false });
        } else if (currentEnd - currentNumber === 1) {
          this.sealNoItem.push({ sealNo: (currentNumber).toString() });
          this.seals.push({ sealBetween: sealBetween, sealNoItem: this.sealNoItem, pack: 1, isUsed: false });
        } else if (currentEnd - currentNumber === 2) {
          for (let index = 0; index < 2; index++) {
            this.sealNoItem.push({
              sealNo: (currentNumber + index).toString(),
            });
          }
          this.seals.push({
            sealBetween: currentNumber.toString(),
            sealNoItem: this.sealNoItem,
            pack: 1,
            isUsed: false,
          });
          this.seals.push({
            sealBetween: (currentNumber + 1).toString(),
            sealNoItem: this.sealNoItem,
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

      }
      currentNumber += currentSize;
    }
    //delay(200);
    return of(this.seals);
  }

  calculateSeal() {
    if (parseInt(this.sealTotal) > 1000) {
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
    this.serviceCalSeal(parseInt(this.sealTotal), parseFloat(this.sealStartNo)).pipe(delay(200)).subscribe(
      (res: any) => {
        this.data = res;
        this.spinner.hide();
      },
      (error: any) => {
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
