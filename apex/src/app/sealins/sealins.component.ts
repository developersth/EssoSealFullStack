import { Component, Input, OnInit } from "@angular/core";
import { format, endOfDay, startOfDay } from "date-fns";
declare var require: any;
const data: any = require("../../app/shared/data/company.json");
@Component({
  selector: "app-sealins",
  templateUrl: "./sealins.component.html",
  styleUrls: ["./sealins.component.css"],
})
export class SealinsComponent implements OnInit {
  rows = [];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  value1: string;
  value2: string;
  dtStart: Date;
  dtStop: Date;

  // DataTable Content Titles
  columns = [{ prop: "name" }, { name: "Gender" }, { name: "Company" }];

  constructor() {
    this.rows = data;
    setTimeout(() => {
      this.loadingIndicator = false;
    }, 1500);
  }

  getRowHeight(row) {
    return row.height;
  }

  ngOnInit(): void {
    this.dtStart=new Date();
    this.dtStop = new Date();
  }
}
