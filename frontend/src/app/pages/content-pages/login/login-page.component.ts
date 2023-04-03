import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { NgForm, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from 'app/shared/auth/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import swal from 'sweetalert2';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})

export class LoginPageComponent {
  errorMessage: string;
  loginFormSubmitted = false;

  loginForm = new UntypedFormGroup({
    username: new UntypedFormControl('', [Validators.required]),
    password: new UntypedFormControl('', [Validators.required]),
    rememberMe: new UntypedFormControl(true)
  });


  constructor(
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute
  ) { }


  get lf() {
    return this.loginForm.controls;
  }
  showDialog(type:any,message:any){
    swal.fire({
      position: 'top-end',
      icon: type,
      title: message,
      showConfirmButton: false,
      timer: 2000,
      customClass: {
        confirmButton: 'btn btn-primary'
      },
      buttonsStyling: false,
    });
  }
  // On submit button click
  onSubmit() {
    this.loginFormSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.spinner.show(undefined,
      {
        type: 'ball-triangle-path',
        size: 'medium',
        bdColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        fullScreen: true
      });

    this.authService.signinUser(this.loginForm.value.username, this.loginForm.value.password).subscribe(
      (res: any) => {
        console.log("login success");
        this.spinner.hide();
        this.showDialog("success","เข้าสู่ระบบสำเร็จแล้ว");
        this.router.navigate(['/dashboard']);
      },
      (error: HttpErrorResponse) => {
        this.spinner.hide();
        console.log('error: ' + error)
        if (error.status === 400) {
          this.showDialog("warning","ชื่อผู้ใช้งานและรหัสผ่านไม่ถูกต้อง");
        } else {
          this.showDialog("warning",error.message);
        }
      }
    );
  }
}
