import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AddEmployeeService } from '../master/addEmplyee.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  username: string = '';
  password: string = '';
  public userResponce: any;
  public userObject: any;
  public roles: Array<String> = [];
  private notifier: NotifierService;
  public firstName: any = '';
  public showAlert: boolean = false;
  public matchNotFoundInDB: boolean = false;
  public userName: any = '';
  public userNameSubmitted: boolean = false;
  public mailSentSuccessfully: boolean = false;
  constructor(private formBuilder: FormBuilder,
    private route: Router,
    notifier: NotifierService,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private authService: AuthenticationService, private addEmployeeService: AddEmployeeService
  ) {
    this.notifier = notifier;
  }
  ngOnInit(): void {
    //reactive form validations
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(1)]],
      password: ['', Validators.required],
    })
  }
  // convenience getter for easy access to form fields
  get form() {
    return this.loginForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    /** spinner starts on init */
    this.spinner.show();
    this.username = this.loginForm.value.username;
    this.password = this.loginForm.value.password;
    //user object   
    this.userObject = {
      "userName": this.username,
      "password": this.password
    }
    localStorage.setItem('token', " ");
    this.authService.authenticationLogin(this.userObject)
      .subscribe((res) => {
        this.userResponce = res;
        localStorage.setItem('token', this.userResponce.token);
        localStorage.setItem("type", "");
        localStorage.setItem("userName", this.userResponce.userName);
        sessionStorage.setItem("firstName", this.userResponce.firstName);
        sessionStorage.setItem("empId", this.userResponce.id);
        sessionStorage.setItem("designation", this.userResponce.contactName);
        sessionStorage.setItem("externalReportingHeadMail", this.userResponce.contactNumber);
        this.roles = this.userResponce.roles;
        sessionStorage.setItem("role", "" + this.roles[0]);
       // this.fetchEmployeeDetails();
        console.log("role", this.roles[0]);
        // this.route.navigateByUrl('HRMS');
        // console.log('aaaaaaa');
        this.spinner.hide();
        //  sessionStorage.setItem('token',this.userResponce.token)
        if (sessionStorage.getItem("role") == "ROLE_SUPER_ADMIN") {
          this.route.navigateByUrl('select-company');

        } else if (sessionStorage.getItem("role") == "ROLE_CANDIDATE") {
          sessionStorage.setItem("companyId", this.userResponce.company.companyId);
          sessionStorage.setItem("companyName", this.userResponce.company.companyName);
          //this.route.navigateByUrl('/HRMS/Company/edit-company');
          this.route.navigateByUrl('HRMS/Employee-Onboarding/onboarding-employee');
        } else {
          sessionStorage.setItem("companyId", this.userResponce.company.companyId);
          sessionStorage.setItem("companyName", this.userResponce.company.companyName);
          //this.route.navigateByUrl('/HRMS/Company/edit-company');
          sessionStorage.setItem('Edit-employeeId', this.userResponce.id.toString());
          sessionStorage.setItem('Edit-employee-role', "" + this.roles[0]);
          this.route.navigateByUrl('HRMS/Master/view-employee/' + this.userResponce.id.toString());
        }
        //   //  this.route.navigateByUrl('sidenavbar');
        // setTimeout(() => {
        //   this.route.navigateByUrl('HRMS/dashboard');
        //   this.spinner.hide();
        //   this.notifier.notify('success', "Welcome User:- "+ this.userResponce.userName+"");
        // }, 500);
      },
        (error) => {
          error instanceof HttpErrorResponse
          console.log(error)
          // this.route.navigateByUrl('dashboard');
          //this.route.navigateByUrl('select-company');
          setTimeout(() => {
            this.spinner.hide();
            this.notifier.notify('error', error.error.message);
            // this.spinner.hide();
            // this.notifier.notify('success', "Welcome User:- "+ this.username+"");
          }, 500);
        }
      )
  }
  // fetchEmployeeDetails() {
  //   this.addEmployeeService.getEmployeeById(this.userResponce.id)
  //     .subscribe((data: any) => {
  //       this.firstName = data.data.firstName;
  //       sessionStorage.setItem("firstName", this.firstName);
  //     })
  // }

  handleForgotPassword() {
    this.showAlert = false;
    this.matchNotFoundInDB = false;
    this.userName = '';
    (<any>$('#alert_modal')).modal('show');
  }
  handleRegisterPage(){
    this.route.navigateByUrl('registerOrg');
  }

  submitUserName() {
    this.userNameSubmitted = true;
    if (this.userName) {
      this.spinner.show();
      let api = 'user/validate?userName=' + this.userName;
      this.authService.validateUser(api).subscribe((data: any) => {
        this.spinner.hide();
        this.matchNotFoundInDB = data.data;
        if (!this.matchNotFoundInDB) {
          this.sendMailToUser();
        }
      },
        (error) => {
          this.spinner.hide();
          console.log(error);
        })
    }
  }

  changeUserName() {
    this.matchNotFoundInDB = false;
  }
 

  sendMailToUser() {
    if (this.userName) {
      this.spinner.show();
      let api = 'user/sendEmail?userName=' + this.userName;
      this.authService.validateUser(api).subscribe((data: any) => {
        this.spinner.hide();
        this.mailSentSuccessfully = data.data;
        if (this.mailSentSuccessfully) {
          this.notifier.notify('success', 'Mail Sent Successfully!');
          this.showAlert = true;
        } else {
          this.notifier.notify('error', 'Mail Id not Found with this user, Please contact to Admin!');
        }
      },
        (error) => {
          this.spinner.hide();
          console.log(error);
        })
    }
  }
}
