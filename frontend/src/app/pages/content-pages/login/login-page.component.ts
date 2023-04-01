import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from 'app/shared/auth/auth.service';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { th } from 'date-fns/locale';
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
            },{updateOn:'blur'});
        }
      
    // On submit button click
    onSubmit() {
        this.loading=true;
        if (this.form.valid) {
        this.authService.login(this.form.value.username, this.form.value.password).subscribe(
            (res: any) => {
                this.isSuccess=true;
                console.log("login success");
                this.router.navigate(["dashboard/dashboard1"]);
                this.loading=false;
              },
              (err: any) => {
                this.isSuccess=false;
                this.errorMessage = err.error.message;
                this.loading=false;
              }
        );
        console.log(this.authService.isAuthenticated())
        this.form.reset();
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
