import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SealService } from 'app/seals/seal.service';
@Component({
  selector: 'app-recript',
  templateUrl: './recript.component.html',
  styleUrls: ['./recript.component.scss'],
  providers: [SealService],
})
export class RecriptComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal,
    private sealService: SealService,
    private router: Router,
  ) { }
  @Input() id: string;
  orderNo = '1234';
  dateTime = new Date().toLocaleString();
  @Input() data: any[] = [];
  @Input() sealItem: any[] = [];
  @Input() truckLicense: string;
  ngOnInit(): void {
    //this.data = [];
    //this.getData();
  }
  getData() {
    this.sealService.getSealOutById(this.id).subscribe((res: any) => {
      this.data = res;
    });
  }
  printSlip() {


    let printWindow: Window;
    let slip = document.getElementById('slip');

    printWindow = window.open(null, "_blank", "width=650,height=450")
    let body = slip.innerHTML
    body += `<style>
    * {
        font-size: 10px;
        font-family: 'Times New Roman';
      }

      td,
      th,
      tr,
      table {
        border-top: 1px solid black;
        border-collapse: collapse;
      }

      td.sealno,
      th.sealno {
        width: 70px;
        max-width: 70px;
      }

      td.item,
      th.item {
        width: 30px;
        max-width: 30px;
        word-break: break-all;
      }

      td.pack,
      th.pack {
        width: 50px;
        max-width: 50px;
        word-break: break-all;
        text-align: center;
        align-content: center;
      }

      .centered {
        text-align: center;
        align-content: center;
      }
      .slip-header {
        font-size: 12px;
        text-align: left;
        align-content: left;
      }

      .slip {
        width: 8rem;
        max-width: 8rem;
      }

      img {
        display: block;
        margin:5px;
        max-width: 100px;
        width: 100px;
      }
  </style>`

    printWindow.document.write(body)
    printWindow.document.close()
    this.sleep(300).then(() => {
      if (printWindow) {
        printWindow.print();
        printWindow.close();
        this.activeModal.close();
        this.router.navigate(['/seals/sealoutlist']);

      }
    })
  }
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
