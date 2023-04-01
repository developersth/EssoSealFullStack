import { Component, Input, OnInit } from '@angular/core';
declare var require: any;
const data: any = require('../../app/shared/data/company.json');

@Component({
  selector: 'app-table-test',
  templateUrl: './table-test.component.html',
  styleUrls: ['./table-test.component.css']
})
export class TableTestComponent implements OnInit {

  rows = [];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  value1:string;
  value2:string;
  

  // DataTable Content Titles
  columns = [
      { prop: 'name' },
      { name: 'Gender' },
      { name: 'Company' }
  ];

  constructor() {
      this.rows = data;
      setTimeout(() => { this.loadingIndicator = false; }, 1500);
  }

  getRowHeight(row) {
    return row.height;
  }

  ngOnInit(): void {
  }

}
