import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { AddEmployeeService } from 'src/app/components/master/addEmplyee.service';
import { DatePipe } from '@angular/common';
import { NotifierService } from 'angular-notifier';
import { EmployeeMastersService } from '../../employee.masters.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
declare var $: any;
@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {

  public addEmployeeForm!: FormGroup;

  public employeeObject: any;
  public EditemployeeObject: any;
  public selectedDate!: Date;
  public paymentMode!: any;
  public companyId!: number;
  public employeeNameSample: any;

  //masters variables
  public branchList!: any[];
  public gradeList!: any[];
  public departMentList!: any[];
  public designationList!: any[];
  public costCenterList!: any[];
  public projectList!: any[];
  public categoryList!: any[];
  public subscription!: any;
  public employeeData!: any;
  public reportingList!: any[];
  public employeeId!: number;
  public nationalityList: any = [];

  public Permanent: any;
  public contract: any;
  public partTime: any;

  public tableShow: boolean = true;
  public onBoardingEmpData: any;
  public isFromOnBoardingPage: boolean = false;
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public currencyType: any = '';
  aadharCantBemoreThan12: boolean = false;
  public bankMasterList!: any[];
  public searchModel = '';

  public workflowList: any = [];
  constructor(private formBuilder: FormBuilder, public datePipe: DatePipe, private alertService: NotifierService,
    public location: Location, private addEmployeeService: AddEmployeeService,
    private employeMasterService: EmployeeMastersService, private notification: NotifierService,
    private spinner: NgxSpinnerService, public crudOperationsService: CrudOperationsService) { }
  ngOnInit(): void {
    this.fetchBankMasterList();
    this.initializeForm();
    this.checkIsFromOnBoarding();
    this.getEmpCode();
    //disable payment mode
    // this.disablePaymentMode();
    //disable pfBlock
    this.disbalePfblock();
    //disable tableBlock
    this.disbaleTypeShowApplicable();
    //disable esisBlock
    this.disableEsicBlock();
    //date of leaving modelpopup
    this.leavingDatemodelPopup();
    //branchMaster List
    this.fetchBranchDetailsList();
    //reporting Employees
    this.getReportingEmployeesById(this.employeeId, this.companyId);
    //get designation list
    this.fetchGradeList();
    //get designation list
    this.fetchDesignationList();
    //get costcenter list
    this.fetchCostCenterList();
    //get costcenter list
    this.fetchProjectList();
    //get categoryMaster list
    this.fetchCategoryList();

    this.fetchNationalites();

    this.crudOperationsService.getList("approvalworkflow/approvalworkflow_list/1/?search=&page=&size=500").subscribe((data: any) => {
      this.workflowList = data.data.content;
    });
  }
  getEmpCode() {
    this.crudOperationsService.getList("employee/get-emp-code/"+this.companyId).subscribe((data: any) => {
      this.addEmployeeForm.patchValue({
        EmployeeCode: data.data
      });
    },
    (error) => {
      this.spinner.hide();
      this.notification.notify('error', 'Something went wrong while fetch Employee Code!');
    })
  }

  fetchNationalites() {
    let api = 'nationality/list?search=&page=&size=10';
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.nationalityList = data.data.content;
    },
      (error) => {
        this.spinner.hide();
        this.notification.notify('error', 'Something went wrong!');
      })
  }
  initializeForm() {
    this.addEmployeeForm = this.formBuilder.group({
      EmployeeCode: ['', Validators.required],
      EmployeeName: [],
      Title: [''],
      FirstName: ['', Validators.required],
      ExternalReportingHeadMail: [''],
      clientName: [''],
      MiddleName: [''],
      LastName: ['', Validators.required],
      Gender: [''],
      FatherName: ['', Validators.required],
      MotherName: [],
      SpouseName: [],
      PanNo: [],
      AadhaarNo: ['', Validators.required],
      VoterId: [],
      PaymentMode: [null, Validators.required],
      BankName: [null, Validators.required],
      AccountNo: [],
      IfscCode: [],
      AccountName: [''],
      DataOfBirth: ['', Validators.required],
      DateOfJoining: ['', Validators.required],
      provisionDate: ['', Validators.required],
      DateOfCommunications: [],
      contractEndDate: [],
      dateOfIssueEP: [],
      dateOfExpiryEP: [],
      PfApplicable: [false],
      isSpouseWorking: [false],
      TypeApplicable: [false],
      PfApplicableDate: [''],
      PfNumber: [],
      UanNo: [],
      internationalWorker: [false],
      EsicApplicable: [false],
      EsicApplicableDate: [],
      EsisNumber: [],
      PtApplicable: [false],
      TdsApplicable: [false],
      DataOfLeaving: [false],
      Nationality: [null, Validators.required],
      Branch: ['', Validators.required],
      Grade: ['', Validators.required],
      Department: ['', Validators.required],
      DepartmentHead: [false],
      Desiganion: ['', Validators.required],

      CostCenter: ['', Validators.required],
      Project: ['', Validators.required],
      Category: ['', Validators.required],
      ReportingHead: ['', Validators.required],
      workflow: [null]
    })
  }
  get form_() { return this.addEmployeeForm.controls; };
  checkIsFromOnBoarding() {
    let fromOnBoardingPage = sessionStorage.getItem("fromOnBoardingPage");
    let onBoardingEmployeeId = sessionStorage.getItem("onBoardingEmployeeId");
    console.log('fromOnBoardingPage : ', fromOnBoardingPage, ' .. onBoardingEmployeeId : ', onBoardingEmployeeId)
    if (fromOnBoardingPage == 'true') {
      this.isFromOnBoardingPage = true;
      this.getOnboardingDetails(onBoardingEmployeeId);
    } else {
      this.isFromOnBoardingPage = false;
    }
  }
  getOnboardingDetails(onBoardingEmployeeId: any) {
    let api1 = 'onboardingemployee/' + onBoardingEmployeeId;
    this.crudOperationsService.getList(api1).subscribe((data: any) => {
      this.onBoardingEmpData = data.data;
      this.setDefaultToOnboardingProperties();
      console.log('this.onBoardingEmpData : ', this.onBoardingEmpData);

      this.addEmployeeForm = this.formBuilder.group({
        EmployeeCode: ['', Validators.required],
        EmployeeName: [this.onBoardingEmpData.firstName],
        Title: [''],
        FirstName: [this.onBoardingEmpData.firstName],
        MiddleName: [this.onBoardingEmpData.middleName],
        LastName: [this.onBoardingEmpData.lastName],
        Gender: [this.onBoardingEmpData.gender.toLowerCase()],
        FatherName: [this.onBoardingEmpData.fatherName],
        MotherName: [],
        SpouseName: [],
        PanNo: [this.onBoardingEmpData.panNo],
        AadhaarNo: [this.onBoardingEmpData.adhaarNo, Validators.required],
        VoterId: [this.onBoardingEmpData.voterId],
        PaymentMode: [''],
        BankName: [''],
        AccountNo: [],
        IfscCode: [],
        AccountName: [''],
        DataOfBirth: [new Date(this.onBoardingEmpData.dob)],
        DateOfJoining: [new Date(this.onBoardingEmpData.doj)],
        provisionDate: [new Date(this.onBoardingEmpData.provisionDate)],
        DateOfCommunications: [],
        contractEndDate: [],
        dateOfIssueEP: [],
        dateOfExpiryEP: [],
        PfApplicable: [false],
        isSpouseWorking: [false],
        TypeApplicable: [false],
        PfApplicableDate: [''],
        PfNumber: [],
        UanNo: [],
        internationalWorker: [false],
        EsicApplicable: [false],
        EsicApplicableDate: [],
        EsisNumber: [],
        PtApplicable: [false],
        TdsApplicable: [false],
        DataOfLeaving: [false],
        Branch: ['', Validators.required],
        Grade: ['', Validators.required],
        Department: ['', Validators.required],
        DepartmentHead: [false],
        Desiganion: ['', Validators.required],

        CostCenter: ['', Validators.required],
        Project: ['', Validators.required],
        Category: ['', Validators.required],
        ReportingHead: ['', Validators.required],
        workflow: []
      })
    })
  }

  setDefaultToOnboardingProperties() {
    sessionStorage.setItem("fromOnBoardingPage", "false");
    sessionStorage.setItem("onBoardingEmployeeId", "null");
  }
  /* Employee-Masters Fuctional Call*/

  fetchBranchDetailsList() {
    //getting companyId from session-storage
    this.companyId = Number(sessionStorage.getItem('companyId'));
    this.employeeId = Number(sessionStorage.getItem('empId'));
    return this.employeMasterService.getBranchMaster(this.companyId)
      .subscribe((data: any) => {

        this.branchList = data.data.content;
        console.log(this.branchList);
      }
        ,
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  //get designation list
  fetchGradeList() {
    //getting companyId from session-storage
    this.companyId = Number(sessionStorage.getItem('companyId'));
    this.employeMasterService.getGradeMasterList(this.companyId)
      .subscribe((data: any) => {

        this.gradeList = data.data.content;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  getReportingEmployeesById(id: number, companyId: number) {
    return this.addEmployeeService.getReportingEmployeeById(id, companyId)
      .subscribe((data: any) => {
        this.reportingList = data.data;

      })
  }
  //get deepartmentList
  fetchDepartmentList() {
    this.setCurrencyType();
    return this.employeMasterService.getDepartmentListByBranchId(this.addEmployeeForm.value.Branch)
      .subscribe((data: any) => {
        debugger
        this.departMentList = data.data;

      }
        ,
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })

  }
  public branchDetails: any;
  setCurrencyType() {
    let url = 'branchdetail/getCurrencyCode/' + this.addEmployeeForm.value.Branch;
    this.crudOperationsService.getList(url)
      .subscribe((data: any) => {
        this.branchDetails = data.data;
        if (this.branchDetails.currencyMaster) {
          this.currencyType = '(' + this.branchDetails.currencyMaster.currencyCode.toUpperCase() + ')';
        } else {
          this.currencyType = '';
        }
      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  //get designation list
  fetchDesignationList() {
    //getting companyId from session-storage
    this.companyId = Number(sessionStorage.getItem('companyId'));
    this.employeMasterService.getDesignationList(this.companyId)
      .subscribe((data: any) => {

        this.designationList = data.data.content;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  //get costcenter list
  fetchCostCenterList() {
    this.companyId = Number(sessionStorage.getItem('companyId'));
    this.employeMasterService.getCostCenterMasterList(this.companyId)
      .subscribe((data: any) => {

        this.costCenterList = data.data.content;

      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  //get costcenter list
  fetchProjectList() {
    this.companyId = Number(sessionStorage.getItem('companyId'));
    this.employeMasterService.getProjectMasterList(this.companyId)
      .subscribe((data: any) => {

        this.projectList = data.data.content;

      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  //get categoryMaster list
  fetchCategoryList() {
    this.companyId = Number(sessionStorage.getItem('companyId'));
    this.employeMasterService.getCategoryMasterList(this.companyId)
      .subscribe((data: any) => {

        this.categoryList = data.data.content;

        console.log(this.categoryList);

      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }

  // //disable payment mode
  // disablePaymentMode() {

  //   //getting formcontroll value
  //   this.paymentMode = this.addEmployeeForm.value.PaymentMode;

  //   //alert(this.paymentMode);

  //   if (this.paymentMode == '' || this.paymentMode == 'Cash' || this.paymentMode == 'Cheque' || this.paymentMode == 'Happay') {
  //     //disabling form controlls
  //     //for disable select form controls
  //     this.addEmployeeForm.get('BankName')?.disable();
  //     this.addEmployeeForm.controls['AccountNo'].disable({ onlySelf: true });
  //     this.addEmployeeForm.controls['IfscCode'].disable({ onlySelf: true });
  //     this.addEmployeeForm.controls['AccountName'].disable({ onlySelf: true });

  //   }

  //   else {
  //     //enabling form controlls
  //     this.addEmployeeForm.get('BankName')?.enable();
  //     this.addEmployeeForm.controls['AccountNo'].enable({ onlySelf: true });
  //     this.addEmployeeForm.controls['IfscCode'].enable({ onlySelf: true });
  //     this.addEmployeeForm.controls['AccountName'].enable({ onlySelf: true })
  //   }

  // }
  //disble PF
  disbalePfblock() {

    const pfValue = this.addEmployeeForm.value.PfApplicable;

    // alert(pfValue);

    if (pfValue == false) {
      this.addEmployeeForm.get('PfApplicableDate')?.disable();
      this.addEmployeeForm.get('PfNumber')?.disable();
      this.addEmployeeForm.get('UanNo')?.disable();
    }

    else {
      this.addEmployeeForm.get('PfApplicableDate')?.enable();
      this.addEmployeeForm.get('PfNumber')?.enable();
      this.addEmployeeForm.get('UanNo')?.enable();
    }
  }

  //disble PF
  disbaleTypeShowApplicable() {

    const typeValue = this.addEmployeeForm.value.TypeApplicable;

    //alert(typeValue);

    if (typeValue == true) {
      this.tableShow = false;
    }
    else {
      this.tableShow = true;
    }
  }
  //disable Esisc block
  disableEsicBlock() {

    const esicValue = this.addEmployeeForm.value.EsicApplicable;

    if (esicValue == false) {
      this.addEmployeeForm.get('EsicApplicableDate')?.disable();
      this.addEmployeeForm.get('EsisNumber')?.disable();
    }

    else {
      this.addEmployeeForm.get('EsicApplicableDate')?.enable();
      this.addEmployeeForm.get('EsisNumber')?.enable();
    }

  }

  //leaving date model popup
  leavingDatemodelPopup() {

    const leavingDateValue = this.addEmployeeForm.value.DataOfLeaving;

    if (leavingDateValue == true) {

      $('#dateOfLeaving').modal('show');
    }

    else {
      $('#dateOfLeaving').modal('hide');
    }
  }
  goBack() {
    this.location.back();
  }
  onEndDateValueChange(event: any) {
    this.selectedDate = new Date(event);
    let latest_date = this.datePipe.transform(this.addEmployeeForm.value.DateOfJoining, 'dd-MM-yyyy');

    //this.selectedDate = event.getDate(),event.getMonth(),event.getYear();
    console.log(latest_date);
  }
  //submit function
  onSubmit() {
    this.submitted = true;
   // if (this.addEmployeeForm.valid && !this.aadharCantBemoreThan12) {
      let dob = this.datePipe.transform(this.addEmployeeForm.value.DataOfBirth, 'yyyy-MM-dd');
      let doj = this.datePipe.transform(this.addEmployeeForm.value.DateOfJoining, 'yyyy-MM-dd');
      let provisionDate = this.datePipe.transform(this.addEmployeeForm.value.provisionDate, 'yyyy-MM-dd');
     // console.log("project value==", this.addEmployeeForm.value.Project)
     // console.log("JObid ==", sessionStorage.getItem("jobId"))

      if (sessionStorage.getItem("jobId") == null || sessionStorage.getItem("jobId") == undefined) {

        if (this.addEmployeeForm.value.Project == null) {
          this.employeeObject =
          {
            "accountName": this.addEmployeeForm.value.AccountName,
            "accountNumber": this.addEmployeeForm.value.AccountNo,
            "adhaarNo": this.addEmployeeForm.value.AadhaarNo,
            "attendanceCode": this.addEmployeeForm.value.AttenceCode,
            "bankId": {
              "bankId": this.addEmployeeForm.value.BankName
            },
            "dateOfJoining": doj,
            "provisionDate": provisionDate,
            "dateOfJoiningConfirmation": this.addEmployeeForm.value.DateOfCommunications,
            "contractEndDate": this.addEmployeeForm.value.contractEndDate,
            "dateOfIssueEP": this.addEmployeeForm.value.dateOfIssueEP,
            "dateOfExpiryEP": this.addEmployeeForm.value.dateOfExpiryEP,
            "dob": dob,
            "employeeCode": this.addEmployeeForm.value.EmployeeCode,
            "esicApplicable": this.addEmployeeForm.value.EsicApplicable,
            "esicApplicableDate": this.addEmployeeForm.value.EsicApplicableDate,
            "esicNumber": this.addEmployeeForm.value.EsisNumber,
            "fatherName": this.addEmployeeForm.value.FatherName,
            "firstName": this.addEmployeeForm.value.FirstName,
            "externalReportingHeadMail": this.addEmployeeForm.value.ExternalReportingHeadMail,
            "clientName": this.addEmployeeForm.value.clientName,
            "ifsc": this.addEmployeeForm.value.IfscCode,

            "isInternationalWorker": this.addEmployeeForm.value.internationalWorker,
            "joiningConfirmation": true,
            "lastName": this.addEmployeeForm.value.LastName,
            "middleName": this.addEmployeeForm.value.MiddleName,
            "motherName": this.addEmployeeForm.value.MotherName,
            "panNo": this.addEmployeeForm.value.PanNo,
            "paymentMode": this.addEmployeeForm.value.PaymentMode,
            "pfApplicable": this.addEmployeeForm.value.PfApplicable,
            "isSpouseWorking": this.addEmployeeForm.value.isSpouseWorking,
            "typeApplicable": this.addEmployeeForm.value.TypeApplicable,
            "pfApplicableDate": this.addEmployeeForm.value.PfApplicableDate,
            "pfNumber": this.addEmployeeForm.value.PfNumber,
            "ptApplicable": this.addEmployeeForm.value.PtApplicable,

            "reportingHeadId": this.addEmployeeForm.value.ReportingHead,
            "workflow": this.addEmployeeForm.value.workflow,
            "spouseName": this.addEmployeeForm.value.SpouseName,

            "title": this.addEmployeeForm.value.Title,
            "uanNo": this.addEmployeeForm.value.UanNo,
            "voterId": this.addEmployeeForm.value.VoterId,
            "gender": this.addEmployeeForm.value.Gender,
            "nationality": {
              "nationalityId": this.addEmployeeForm.value.Nationality
            },
            "branchDetail": {
              "companyBranchDetailsId": this.addEmployeeForm.value.Branch
            },
            "categoryMaster": {
              "categoryId": this.addEmployeeForm.value.Category
            },
            "company": {
              "companyId": this.companyId
            },
            "costCenterMaster": {
              "costCenterId": this.addEmployeeForm.value.CostCenter
            },
            "department": {
              "departmentId": this.addEmployeeForm.value.Department
            },
            "departmentHead": this.addEmployeeForm.value.DepartmentHead,
            "designation": {
              "designationId": this.addEmployeeForm.value.Desiganion
            },
            "divisionMaster": {
              "divisionId": 87
            },
            "gradeMaster": {
              "gradeId": this.addEmployeeForm.value.Grade
            }
          }

        } else {
          this.employeeObject =
          {
            "accountName": this.addEmployeeForm.value.AccountName,
            "accountNumber": this.addEmployeeForm.value.AccountNo,
            "adhaarNo": this.addEmployeeForm.value.AadhaarNo,
            "attendanceCode": this.addEmployeeForm.value.AttenceCode,
            "bankId": {
              "bankId": this.addEmployeeForm.value.BankName
            },
            "dateOfJoining": doj,
            "dateOfJoiningConfirmation": this.addEmployeeForm.value.DateOfCommunications,
            "provisionDate": provisionDate,
            "contractEndDate": this.addEmployeeForm.value.contractEndDate,
            "dateOfIssueEP": this.addEmployeeForm.value.dateOfIssueEP,
            "dateOfExpiryEP": this.addEmployeeForm.value.dateOfExpiryEP,
            "dob": dob,
            "employeeCode": this.addEmployeeForm.value.EmployeeCode,
            "esicApplicable": this.addEmployeeForm.value.EsicApplicable,
            "esicApplicableDate": this.addEmployeeForm.value.EsicApplicableDate,
            "esicNumber": this.addEmployeeForm.value.EsisNumber,
            "fatherName": this.addEmployeeForm.value.FatherName,
            "firstName": this.addEmployeeForm.value.FirstName,
            "externalReportingHeadMail": this.addEmployeeForm.value.ExternalReportingHeadMail,
            "clientName": this.addEmployeeForm.value.clientName,
            "ifsc": this.addEmployeeForm.value.IfscCode,

            "isInternationalWorker": this.addEmployeeForm.value.internationalWorker,
            "joiningConfirmation": true,
            "lastName": this.addEmployeeForm.value.LastName,
            "middleName": this.addEmployeeForm.value.MiddleName,
            "motherName": this.addEmployeeForm.value.MotherName,
            "panNo": this.addEmployeeForm.value.PanNo,
            "paymentMode": this.addEmployeeForm.value.PaymentMode,
            "pfApplicable": this.addEmployeeForm.value.PfApplicable,
            "isSpouseWorking": this.addEmployeeForm.value.isSpouseWorking,
            "typeApplicable": this.addEmployeeForm.value.TypeApplicable,
            "pfApplicableDate": this.addEmployeeForm.value.PfApplicableDate,
            "pfNumber": this.addEmployeeForm.value.PfNumber,
            "ptApplicable": this.addEmployeeForm.value.PtApplicable,

            "reportingHeadId": this.addEmployeeForm.value.ReportingHead,
            "workflow": this.addEmployeeForm.value.workflow,
            "spouseName": this.addEmployeeForm.value.SpouseName,

            "title": this.addEmployeeForm.value.Title,
            "uanNo": this.addEmployeeForm.value.UanNo,
            "voterId": this.addEmployeeForm.value.VoterId,
            "gender": this.addEmployeeForm.value.Gender,
            "nationality": {
              "nationalityId": this.addEmployeeForm.value.Nationality
            },
            "branchDetail": {
              "companyBranchDetailsId": this.addEmployeeForm.value.Branch
            },
            "categoryMaster": {
              "categoryId": this.addEmployeeForm.value.Category
            },
            "company": {
              "companyId": this.companyId
            },
            "costCenterMaster": {
              "costCenterId": this.addEmployeeForm.value.CostCenter
            },
            "department": {
              "departmentId": this.addEmployeeForm.value.Department
            },
            "departmentHead": this.addEmployeeForm.value.DepartmentHead,
            "designation": {
              "designationId": this.addEmployeeForm.value.Desiganion
            },
            "divisionMaster": {
              "divisionId": 87
            },
            "gradeMaster": {
              "gradeId": this.addEmployeeForm.value.Grade
            },
            "projectMaster": {
              "projectId": this.addEmployeeForm.value.Project
            }
          }

        }
      } else {

        if (this.addEmployeeForm.value.Project == null) {
          this.employeeObject =
          {
            "accountName": this.addEmployeeForm.value.AccountName,
            "accountNumber": this.addEmployeeForm.value.AccountNo,
            "adhaarNo": this.addEmployeeForm.value.AadhaarNo,
            "attendanceCode": this.addEmployeeForm.value.AttenceCode,
            "bankId": {
              "bankId": this.addEmployeeForm.value.BankName
            },
            "dateOfJoining": doj,
            "dateOfJoiningConfirmation": this.addEmployeeForm.value.DateOfCommunications,
            "provisionDate": provisionDate,
            "contractEndDate": this.addEmployeeForm.value.contractEndDate,
            "dateOfIssueEP": this.addEmployeeForm.value.dateOfIssueEP,
            "dateOfExpiryEP": this.addEmployeeForm.value.dateOfExpiryEP,
            "dob": dob,
            "employeeCode": this.addEmployeeForm.value.EmployeeCode,
            "esicApplicable": this.addEmployeeForm.value.EsicApplicable,
            "esicApplicableDate": this.addEmployeeForm.value.EsicApplicableDate,
            "esicNumber": this.addEmployeeForm.value.EsisNumber,
            "fatherName": this.addEmployeeForm.value.FatherName,
            "firstName": this.addEmployeeForm.value.FirstName,
            "externalReportingHeadMail": this.addEmployeeForm.value.ExternalReportingHeadMail,
            "clientName": this.addEmployeeForm.value.clientName,
            "ifsc": this.addEmployeeForm.value.IfscCode,

            "isInternationalWorker": this.addEmployeeForm.value.internationalWorker,
            "joiningConfirmation": true,
            "lastName": this.addEmployeeForm.value.LastName,
            "middleName": this.addEmployeeForm.value.MiddleName,
            "motherName": this.addEmployeeForm.value.MotherName,
            "panNo": this.addEmployeeForm.value.PanNo,
            "paymentMode": this.addEmployeeForm.value.PaymentMode,
            "pfApplicable": this.addEmployeeForm.value.PfApplicable,
            "isSpouseWorking": this.addEmployeeForm.value.isSpouseWorking,
            "typeApplicable": this.addEmployeeForm.value.TypeApplicable,
            "pfApplicableDate": this.addEmployeeForm.value.PfApplicableDate,
            "pfNumber": this.addEmployeeForm.value.PfNumber,
            "ptApplicable": this.addEmployeeForm.value.PtApplicable,

            "reportingHeadId": this.addEmployeeForm.value.ReportingHead,
            "workflow": this.addEmployeeForm.value.workflow,
            "spouseName": this.addEmployeeForm.value.SpouseName,

            "title": this.addEmployeeForm.value.Title,
            "uanNo": this.addEmployeeForm.value.UanNo,
            "voterId": this.addEmployeeForm.value.VoterId,
            "gender": this.addEmployeeForm.value.Gender,
            "resourceIndentRequest": {
              "jobId": Number(sessionStorage.getItem("jobId"))
            },
            "branchDetail": {
              "companyBranchDetailsId": this.addEmployeeForm.value.Branch
            },
            "categoryMaster": {
              "categoryId": this.addEmployeeForm.value.Category
            },
            "company": {
              "companyId": this.companyId
            },
            "costCenterMaster": {
              "costCenterId": this.addEmployeeForm.value.CostCenter
            },
            "department": {
              "departmentId": this.addEmployeeForm.value.Department
            },
            "departmentHead": this.addEmployeeForm.value.DepartmentHead,
            "designation": {
              "designationId": this.addEmployeeForm.value.Desiganion
            },
            "divisionMaster": {
              "divisionId": 87
            },
            "gradeMaster": {
              "gradeId": this.addEmployeeForm.value.Grade
            }
          }

        } else {
          this.employeeObject =
          {
            "accountName": this.addEmployeeForm.value.AccountName,
            "accountNumber": this.addEmployeeForm.value.AccountNo,
            "adhaarNo": this.addEmployeeForm.value.AadhaarNo,
            "attendanceCode": this.addEmployeeForm.value.AttenceCode,
            "bankId": {
              "bankId": this.addEmployeeForm.value.BankName
            },
            "dateOfJoining": doj,
            "dateOfJoiningConfirmation": this.addEmployeeForm.value.DateOfCommunications,
            "provisionDate": provisionDate,
            "contractEndDate": this.addEmployeeForm.value.contractEndDate,
            "dateOfIssueEP": this.addEmployeeForm.value.dateOfIssueEP,
            "dateOfExpiryEP": this.addEmployeeForm.value.dateOfExpiryEP,
            "dob": dob,
            "employeeCode": this.addEmployeeForm.value.EmployeeCode,
            "esicApplicable": this.addEmployeeForm.value.EsicApplicable,
            "esicApplicableDate": this.addEmployeeForm.value.EsicApplicableDate,
            "esicNumber": this.addEmployeeForm.value.EsisNumber,
            "fatherName": this.addEmployeeForm.value.FatherName,
            "firstName": this.addEmployeeForm.value.FirstName,
            "externalReportingHeadMail": this.addEmployeeForm.value.ExternalReportingHeadMail,
            "clientName": this.addEmployeeForm.value.clientName,
            "ifsc": this.addEmployeeForm.value.IfscCode,

            "isInternationalWorker": this.addEmployeeForm.value.internationalWorker,
            "joiningConfirmation": true,
            "lastName": this.addEmployeeForm.value.LastName,
            "middleName": this.addEmployeeForm.value.MiddleName,
            "motherName": this.addEmployeeForm.value.MotherName,
            "panNo": this.addEmployeeForm.value.PanNo,
            "paymentMode": this.addEmployeeForm.value.PaymentMode,
            "pfApplicable": this.addEmployeeForm.value.PfApplicable,
            "isSpouseWorking": this.addEmployeeForm.value.isSpouseWorking,
            "typeApplicable": this.addEmployeeForm.value.TypeApplicable,
            "pfApplicableDate": this.addEmployeeForm.value.PfApplicableDate,
            "pfNumber": this.addEmployeeForm.value.PfNumber,
            "ptApplicable": this.addEmployeeForm.value.PtApplicable,

            "reportingHeadId": this.addEmployeeForm.value.ReportingHead,
            "workflow": this.addEmployeeForm.value.workflow,
            "spouseName": this.addEmployeeForm.value.SpouseName,

            "title": this.addEmployeeForm.value.Title,
            "uanNo": this.addEmployeeForm.value.UanNo,
            "voterId": this.addEmployeeForm.value.VoterId,
            "gender": this.addEmployeeForm.value.Gender,
            "resourceIndentRequest": {
              "jobId": Number(sessionStorage.getItem("jobId"))
            },
            "branchDetail": {
              "companyBranchDetailsId": this.addEmployeeForm.value.Branch
            },
            "categoryMaster": {
              "categoryId": this.addEmployeeForm.value.Category
            },
            "company": {
              "companyId": this.companyId
            },
            "costCenterMaster": {
              "costCenterId": this.addEmployeeForm.value.CostCenter
            },
            "department": {
              "departmentId": this.addEmployeeForm.value.Department
            },
            "departmentHead": this.addEmployeeForm.value.DepartmentHead,
            "designation": {
              "designationId": this.addEmployeeForm.value.Desiganion
            },
            "divisionMaster": {
              "divisionId": 87
            },
            "gradeMaster": {
              "gradeId": this.addEmployeeForm.value.Grade
            },
            "projectMaster": {
              "projectId": this.addEmployeeForm.value.Project
            }
          }

        }
      }

      //show spinner
      this.spinner.show(); this.addEmployeeService.addEmployee(this.employeeObject)
        .subscribe((data) => {
          if (this.isFromOnBoardingPage) {
            this.updateOnBoardingData();
            this.updateOnBoardingDataIfTheJobIdIsClosed();
            sessionStorage.setItem("jobId", "null");

          } else {
            this.location.back();
            this.spinner.hide();
          }
          this.alertService.notify('success', "Successfully Added Employee");
        }, (error) => {
          console.log(error);
          this.alertService.notify('error', "Something went wrong");
          this.location.back();
          //hide spinner
          this.spinner.hide();
          // this.addEmployeeForm.reset();
        })
    //}
  }
  updateOnBoardingData() {
    let url = "onboardingemployee/onboardingEmployeeUpdate/" + this.onBoardingEmpData.onBoardingEmployeeId;
    this.crudOperationsService.update("", url).subscribe((data) => {
      this.location.back();
      this.spinner.hide();
    })
  }

  updateOnBoardingDataIfTheJobIdIsClosed() {
    let url = "onboardingemployee/onboardingEmployeeUpdateAfterClosureOfJobId/" + Number(sessionStorage.getItem("jobId"));
    this.crudOperationsService.update("", url).subscribe((data) => {
      this.location.back();
      this.spinner.hide();
    })
  }
  editEmployee() {
    //alert('hi');
  }
  reset() {
    this.submitted = false;
    this.initializeForm();
    this.aadharCantBemoreThan12 = false;
  }
  getNameArray(title: any, firstName: any, middleName: any, lastName: any): any {
    let arr = [];
    if (title) arr.push(title);
    if (firstName) arr.push(firstName);
    if (middleName) arr.push(middleName);
    if (lastName) arr.push(lastName);
    return arr;
  }
  namechange() {
    let arr: [] = this.getNameArray(this.addEmployeeForm.value.Title, this.addEmployeeForm.value.FirstName, this.addEmployeeForm.value.MiddleName, this.addEmployeeForm.value.LastName);
    this.employeeNameSample = arr.join(" ");
  }
  aadharValidation() {
    let aadharnooo: String = (String)(this.addEmployeeForm.value.AadhaarNo);
    if (aadharnooo.length > 12 || aadharnooo.length < 12) {
      this.aadharCantBemoreThan12 = true;
    } else {
      this.aadharCantBemoreThan12 = false;
    }

  }

  fetchBankMasterList() {
    this.companyId = Number(sessionStorage.getItem('companyId'));
    let api: any = 'bankmaster/list_company/' + this.companyId + '?search=' + this.searchModel + "&page=&size=10";;
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.bankMasterList = data.data.content;
        console.log(this.bankMasterList);
      }
        ,
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
}
