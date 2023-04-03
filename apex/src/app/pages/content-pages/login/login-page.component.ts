import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from 'app/shared/auth/auth.service';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { th } from 'date-fns/locale';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss']
})

export class LoginPageComponent  implements OnInit {
[x: string]: any;
    @ViewChild('f') loginForm: NgForm;
    username!: string
    password!: string;
    submitted:boolean=false;
    isSuccess:boolean=true;
    form:FormGroup;
    errorMessage:string;
    public loading = false;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthService,
        ) { }

        ngOnInit() {
            this.form=new FormGroup({
                'username': new FormControl(null, [Validators.required]),
                'password': new FormControl(null, [Validators.required])
            });
        }
      
    // On submit button click
    onSubmit() {
        if (this.form.valid) {
            this.loading = true;
        this.authService.login(this.form.value.username, this.form.value.password).subscribe(
            (res: any) => {
                console.log("login success");
                this.router.navigate(["dashboard/dashboard1"]);
                this.loading=false;
              },
              (error: HttpErrorResponse) => {
                this.isSuccess=false;
                this.errorMessage=error.message;
                if(error.status===400){
                    this.errorMessage ="ชื่อผู้ใช้งานและรหัสผ่านไม่ถูกต้อง";
                }
                this.loading=false;
              }
        );
        this.form.reset();
        //this.loading=false;
        }

    }
    // On Forgot password link click
    onForgotPassword() {
        this.router.navigate(['forgotpassword'], { relativeTo: this.route.parent });
    }
    // On registration link click
    onRegister() {
        this.router.navigate(['register'], { relativeTo: this.route.parent });
    }
}
