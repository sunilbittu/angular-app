import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { AddEmployeeService } from '../../addEmplyee.service';
import { EmployeeMastersService } from '../../employee.masters.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
declare var $: any;
@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements OnInit {
  public addEmployeeForm!: FormGroup;
  public employeeObject: any;
  public EditemployeeObject: any;
  public selectedDate!: Date;
  public paymentMode: any = '';
  public companyId!: number;
  public employeeId!: number;
  public loginemployeeId!: number;
  //masters variables
  public branchList!: any[];
  public gradeList!: any[];
  public departMentList!: any[];
  public designationList!: any[];
  public costCenterList!: any[];
  public projectList!: any[];
  public categoryList!: any[];
  public reportingList!: any[];
  public subscription!: any;
  public employeeData!: any;
  public employeeListById: any;
  public employeeNameSample: any = '';
  public aadharCantBemoreThan12: Boolean = false;
  public searchModel: string = '';
  public bankMasterList: any;
  public submitted: boolean = false;
  public workflowList: any = [];
  public nationalityList: any = [];
  public requiredErrorText = 'can\'t be blank';
  public noticePeriodList: any = [15, 30, 45, 60, 75, 90];
  public role: any = '';
  constructor(private formBuilder: FormBuilder, public datePipe: DatePipe, private alertService: NotifierService,
    public location: Location, private addEmployeeService: AddEmployeeService,
    private employeMasterService: EmployeeMastersService, private notification: NotifierService,
    private spinner: NgxSpinnerService, public crudOperationsService: CrudOperationsService) { }
  ngOnInit(): void {
    this.role = sessionStorage.getItem("role");
    this.companyId = Number(sessionStorage.getItem('companyId'));
    this.employeeId = Number(sessionStorage.getItem('Edit-employeeId'));
    this.loginemployeeId = Number(sessionStorage.getItem('empId'));
    this.addEmployeeForm = this.formBuilder.group({
      EmployeeCode: ['', Validators.required],
      EmployeeName: [],
      Title: [''],
      FirstName: ['', Validators.required],
      ExternalReportingHeadMail: [''],
      clientName: [''],
      MiddleName: [],
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
      TypeApplicable: [false],
      PfApplicable: [false],
      PfApplicableDate: [''],
      PfNumber: [],
      UanNo: [],
      internationalWorker: [false],
      EsicApplicable: [false],
      EsicApplicableDate: [],
      EsisNumber: [],
      PtApplicable: [false],
      DataOfLeaving: [false],
      noticePeriod: [false],
      Nationality:[null, Validators.required],
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
    });
    this.fetchBankMasterList();
    //date of leaving modelpopup
    this.leavingDatemodelPopup();
    //branchMaster List
    this.fetchBranchDetailsList();
    //get designation list
    this.fetchGradeList();
    //get departmentList
    this.fetchDepartmentList();
    //get designation list
    this.fetchDesignationList();
    //get costcenter list
    this.fetchCostCenterList();
    //get costcenter list
    this.fetchProjectList();
    //get categoryMaster list
    this.fetchCategoryList()
    //reporting Employees
    this.getReportingEmployeesById(this.employeeId, this.companyId);
    //get EmployeeDetails ById
    this.getEmployeeDetailsById(this.employeeId);
    // //disable payment mode
    // this.disablePaymentMode();
    //disable pfBlock
    this.disbalePfblock();
    //disable esisBlock
    this.disableEsicBlock();

    this.fetchNationalites();

    this.crudOperationsService.getList("approvalworkflow/approvalworkflow_list/1/?search=&page=&size=500").subscribe((data: any) => {
      this.workflowList = data.data.content;
    });
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

  if(this.employeeId == this.loginemployeeId){
    this.addEmployeeForm.get('EmployeeName')?.disable();
    this.addEmployeeForm.get('Title')?.disable();
    this.addEmployeeForm.get('FirstName')?.disable();
    this.addEmployeeForm.get('LastName')?.disable();
    this.addEmployeeForm.get('MiddleName')?.disable();
    this.addEmployeeForm.get('FatherName')?.disable();
    this.addEmployeeForm.get('Gender')?.disable();

    this.addEmployeeForm.get('Nationality')?.disable();
    this.addEmployeeForm.get('PanNo')?.disable();
    this.addEmployeeForm.get('AadhaarNo')?.disable();
    this.addEmployeeForm.get('VoterId')?.disable();

    this.addEmployeeForm.get('EmployeeCode')?.disable();
    this.addEmployeeForm.get('ExternalReportingHeadMail')?.disable();
    this.addEmployeeForm.get('clientName')?.disable();
    this.addEmployeeForm.get('PaymentMode')?.disable();
    this.addEmployeeForm.get('BankName')?.disable();
    this.addEmployeeForm.get('AccountNo')?.disable();
    this.addEmployeeForm.get('IfscCode')?.disable();
    this.addEmployeeForm.get('AccountName')?.disable();
    this.addEmployeeForm.get('DateOfJoining')?.disable();
    this.addEmployeeForm.get('provisionDate')?.disable();
    this.addEmployeeForm.get('contractEndDate')?.disable();
    this.addEmployeeForm.get('dateOfIssueEP')?.disable();

    this.addEmployeeForm.get('dateOfExpiryEP')?.disable();
    this.addEmployeeForm.get('TypeApplicable')?.disable();
    this.addEmployeeForm.get('PfApplicable')?.disable();
    this.addEmployeeForm.get('PfApplicableDate')?.disable();
    this.addEmployeeForm.get('PfNumber')?.disable();
    this.addEmployeeForm.get('UanNo')?.disable();
    this.addEmployeeForm.get('internationalWorker')?.disable();
    this.addEmployeeForm.get('EsicApplicable')?.disable();
    this.addEmployeeForm.get('EsicApplicableDate')?.disable();
    this.addEmployeeForm.get('EsisNumber')?.disable();
    this.addEmployeeForm.get('PtApplicable')?.disable();
    this.addEmployeeForm.get('DataOfLeaving')?.disable();
    this.addEmployeeForm.get('noticePeriod')?.disable();

    this.addEmployeeForm.get('Branch')?.disable();
    this.addEmployeeForm.get('Grade')?.disable();
    this.addEmployeeForm.get('Department')?.disable();
    this.addEmployeeForm.get('DepartmentHead')?.disable();
    this.addEmployeeForm.get('Desiganion')?.disable();
    this.addEmployeeForm.get('CostCenter')?.disable();
    this.addEmployeeForm.get('Project')?.disable();
    this.addEmployeeForm.get('Category')?.disable();
    this.addEmployeeForm.get('ReportingHead')?.disable();
    this.addEmployeeForm.get('workflow')?.disable();
    this.addEmployeeForm.get('DateOfCommunications')?.disable();
  }
    
    




  }
  get form_() { return this.addEmployeeForm.controls; };

  /* Employee-Masters Fuctional Call*/
  fetchBranchDetailsList() {
    //getting companyId from session-storage
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
  fetchDepartmentList2() {
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
  //get deepartmentList
  fetchDepartmentList() {
    return this.employeMasterService.getDepartmentList(this.companyId)
      .subscribe((data: any) => {
        this.departMentList = data.data.content;
      }
        ,
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
  //   console.log('this.paymentMode, ',this.paymentMode)
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
    //alert(pfValue);
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
  getReportingEmployeesById(id: number, companyId: number) {
    return this.addEmployeeService.getReportingEmployeeById(id, companyId)
      .subscribe((data: any) => {
        this.reportingList = data.data;
      })
  }
  getEmployeeDetailsById(id: number) {
    //calling spinner
    this.spinner.show();
    this.addEmployeeService.getEmployeeById(id)
      .subscribe((data: any) => {
        this.employeeListById = data.data;
        let dateOfJoining = this.employeeListById.dateOfJoining ? new Date(this.employeeListById.dateOfJoining) : '';
        let dateOfJoiningConfirmation = this.employeeListById.dateOfJoiningConfirmation ? new Date(this.employeeListById.dateOfJoiningConfirmation) : '';
        let provisionDate = this.employeeListById.provisionDate ? new Date(this.employeeListById.provisionDate) : '';
        let contractEndDate = this.employeeListById.contractEndDate ? new Date(this.employeeListById.contractEndDate) : '';
        let dateOfIssueEP = this.employeeListById.dateOfIssueEP ? new Date(this.employeeListById.dateOfIssueEP) : '';
        let dateOfExpiryEP = this.employeeListById.dateOfExpiryEP ? new Date(this.employeeListById.dateOfExpiryEP) : '';
        let dob = new Date(this.employeeListById.dob);
        let esicApplicableDate = this.employeeListById.esicApplicableDate ? new Date(this.employeeListById.esicApplicableDate) : '';
        let pfApplicableDate = this.employeeListById.pfApplicableDate ? new Date(this.employeeListById.pfApplicableDate) : '';
        let nationalityId = this.employeeListById.nationality ? this.employeeListById.nationality.nationalityId : null;
        let typeapplicable = this.employeeListById.typeApplicable && this.employeeListById.typeApplicable;
        if (this.employeeListById.projectMaster != null) sessionStorage.setItem("projectid",this.employeeListById.projectMaster.projectName);
        
        if (this.employeeListById.projectMaster == null) {
          this.addEmployeeForm.patchValue({
            EmployeeCode: this.employeeListById.employeeCode,
            EmployeeName: this.employeeListById.firstName,
            Title: this.employeeListById.title,
            FirstName: this.employeeListById.firstName,
            ExternalReportingHeadMail: this.employeeListById.externalReportingHeadMail,
            clientName: this.employeeListById.clientName,
            MiddleName: this.employeeListById.middleName,
            LastName: this.employeeListById.lastName,
            Gender: this.employeeListById.gender,
            FatherName: this.employeeListById.fatherName,
            MotherName: this.employeeListById.motherName,
            SpouseName: this.employeeListById.spouseName,
            PanNo: this.employeeListById.panNo,
            AadhaarNo: this.employeeListById.adhaarNo,
            VoterId: this.employeeListById.voterId,
            PaymentMode: this.employeeListById.paymentMode ? this.employeeListById.paymentMode : null,
            BankName: this.employeeListById?.bankId?.bankId,
            AccountNo: this.employeeListById.accountNumber,
            IfscCode: this.employeeListById.ifsc,
            AccountName: this.employeeListById.accountName,
            DataOfBirth: dob,
            DateOfJoining: dateOfJoining,
            DateOfCommunications: dateOfJoiningConfirmation,
            provisionDate: provisionDate,
            contractEndDate: contractEndDate,
            dateOfIssueEP: dateOfIssueEP,
            dateOfExpiryEP: dateOfExpiryEP,
            TypeApplicable: this.employeeListById.typeApplicable,
            PfApplicable: this.employeeListById.pfApplicable,
            PfApplicableDate: pfApplicableDate,
            PfNumber: this.employeeListById.pfNumber,
            UanNo: this.employeeListById.uanNo,
            internationalWorker: this.employeeListById.isInternationalWorker,
            EsicApplicable: this.employeeListById.esicApplicable,
            EsicApplicableDate: esicApplicableDate,
            EsisNumber: this.employeeListById.esicNumber,
            PtApplicable: this.employeeListById.ptApplicable,
            DataOfLeaving: this.employeeListById,
            noticePeriod: this.employeeListById.noticePeriod,
            Branch: this.employeeListById.branchDetail.companyBranchDetailsId,
            Grade: this.employeeListById.gradeMaster.gradeId,
            Department: this.employeeListById.department.departmentId,
            DepartmentHead: this.employeeListById.departmentHead,
            Desiganion: this.employeeListById.designation.designationId,
            CostCenter: this.employeeListById.costCenterMaster.costCenterId,
            Nationality: nationalityId,
            Category: this.employeeListById.categoryMaster.categoryId,
            ReportingHead: this.employeeListById.reportingHeadId,
            workflow: this.employeeListById.workflow

          })
        } else {
          this.addEmployeeForm.patchValue({
            EmployeeCode: this.employeeListById.employeeCode,
            EmployeeName: this.employeeListById.firstName,
            Title: this.employeeListById.title,
            FirstName: this.employeeListById.firstName,
            ExternalReportingHeadMail: this.employeeListById.externalReportingHeadMail,
            clientName: this.employeeListById.clientName,
            MiddleName: this.employeeListById.middleName,
            LastName: this.employeeListById.lastName,
            Gender: this.employeeListById.gender,
            FatherName: this.employeeListById.fatherName,
            MotherName: this.employeeListById.motherName,
            SpouseName: this.employeeListById.spouseName,
            PanNo: this.employeeListById.panNo,
            AadhaarNo: this.employeeListById.adhaarNo,
            VoterId: this.employeeListById.voterId,
            PaymentMode: this.employeeListById.paymentMode ? this.employeeListById.paymentMode : null,
            BankName: this.employeeListById?.bankId?.bankId,
            AccountNo: this.employeeListById.accountNumber,
            IfscCode: this.employeeListById.ifsc,
            AccountName: this.employeeListById.accountName,
            DataOfBirth: dob,
            DateOfJoining: dateOfJoining,
            DateOfCommunications: dateOfJoiningConfirmation,
            provisionDate: provisionDate,
            contractEndDate: contractEndDate,
            dateOfIssueEP: dateOfIssueEP,
            dateOfExpiryEP: dateOfExpiryEP,
            TypeApplicable: typeapplicable,
            PfApplicable: this.employeeListById.pfApplicable,
            PfApplicableDate: pfApplicableDate,
            PfNumber: this.employeeListById.pfNumber,
            UanNo: this.employeeListById.uanNo,
            internationalWorker: this.employeeListById.isInternationalWorker,
            EsicApplicable: this.employeeListById.esicApplicable,
            EsicApplicableDate: esicApplicableDate,
            EsisNumber: this.employeeListById.esicNumber,
            PtApplicable: this.employeeListById.ptApplicable,
            DataOfLeaving: this.employeeListById,
            noticePeriod: this.employeeListById.noticePeriod,
            Branch: this.employeeListById.branchDetail.companyBranchDetailsId,
            Grade: this.employeeListById.gradeMaster.gradeId,
            Department: this.employeeListById.department.departmentId,
            DepartmentHead: this.employeeListById.departmentHead,
            Desiganion: this.employeeListById.designation.designationId,
            CostCenter: this.employeeListById.costCenterMaster.costCenterId,
            Project: this.employeeListById.projectMaster.projectId,
            Category: this.employeeListById.categoryMaster.categoryId,
            ReportingHead: this.employeeListById.reportingHeadId,
            workflow: this.employeeListById.workflow,
            Nationality: nationalityId,
          })
        }
        //spinner hide
        this.spinner.hide();
        if(this.employeeListById.typeApplicable === "true"){
          this.addEmployeeForm.patchValue({
            TypeApplicable: true
          })
        }
        if(this.employeeListById.typeApplicable === "false"){
          this.addEmployeeForm.patchValue({
            TypeApplicable: false
          })
        }
  
        this.namechange(this.employeeListById.title, this.employeeListById.firstName, this.employeeListById.middleName, this.employeeListById.lastName);
      })
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
    console.log(this.submitted, this.addEmployeeForm.valid, this.aadharCantBemoreThan12)
    if (this.addEmployeeForm.valid && !this.aadharCantBemoreThan12) {
      console.log(this.addEmployeeForm.value);
      //spinner show
      this.spinner.show();
      let dateOfJoining = new Date(this.addEmployeeForm.value.DateOfJoining);
      let dateOfJoiningConfirmation = new Date(this.addEmployeeForm.value.DateOfCommunications);
      let provisionDate = this.addEmployeeForm.value.provisionDate ? new Date(this.addEmployeeForm.value.provisionDate) : '';
      let dateOfIssueEP = new Date(this.addEmployeeForm.value.dateOfIssueEP);
      let dateOfExpiryEP = new Date(this.addEmployeeForm.value.dateOfExpiryEP);
      let dob = new Date(this.addEmployeeForm.value.DataOfBirth);
      let esicApplicableDate = new Date(this.addEmployeeForm.value.EsicApplicableDate);
      let pfApplicableDate = new Date(this.addEmployeeForm.value.PfApplicableDate);
      if (this.addEmployeeForm.value.Project == null) {
        this.employeeObject =
        {
          "employeeId": this.employeeListById.employeeId,
          "accountName": this.addEmployeeForm.value.AccountName,
          "accountNumber": this.addEmployeeForm.value.AccountNo,
          "adhaarNo": this.addEmployeeForm.value.AadhaarNo,
          "attendanceCode": this.addEmployeeForm.value.AttenceCode,
          "bankId": {
            "bankId": this.addEmployeeForm.value.BankName
          },
          //"dateOfJoining": this.datePipe.transform(this.addEmployeeForm.value.DateOfJoining, 'dd-MM-yyyy'),
          "dateOfJoining": dateOfJoining,
          "dateOfJoiningConfirmation": dateOfJoiningConfirmation,
          "provisionDate": provisionDate,
          "dob": dob,
          "employeeCode": this.addEmployeeForm.value.EmployeeCode,
          "esicApplicable": this.addEmployeeForm.value.EsicApplicable,
          "esicApplicableDate": esicApplicableDate,
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
          "typeApplicable": this.addEmployeeForm.value.TypeApplicable,
          "pfApplicable": this.addEmployeeForm.value.PfApplicable,
          "pfApplicableDate": pfApplicableDate,
          "pfNumber": this.addEmployeeForm.value.PfNumber,
          "ptApplicable": this.addEmployeeForm.value.PtApplicable,
          "reportingHeadId": this.addEmployeeForm.value.ReportingHead,
          "workflow": this.addEmployeeForm.value.workflow,
          "spouseName": this.addEmployeeForm.value.SpouseName,
          "contractEndDate": this.addEmployeeForm.value.contractEndDate,
          "title": this.addEmployeeForm.value.Title,
          "uanNo": this.addEmployeeForm.value.UanNo,
          "voterId": this.addEmployeeForm.value.VoterId,
          "gender": this.addEmployeeForm.value.Gender,
          "createdBy": this.employeeListById.createdBy,
          "createdDate": this.employeeListById.createdDate,
          "createdSystemIp": this.employeeListById.createdSystemIp,
          "isDeleted": this.employeeListById.isDeleted,
          "salaryStatus": this.employeeListById.salaryStatus,
          "noticePeriod": this.addEmployeeForm.value.noticePeriod,
          "status": "Active",

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
          "nationality": {
            "nationalityId": this.addEmployeeForm.value.Nationality
          },
        }
      } else {
        this.employeeObject =
        {
          "employeeId": this.employeeListById.employeeId,
          "accountName": this.addEmployeeForm.value.AccountName,
          "accountNumber": this.addEmployeeForm.value.AccountNo,
          "adhaarNo": this.addEmployeeForm.value.AadhaarNo,
          "attendanceCode": this.addEmployeeForm.value.AttenceCode,
          "bankId": {
            "bankId": this.addEmployeeForm.value.BankName
          },
          //"dateOfJoining": this.datePipe.transform(this.addEmployeeForm.value.DateOfJoining, 'dd-MM-yyyy'),
          "dateOfJoining": dateOfJoining,
          "dateOfJoiningConfirmation": dateOfJoiningConfirmation,
          "provisionDate": provisionDate,
          "dob": dob,
          "employeeCode": this.addEmployeeForm.value.EmployeeCode,
          "esicApplicable": this.addEmployeeForm.value.EsicApplicable,
          "esicApplicableDate": esicApplicableDate,
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
          "typeApplicable": this.addEmployeeForm.value.TypeApplicable,
          "pfApplicable": this.addEmployeeForm.value.PfApplicable,
          "pfApplicableDate": pfApplicableDate,
          "pfNumber": this.addEmployeeForm.value.PfNumber,
          "ptApplicable": this.addEmployeeForm.value.PtApplicable,
          "reportingHeadId": this.addEmployeeForm.value.ReportingHead,
          "workflow": this.addEmployeeForm.value.workflow,
          "contractEndDate": this.addEmployeeForm.value.contractEndDate,
          "spouseName": this.addEmployeeForm.value.SpouseName,
          "title": this.addEmployeeForm.value.Title,
          "uanNo": this.addEmployeeForm.value.UanNo,
          "voterId": this.addEmployeeForm.value.VoterId,
          "gender": this.addEmployeeForm.value.Gender,
          "createdBy": this.employeeListById.createdBy,
          "createdDate": this.employeeListById.createdDate,
          "createdSystemIp": this.employeeListById.createdSystemIp,
          "isDeleted": this.employeeListById.isDeleted,
          "salaryStatus": this.employeeListById.salaryStatus,
          "noticePeriod": this.addEmployeeForm.value.noticePeriod,
          "status": "Active",

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
          },
          "nationality": {
            "nationalityId": this.addEmployeeForm.value.Nationality
          },
        }
      }

      this.addEmployeeService.updateEmployee(this.employeeObject, this.employeeListById.employeeId)
        .subscribe((data: any) => {
          this.alertService.notify('success', data.message);
          //this.addEmployeeForm.reset();
          //get EmployeeDetails ById
          this.getEmployeeDetailsById(this.employeeId);
          this.submitted = false;
          this.namechange(this.addEmployeeForm.value.Title, this.addEmployeeForm.value.FirstName, this.addEmployeeForm.value.MiddleName, this.addEmployeeForm.value.LastName);
          this.aadharCantBemoreThan12 = false;
        },
          (error) => {
            console.log(error);
            this.alertService.notify('error', "Something went wrong");
            //spinner hide
            this.spinner.hide();
            this.aadharCantBemoreThan12 = false;
          }
        )
    }
  }

  namechange(title: any, firstName: any, middleName: any, lastName: any) {
    let arr: [] = this.getNameArray(title, firstName, middleName, lastName);
    this.employeeNameSample = arr.join(" ");
  }
  getNameArray(title: any, firstName: any, middleName: any, lastName: any): any {
    let arr = [];
    if (title) arr.push(title);
    if (firstName) arr.push(firstName);
    if (middleName) arr.push(middleName);
    if (lastName) arr.push(lastName);
    return arr;
  }
  handleNamechange() {
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
