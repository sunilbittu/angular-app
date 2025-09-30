import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-loan-type',
  templateUrl: './loan-type.component.html',
  styleUrls: ['./loan-type.component.css']
})
export class LoanTypeComponent implements OnInit {

  public candidateStatuses: any = ["Screening & Evaluation"]
  public headers: any = ["Loan Id", "Loan Name", "Type", "Limit", "Repayment Mode", "Retention(Years)", "Action"]
  public editButtonEnable: boolean = true;
  public candidateData: any[] = [];
  public candidateObject: any;
  public candidetId!: number;
  public togglebtn: boolean = true;
  public loanObject: any;
  public editStatusbtn: boolean = false;
  public toDay = new Date();
  public newResourceIndent: any = {};
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public submitProcessing: boolean = false;
  public submitText: any = 'Save';
  public showExternal: boolean = false;
  public companyId = sessionStorage.getItem("companyId");
  workflowList: any;
  constructor(private formBuilder: FormBuilder, private crudOperationsService: CrudOperationsService,
    private notification: NotifierService, private datePipe: DatePipe, private spinner: NgxSpinnerService) { }


  ngOnInit(): void {
    this.fetchReferalRecruitment();
    this.fetchapprovalWorkflow();
  };

  LoanForm: any = this.formBuilder.group({
    loanName: ["", Validators.required],
    loanLimit: ["", Validators.min(0)],
    repaymentMode: ["", Validators.required],
    retentionYears: ["", Validators.required],
    description: ["", Validators.required],
    installmentsNumber: ["", Validators.required],
    approvalWorkflow: ["", Validators.required],
    typeOfLoan: ["", Validators.required]

  });
  get form_() { return this.LoanForm.controls; };
  addClick() {
    this.togglebtn = true;
    this.isLoanLimitInValid = false;
    this.LoanForm.reset();
    this.LoanForm = this.formBuilder.group({
      loanName: ["", Validators.required],
      loanLimit: ["", Validators.required],
      repaymentMode: ["", Validators.required],
      retentionYears: ["", Validators.required],
      description: ["", Validators.required],
      installmentsNumber: ["", Validators.required],
      approvalWorkflow: ["", Validators.required],
      typeOfLoan: ["", Validators.required]
    });
  }


  fetchReferalRecruitment() {
    this.spinner.show();
    let api = "loan_type/list?companyId=" + this.companyId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      if (data.data != null) {
        this.candidateData = data.data.content;
        this.candidateData.sort((a: any, b: any) => a.loanId - b.loanId)
      }
    },
      (_error) => {
        this.spinner.hide();
        this.notification.notify('error', 'Something Went Worng');
      })

  }
  fetchapprovalWorkflow() {
    this.crudOperationsService.getList("approvalworkflow/approvalworkflow_list?page=0&size=500").subscribe((data: any) => {
      this.workflowList = data.data.content;
    });
  }
  onSubmit() {
    this.submitted = true;
    if (this.LoanForm.valid && !this.isLoanLimitInValid) {
      this.loanObject = {
        "loanName": this.LoanForm.value.loanName,
        "loanLimit": this.LoanForm.value.loanLimit,
        "repaymentMode": this.LoanForm.value.repaymentMode,
        "retentionYears": this.LoanForm.value.retentionYears,
        "description": this.LoanForm.value.description,
        "installmentsNumber": this.LoanForm.value.installmentsNumber,
        "approvalWorkflow": { "id": this.LoanForm.value.approvalWorkflow },
        "company": { "companyId": this.companyId },
        "typeOfLoan": this.LoanForm.value.typeOfLoan
      }
      console.log(this.loanObject, "loanobject")
      this.crudOperationsService.create(this.loanObject, "loan_type").subscribe((data: any) => {
        this.submitted = false;
        (<any>$('#myModal-add')).modal('hide');
        this.fetchReferalRecruitment();
        this.LoanForm.reset();
      })
    }
  }

  checkthemodeOfRepayment() {
    console.log(this.LoanForm.value.repaymentMode, "dafasdfsa")
    if (this.LoanForm.value.repaymentMode == 'One Time') {
      this.LoanForm.controls['installmentsNumber'].disable({ onlySelf: true });
      this.LoanForm = this.formBuilder.group({
        loanName: [this.LoanForm.value.loanName, Validators.required],
        loanLimit: [this.LoanForm.value.loanLimit, Validators.required],
        repaymentMode: [this.LoanForm.value.repaymentMode, Validators.required],
        retentionYears: [this.LoanForm.value.retentionYears, Validators.required],
        description: [this.LoanForm.value.description, Validators.required],
        installmentsNumber: [1, Validators.required],
        approvalWorkflow: [this.LoanForm.value.approvalWorkflow, Validators.required],
        typeOfLoan: [this.LoanForm.value.typeOfLoan, Validators.required]
      });
    } else {
      this.LoanForm.controls['installmentsNumber'].enable({ onlySelf: true });
      this.LoanForm = this.formBuilder.group({
        loanName: [this.LoanForm.value.loanName, Validators.required],
        loanLimit: [this.LoanForm.value.loanLimit, Validators.required],
        repaymentMode: [this.LoanForm.value.repaymentMode, Validators.required],
        retentionYears: [this.LoanForm.value.retentionYears, Validators.required],
        description: [this.LoanForm.value.description, Validators.required],
        installmentsNumber: [this.LoanForm.value.installmentsNumber, Validators.required],
        approvalWorkflow: [this.LoanForm.value.approvalWorkflow, Validators.required],
        typeOfLoan: [this.LoanForm.value.typeOfLoan, Validators.required]
      });
    }
  }


  editCandidate(data: any) {
    this.submitText = 'Update';
    this.togglebtn = false;
    this.candidetId = data.loanId;
    this.LoanForm = this.formBuilder.group({
      loanName: [data.loanName, Validators.required],
      loanLimit: [data.loanLimit, Validators.required],
      repaymentMode: [data.repaymentMode, Validators.required],
      retentionYears: [data.retentionYears, Validators.required],
      description: [data.description, Validators.required],
      installmentsNumber: [data.installmentsNumber, Validators.required],
      approvalWorkflow: [data.approvalWorkflow.id, Validators.required],
      typeOfLoan: [data.typeOfLoan, Validators.required]
    });
  };

  updateReferalRecruitment() {
    this.submitted = true;
    if (this.LoanForm.valid && !this.isLoanLimitInValid) {
      let api: any = "loan_type/" + this.candidetId;
      this.loanObject = {
        "loanName": this.LoanForm.value.loanName,
        "loanLimit": this.LoanForm.value.loanLimit,
        "repaymentMode": this.LoanForm.value.repaymentMode,
        "retentionYears": this.LoanForm.value.retentionYears,
        "description": this.LoanForm.value.description,
        "installmentsNumber": this.LoanForm.value.installmentsNumber,
        "typeOfLoan": this.LoanForm.value.typeOfLoan,
        "approvalWorkflow": { "id": this.LoanForm.value.approvalWorkflow },
        "company": { "companyId": this.companyId }
      }
      this.crudOperationsService.update(this.loanObject, api).subscribe((data: any) => {
        this.submitted = false;
        (<any>$('#myModal-add')).modal('hide');
        this.fetchReferalRecruitment();
        this.togglebtn = true;
        this.LoanForm.reset();
      })
    }
  };

  removeCandidate(candidetId: number) {
    this.candidetId = candidetId;
  }

  deleteCandidate() {
    let api: any = "loan_type/" + this.candidetId;
    this.crudOperationsService.delete(api).subscribe((data: any) => {
      this.fetchReferalRecruitment();
    })
  };
  clear() {
    this.LoanForm.reset();
    this.submitText = 'Save';
    this.submitted = false;
    this.isLoanLimitInValid = false;
  }
  public isLoanLimitInValid = false;
  changeLimit() {
    this.isLoanLimitInValid = this.LoanForm.value.loanLimit < 1000;
  }







}
