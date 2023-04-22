import { Component, Input, NgZone, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "../user.model";
import { UserService } from "../user.service";
import {
  FormBuilder,
  FormGroup,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { th } from "date-fns/locale";
@Component({
  selector: "app-user-edit",
  templateUrl: "./user-edit.component.html",
  styleUrls: ["./user-edit.component.scss"],
})
export class UserEditComponent implements OnInit {
  userForm: FormGroup;
  id: string = "";
  user: User[];
  @Input() data: any = {};
  constructor(
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private userService: UserService
  ) {
    this.userForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: [""],
      name: [""],
      email: [""],
      role: [""],
      isActive: [true],
    });
  }
  ngOnInit(): void {
    this.buildItemForm(this.data);
  }
  private buildItemForm(item) {
    this.userForm = this.formBuilder.group({
      username: [item.username || "", Validators.required],
      password: [""],
      name: [item.name || ""],
      email: [item.email || ""],
      role: [item.role.name||""],
      isActive: [item.isActive],
    });
  }
  getUserAll() {
    const id = +this.route.snapshot.paramMap.get("id");
    this.userService.getUser(id).subscribe((user: any) => {
      this.userForm = user;
    });
  }
  onSubmit() {
    this.activeModal.close(this.userForm.value);
  }
}
