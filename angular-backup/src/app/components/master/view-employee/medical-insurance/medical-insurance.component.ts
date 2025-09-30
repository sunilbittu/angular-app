import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
declare var $: any;

@Component({
  selector: 'app-medical-insurance',
  templateUrl: './medical-insurance.component.html',
  styleUrls: ['./medical-insurance.component.css']
})
export class MedicalInsuranceComponent implements OnInit {
  public headers1: any = ['Policy No.', 'Plan', 'Insurance Company', 'Card No.', 'Premium Amt.', 'Sum Assured (GMC)', 'Sum Assured (GPA)', 'Policy Issue Date', 'Policy Exp Date', 'Allow Display In ESS', 'Action']
  public headers2: any = ['Name', 'Relationship', 'Date of Birth', 'Medical Insurance', 'Medical Insurance Nominee'];
  public medicalInsurenceForm!: any;
  public employeeId !: number;
  public medicalInsurenceObject!: any;
  public medicalInsurenceList!: any;
  public employeeFamilyDetailsList!: any[];
  public medicalInsurenceById!: any;
  public enableUpdateButton!: any;
  public listOfEmployeeResults1:any[]=[];
  public successCount: any;
  public showErrorMsg: boolean=false;
  public errorCount: any;
  public editEmployeeId:any=sessionStorage.getItem("Edit-employeeId");
  public showSuccessMsg: boolean=false;
  public submitted: boolean=false;
  public requiredErrorText = 'can\'t be blank';
  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  cancelClicked: any;
  companiesList: any;
  searchModel: string='';
  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe, private crudeService: CrudOperationsService,
    private notificationService: NotifierService, private spinner: NgxSpinnerService) { }
  ngOnInit(): void {
    this.medicalInsurenceForm = this.formBuilder.group({
      policyNumber: ['',Validators.required],
      plan: ['',Validators.required],
      insurenceCompany: ['',Validators.required],
      cardNo: [],
      premiumAmt: ['',Validators.required],
      sumAssuredGMC: [],
      sumAssuredGPA: [],
      policyIssueDate: ['',Validators.required],
      policyExpiryDate: ['',Validators.required],
      remarks: [],
      allowDisplayEss: ['']
    })
    //get List
    this.fetchEmployeeMedicalInsurence();
    //get family relations List
    this.getEmployeeFamilyDetailsList();

    this.getIMList();
  }
  public companyId: any = Number(sessionStorage.getItem("companyId"));
  getIMList() {
    let api = "insurancecompany/list?companyId=" + this.companyId + '&remarks=' +'insurance'+ '&search=' + this.searchModel + "&page=&size=";
    this.crudeService.getList(api).subscribe((data: any) => {
      console.log(data, "===data");
      this.companiesList = data.data.content;
    })
  }
  get form_() { return this.medicalInsurenceForm.controls; };

  //get List
  fetchEmployeeMedicalInsurence() {
    //get employeeId
    this.employeeId = Number(sessionStorage.getItem('Edit-employeeId'));
    let api: any = "medicalinsurance/list_by_employee/" + this.employeeId
    this.crudeService.getList(api)
      .subscribe((data: any) => {
        this.medicalInsurenceList = data.data.content
      },
        (error) => {
          this.notificationService.notify('error', 'Something Went Wrong');
        })
  }
  //get family relations List
  getEmployeeFamilyDetailsList() {
    let api: any = "employeefamilydetail/list_by_employee/" + this.employeeId;
    this.crudeService.getList(api)
      .subscribe((data: any) => {
        this.employeeFamilyDetailsList = data.data;
      },
        (error) => {
          this.notificationService.notify('error', 'Something Went Wrong');
        })
  }
  //edit function
  editEmployeeMedicalInsurence(id: number) {
    //spinner show
    this.spinner.show();
    let api: any = "medicalinsurance/" + id
    this.crudeService.getList(api)
      .subscribe((data: any) => {
        this.medicalInsurenceById = data.data;
        //spinner hide
        this.spinner.hide();
        //enale update button
        this.enableUpdateButton = true;
        let expiryDate = new Date(this.medicalInsurenceById.policyExpiredDate)
        let issuedDate = new Date(this.medicalInsurenceById.policyIssuedDate)
        this.medicalInsurenceForm.patchValue({
          policyNumber: this.medicalInsurenceById.policyNo,
          plan: this.medicalInsurenceById.insurancePlanFor,
          insurenceCompany: this.medicalInsurenceById.insuranceCompany.insuranceCompaniesId,
          cardNo: this.medicalInsurenceById.cardNo,
          premiumAmt: this.medicalInsurenceById.premiumAmount,
          sumAssuredGMC: this.medicalInsurenceById.sumAssuredGmc,
          sumAssuredGPA: this.medicalInsurenceById.sumAssuredGpa,
          policyIssueDate: issuedDate,
          policyExpiryDate: expiryDate,
          remarks: this.medicalInsurenceById.medicalInsuranceRemarks,
          allowDisplayEss: this.medicalInsurenceById.allowDisplayInEss
        })

      },
        (error) => {
          this.notificationService.notify('error', 'Something Went Wrong');
          //show hide
          this.spinner.hide();
        })
  }
  //delete EmployeeMedicalInnsurence
  deleteEmployeeMeedicalInsurence(id: number) {
    //spinner show
    this.spinner.show();
    let api: any = "medicalinsurance/" + id
    this.crudeService.delete(api)
      .subscribe((data: any) => {
        this.notificationService.notify('success', data.message);
        //spinner hide
        this.spinner.hide();
        //get List
        this.fetchEmployeeMedicalInsurence();
      },
        (error) => {
          this.notificationService.notify('error', 'Something Went Wrong');
          //show hide
          this.spinner.hide();
        })
  }
  updateEmployeeMedicalInsurence() {
    //spinner show
    this.spinner.show();
    let expiryDate = new Date(this.medicalInsurenceForm.value.policyExpiryDate)
    let issuedDate = new Date(this.medicalInsurenceForm.value.policyIssueDate)
    this.medicalInsurenceObject =
    {
      "medicalInsuranceId": this.medicalInsurenceById.medicalInsuranceId,
      "allowDisplayInEss": this.medicalInsurenceForm.value.allowDisplayEss,
      "policyNo": this.medicalInsurenceForm.value.policyNumber,
      "cardNo": this.medicalInsurenceForm.value.cardNo,
      "insurancePlanFor": this.medicalInsurenceForm.value.plan,
      "medicalInsuranceRemarks": this.medicalInsurenceForm.value.remarks,
      "policyExpiredDate": expiryDate,
      "policyIssuedDate": issuedDate,
      "premiumAmount": this.medicalInsurenceForm.value.premiumAmt,
      "sumAssuredGmc": this.medicalInsurenceForm.value.sumAssuredGMC,
      "sumAssuredGpa": this.medicalInsurenceForm.value.sumAssuredGPA,
      "createdBy": this.medicalInsurenceById.createdBy,
      "createdDate": this.medicalInsurenceById.createdDate,
      "isDeleted": this.medicalInsurenceById.isDeleted,
      "insuranceCompany": {
        "insuranceCompaniesId": this.medicalInsurenceForm.value.insurenceCompany
      },
      "employee": {
        "employeeId": this.employeeId
      }
    }
    let api: any = "medicalinsurance/" + this.medicalInsurenceById.medicalInsuranceId
    this.crudeService.update(this.medicalInsurenceObject, api)
      .subscribe((data: any) => {
        this.notificationService.notify('success', data.message);
        this.medicalInsurenceForm.reset();
        //dissable update button
        this.enableUpdateButton = false;
        //spinner hide
        this.spinner.hide();
        //get List
        this.fetchEmployeeMedicalInsurence();
      },
        (error) => {
          this.notificationService.notify('error', 'Something Went Wrong');
          //show hide
          this.spinner.hide();
        })
  }
  onSubmit() {
    this.submitted=true;
  
    if(this.medicalInsurenceForm.valid == true ){

    //spinner show
    this.spinner.show();
    let expiryDate = new Date(this.medicalInsurenceForm.value.policyExpiryDate)
    let issuedDate = new Date(this.medicalInsurenceForm.value.policyIssueDate)
    this.medicalInsurenceObject =
    {
      "allowDisplayInEss": this.medicalInsurenceForm.value.allowDisplayEss,
      "policyNo": this.medicalInsurenceForm.value.policyNumber,
      "cardNo": this.medicalInsurenceForm.value.cardNo,
      "insurancePlanFor": this.medicalInsurenceForm.value.plan,
      "medicalInsuranceRemarks": this.medicalInsurenceForm.value.remarks,
      "policyExpiredDate": expiryDate,
      "policyIssuedDate": issuedDate,
      "premiumAmount": this.medicalInsurenceForm.value.premiumAmt,
      "sumAssuredGmc": this.medicalInsurenceForm.value.sumAssuredGMC,
      "sumAssuredGpa": this.medicalInsurenceForm.value.sumAssuredGPA,
      "insuranceCompany": {
        "insuranceCompaniesId": this.medicalInsurenceForm.value.insurenceCompany
      },
      "employee": {
        "employeeId": this.employeeId
      }
    }
    let api: any = "medicalinsurance"
    this.crudeService.create(this.medicalInsurenceObject, api)
      .subscribe((data: any) => {
        this.notificationService.notify('success', data.message);
        this.medicalInsurenceForm.reset();
        this.submitted=false;
        //spinner hide
        this.spinner.hide();
        //get List
        this.fetchEmployeeMedicalInsurence();
      },
        (error) => {
          this.notificationService.notify('error', 'Something Went Wrong');
          //show hide
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

      let api:any="employee/employeeMedicalInsuranceImport/"+this.editEmployeeId;
      this.crudeService.create(form,api).subscribe((data:any) => {
        this.fetchEmployeeMedicalInsurence();
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

showModelMedical(){
  (<any>$('#importModelMedical')).modal('show');

}

}
