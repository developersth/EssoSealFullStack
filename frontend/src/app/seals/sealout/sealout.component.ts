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
    console.log(item)
    // do something with selected item
  }

  onChangeSearch(val: string) {
    console.log(val)
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e) {
    console.log('focused',e.value)
    // do something when input is focused
  }

  ngOnInit(): void {
    this.getSealNo();
  }
}
