import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sealout',
  templateUrl: './sealout.component.html',
  styleUrls: ['./sealout.component.scss']
})
export class SealoutComponent implements OnInit {

  constructor() { }
  keyword = 'name';
  data = [
    {
      id: 1,
      name: 'Georgia'
    },
     {
       id: 2,
       name: 'Usa'
     },
     {
       id: 3,
       name: 'England'
     }
  ];


  selectEvent(item) {
    // do something with selected item
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  
  onFocused(e){
    // do something when input is focused
  }

  ngOnInit(): void {
  }

}
