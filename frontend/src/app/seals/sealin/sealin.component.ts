import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { CrudModalComponent } from './crud-modal/crud-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-sealin',
  templateUrl: './sealin.component.html',
  styleUrls: ['./sealin.component.scss']
})
export class SealinComponent implements OnInit {

  constructor(
    private modalService: NgbModal
  ) { }


  ngOnInit(): void {
  }

  addTask() {
    const modalRef = this.modalService.open(CrudModalComponent);
    modalRef.componentInstance.id = 0; // should be the id
    modalRef.componentInstance.data = { title: '', message: '', type: 'Marketing' }; // should be the data

  }
}
