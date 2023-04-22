import { Component, Input, NgZone, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Truck } from "../truck.model";
import { TruckService } from "../truck.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { th } from "date-fns/locale";
@Component({
  selector: "app-truck-modal",
  templateUrl: "./truck-modal.component.html",
  styleUrls: ["./truck-modal.component.scss"],
  providers: [TruckService],
})
export class TruckModalComponent implements OnInit {
  truckForm: FormGroup;
  id: string = "";
  truck: Truck[];
  @Input() data: any = {};
  constructor(
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private truckService: TruckService
  ) {
    this.truckForm = this.formBuilder.group({
      truckIdHead: ["", Validators.required],
      truckIdTail: [""]
    });
  }
  ngOnInit(): void {
    this.buildItemForm(this.data);
  }
  private buildItemForm(item) {
    this.truckForm = this.formBuilder.group({
      truckIdHead: [item.truckIdHead || "", Validators.required],
      truckIdTail: [item.truckIdTail||""]
    });
  }

  onSubmit() {
    this.activeModal.close(this.truckForm.value);
  }
}
