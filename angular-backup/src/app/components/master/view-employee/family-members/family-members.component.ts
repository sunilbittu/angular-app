import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { AddEmployeeService } from '../../addEmplyee.service';
declare var $: any;

@Component({
  selector: 'app-family-members',
  templateUrl: './family-members.component.html',
  styleUrls: ['./family-members.component.css']
})
export class FamilyMembersComponent implements OnInit {

  public headers: any = ['Name', 'Aadhaar No.', 'Relation', 'D.O.B', 'Age', 'Address', 'Phone No.', 'Email', 'Gratuity Nominee', 'PF Nominee', 'ESI Nominee' ,'Pension Nominee' , 'Medical Insurance', 'Medical Insurance Nominee', 'Action']
  public listOfEmployeeResults1:any[]=[];
  public successCount: any;
  public showErrorMsg: boolean=false;
  public errorCount: any;
  public editEmployeeId:any=sessionStorage.getItem("Edit-employeeId");
  public showSuccessMsg: boolean=false;

  public employeeFamilyDetailsForm!: FormGroup;
  public employeeFamilyDetailsObject!: any;
  public employeeFamilyDetailsList!: any[];
  public employeeId!: number;
  public familyDetailsById!: any;
  public familyId!: any;
  public submitted: boolean=false;
  public requiredErrorText = 'can\'t be blank';

  public editButtonEnable!: any;

  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';


  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe,
    private employeeService: AddEmployeeService, private notificationService: NotifierService,
    private spinner: NgxSpinnerService,public crudOperationsService:CrudOperationsService) { }





  ngOnInit(): void {

    this.employeeFamilyDetailsForm = this.formBuilder.group({

      employeeName: ['',Validators.required],
      aadhaarNo: [''],
      relation: ['',Validators.required],
      dateOfBirth: [''],
      age: [''],
      address: [''],
      phoneNo: [''],
      email: [''],
      gratitutyNominee: [false],
      pfNominee: [false],
      pensionNominee: [false],
      esicNominee: [false],
      medicalNominee: [false],
      medicalInsuNominee: [false]

    })


    //get-List
    this.getEmployeeFamilyDetailsList();

  }

  get form_() { return this.employeeFamilyDetailsForm.controls; };




  //get employeeFamily details List
  public getEmployeeFamilyDetailsList() {
    this.employeeId = Number(sessionStorage.getItem('Edit-employeeId'));
    return this.employeeService.getEmployeeFamilyListDetails(this.employeeId)
      .subscribe((data: any) => {
        this.employeeFamilyDetailsList = data.data;
      },
        (error) => {
          console.log(error);
        })
  }


  editEmployeeFamilyDetails(id: number) {

    //spinner show
    this.spinner.show();

    this.familyId = id;

    this.employeeService.getEmployeeFamilyDetailsById(id)
      .subscribe((data: any) => {

        this.familyDetailsById = data.data;

        //enable update button 
        this.editButtonEnable = true;

        let dateOfBirth = new Date(this.familyDetailsById.dob);


        //set form controls
        this.employeeFamilyDetailsForm.patchValue({

          employeeName: this.familyDetailsById.name,
          aadhaarNo: this.familyDetailsById.adhaarNo,
          relation: this.familyDetailsById.relationship,
          dateOfBirth: dateOfBirth,
          age: this.familyDetailsById.age,
          address: this.familyDetailsById.address,
          phoneNo: this.familyDetailsById.phoneNo,
          email: this.familyDetailsById.email,
          gratitutyNominee: this.familyDetailsById.gratuityNominee,
          pfNominee: this.familyDetailsById.pfNominee,
          pensionNominee: this.familyDetailsById.pensionNominee,
          esicNominee: this.familyDetailsById.esicNominee,
          medicalNominee: this.familyDetailsById.medicalInsurance,
          medicalInsuNominee: this.familyDetailsById.medicalInsuNominee

        })

        //spinner hide
        this.spinner.hide();
        
      },
        (error) => {
          console.log(error);
          //show hide
          this.spinner.hide();
        })

  }

  updateEmployeeFamilyDetails() {
    this.submitted=true;
  
    if(this.employeeFamilyDetailsForm.valid == true ){

    //spinner show
    this.spinner.show();

    let dateOfBirth = new Date(this.employeeFamilyDetailsForm.value.dateOfBirth);


    this.employeeFamilyDetailsObject =

    {

      "familyDetailsId": this.familyId,
      "address": this.employeeFamilyDetailsForm.value.address,
      "adhaarNo": this.employeeFamilyDetailsForm.value.aadhaarNo,
      "age": this.employeeFamilyDetailsForm.value.age,
      "dob": dateOfBirth,
      "email": this.employeeFamilyDetailsForm.value.email,
      "esicNominee": this.employeeFamilyDetailsForm.value.esicNominee,
      "gratuityNominee": this.employeeFamilyDetailsForm.value.gratitutyNominee,
      "medicalInsuNominee": this.employeeFamilyDetailsForm.value.medicalInsuNominee,
      "medicalInsurance": this.employeeFamilyDetailsForm.value.medicalNominee,
      "name": this.employeeFamilyDetailsForm.value.employeeName,
      "pensionNominee": this.employeeFamilyDetailsForm.value.pensionNominee,
      "pfNominee": this.employeeFamilyDetailsForm.value.pfNominee,
      "phoneNo": this.employeeFamilyDetailsForm.value.phoneNo,
      "relationship": this.employeeFamilyDetailsForm.value.relation,
      "createdBy": this.familyDetailsById.createdBy,
      "createdDate": this.familyDetailsById.createdDate,
      "isDeleted": this.familyDetailsById.isDeleted,
      "employee": {
        "employeeId": this.employeeId
      }

    }


    this.employeeService.updateEmployeeFamilyDetails(this.familyId, this.employeeFamilyDetailsObject)

    this.employeeService.postEmployeeFamilyDetails(this.employeeFamilyDetailsObject)
      .subscribe((data: any) => {
        this.notificationService.notify('success', data.message);
        this.employeeFamilyDetailsForm.reset();
        $('#employeeFamilyModelPopup').modal('hide');
        this.submitted=false;

        //get-List
        this.getEmployeeFamilyDetailsList();

        //spinner hide
        this.spinner.hide();
      },
        (error) => {
          console.log(error);
          //spinner hide
          this.spinner.hide();
        })
      }
  }

  //delete EmployeeFamilyDetails
  deleteEmployeFamilyById(id: number) {
    //spinner show
    this.spinner.show();

    this.employeeService.deleteEmployeeFamilyDetailsById(id)
      .subscribe((data: any) => {
        this.notificationService.notify('success', data.message);

        //get-List
        this.getEmployeeFamilyDetailsList();

        //spinner hide
        this.spinner.hide();
      },
        (error) => {
          console.log(error);
          //spinner hide
          this.spinner.hide();
        })

  }

  //post data 
  onSubmit() {
    this.submitted=true;
  
    if(this.employeeFamilyDetailsForm.valid == true ){

    //spinner show
    this.spinner.show();

    let dateOfBirth = new Date(this.employeeFamilyDetailsForm.value.dateOfBirth);

    this.employeeFamilyDetailsObject =

    {


      "address": this.employeeFamilyDetailsForm.value.address,
      "adhaarNo": this.employeeFamilyDetailsForm.value.aadhaarNo,
      "age": this.employeeFamilyDetailsForm.value.age,
      "dob": dateOfBirth,
      "email": this.employeeFamilyDetailsForm.value.email,
      "isDeleted": false,
      "esicNominee": this.employeeFamilyDetailsForm.value.esicNominee,
      "gratuityNominee": this.employeeFamilyDetailsForm.value.gratitutyNominee,
      "medicalInsuNominee": this.employeeFamilyDetailsForm.value.medicalInsuNominee,
      "medicalInsurance": this.employeeFamilyDetailsForm.value.medicalNominee,
      "name": this.employeeFamilyDetailsForm.value.employeeName,
      "pensionNominee": this.employeeFamilyDetailsForm.value.pensionNominee,
      "pfNominee": this.employeeFamilyDetailsForm.value.pfNominee,
      "phoneNo": this.employeeFamilyDetailsForm.value.phoneNo,
      "relationship": this.employeeFamilyDetailsForm.value.relation,
      "employee": {
        "employeeId": this.employeeId
      }

    }



    this.employeeService.postEmployeeFamilyDetails(this.employeeFamilyDetailsObject)
      .subscribe((data: any) => {
        this.notificationService.notify('success', data.message);
        this.employeeFamilyDetailsForm.reset();
        //get-List
        this.getEmployeeFamilyDetailsList();
        this.submitted=false;

        //spinner hide
        this.spinner.hide();

      },
        (error) => {
          console.log(error);
          //spinner hide
          this.spinner.hide();
        })
      }

  }


public importFileData1:any = null;


importFileSkill(event:any){
  if (event.target.files && event.target.files[0]) {
    console.log(event.target.files[0].type);
    
    if(event.target.files[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
      this.importFileData1 = event.target.files[0];
    }
    }else{
    
    }

  } 


  submitImportSkill(){
    if(this.importFileData1 != null){
       let compId:any =sessionStorage.getItem('companyId');
      let form = new FormData();
      form.append("file",this.importFileData1);
      form.append("companyId",compId);
      form.append('employeeId',this.editEmployeeId);

      let api:any="employee/employeeFamilymembersImport/"+this.editEmployeeId;
      this.crudOperationsService.create(form,api).subscribe((data:any) => {
        this.getEmployeeFamilyDetailsList();
        this.listOfEmployeeResults1 = [];
        this.listOfEmployeeResults1 = data.data;
        
       this.successCount = (this.listOfEmployeeResults1[(this.listOfEmployeeResults1.length-1)])["importSucessCount"];
       this.errorCount = (this.listOfEmployeeResults1[(this.listOfEmployeeResults1.length-1)])["importErrorCount"];
      console.log(this.successCount);
      console.log(this.errorCount);
        if(this.successCount > 0){
          this.showSuccessMsg = true;
       
        }
        if(this.errorCount > 0){
          this.showErrorMsg = true;
      
        

      }
    })
  }
}



}
