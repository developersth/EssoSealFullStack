import { Component, Output, EventEmitter, Input, OnInit } from "@angular/core";
import { forEach } from "core-js/core/array";
import { SealService } from "../seal.service";

@Component({
  selector: "app-sealout",
  templateUrl: "./sealout.component.html",
  styleUrls: ["./sealout.component.scss"],
  providers: [SealService],
})
export class SealoutComponent implements OnInit {
  constructor(
    private sealService: SealService
  ) {}
  keyword = "name";
  @Input() txtSealTotal: string;
  @Input() txtSealExtraTotal: string;
  @Input() sealNoExt: any[] = [];
  itemSealNo:any[] = [];
  data =[
    {
        "id": {
            "timestamp": 1681313540,
            "machine": 9521317,
            "pid": 11138,
            "increment": 6594369,
            "creationTime": "2023-04-12T15:32:20Z"
        },
        "_id": "6436cf049148a52b82649f41",
        "name": "88001-88003",
        "pack": 3,
        "isUsed": true,
        "createAt": "2023-04-12T15:32:20.78Z",
        "createAtStr": "12/04/2023 15:32:20",
        "lastUpdateAt": "2023-04-12T15:32:20.78Z"
    },
    {
        "id": {
            "timestamp": 1681313540,
            "machine": 9521317,
            "pid": 11138,
            "increment": 6594370,
            "creationTime": "2023-04-12T15:32:20Z"
        },
        "_id": "6436cf049148a52b82649f42",
        "name": "88004-88007",
        "pack": 4,
        "isUsed": false,
        "createAt": "2023-04-12T15:32:20.78Z",
        "createAtStr": "12/04/2023 15:32:20",
        "lastUpdateAt": "2023-04-12T15:32:20.78Z"
    }
]
  getSealNo(){
    this.sealService.getSealToTxtQRCode().subscribe(
      (res: any) => {
        this.itemSealNo=res;
        console.log(res);
      }
    );
  }
  genSealExtra(txt:number) {
    this.sealNoExt = [];
    console.log(txt)
    if (this.txtSealExtraTotal) {
      let vCount: number = parseInt(this.txtSealExtraTotal);
      for (let index = 0; index < vCount; index++) {
        this.sealNoExt.push({ txtSealNo: '' });
      }
    }
  }
  delSealExtra(index) {
    if (this.sealNoExt.length > 1) {
      this.sealNoExt.splice(index, 1);
    }
  }
  selectEvent(item) {
    // do something with selected item
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e) {
    // do something when input is focused
  }

  ngOnInit(): void {
    this.getSealNo();
  }
}
