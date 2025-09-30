import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-onboarding-employee-mail',
  templateUrl: './onboarding-employee-mail.component.html',
  styleUrls: ['./onboarding-employee-mail.component.css']
})
export class OnboardingEmployeeMailComponent implements OnInit {
  public candidetName: any;
  public joiningDate: any;
  public joiningDateArry: any;
  public emailId: any;
  public companyName: any;
  public candidetId: any;
  public mail:boolean=false;
  public errormessagetoggel: boolean=false;
  public errormessage: any='';
  constructor(private crudOperationsService:CrudOperationsService) { }

  ngOnInit(): void {

    this.candidetName = sessionStorage.getItem("candidetName");
    this.joiningDateArry = (""+sessionStorage.getItem("joiningDate")).split("T");
    this.joiningDate = this.joiningDateArry[0];
    this.emailId = sessionStorage.getItem("emailId");
    this.companyName = sessionStorage.getItem("companyName");
    this.candidetId = sessionStorage.getItem("candidetId");
  }

  updateAndSendMail(){
   
    var updateData ={"id":this.candidetId,
                      "bgType":"Internal"};

    this.crudOperationsService.update(updateData,"referralrecruitment/bgvupdate").subscribe((data:any)=>{
         this.mail=true;  
    },
      (error) => {
        this.errormessagetoggel=true;
        this.errormessage=error.error.message;
         //show hide
      
      })
   
  

  }

}
