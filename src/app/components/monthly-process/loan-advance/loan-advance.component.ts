import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NotifierService } from 'angular-notifier';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-loan-advance',
  templateUrl: './loan-advance.component.html',
  styleUrls: ['./loan-advance.component.css']
})
export class LoanAdvanceComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, public datePipe: DatePipe, private spinner: NgxSpinnerService,
    public crudOperationsService: CrudOperationsService, private notification: NotifierService) { }
  @ViewChild('scrollMe') private myScrollContainer: any;

  public headers: any = ["Code", "Name", "Branch", "Department", "Designation", "Division", "Grade", "Category", "Project"];
  public employees: any = [];
  public headerLoan: any = ["Type", "Loan Name", "Applied Date", "Budget Limit", "Amount Required", "EMI Calculated field", "Tenure Months", "Start Recovery From", "Status", "Purpose", "Docs", "Actions"];
  public headerAdvacne: any = ["Type", "Advance Name", "Applied Date", "Budget Limit", "Amount Required", "EMI Calculated field", "Tenure Months", "Start Recovery From", "Status", "Purpose", "Docs", "Actions"];

  public employees2: any = [];
  public employees3: any = [];
  public companyId!: number;
  highlightRow!: any;
  // showSS: boolean = false;
  public saveAlert: boolean = false;
  public employeeId!: any;

  public editButtonEnable!: boolean;
  public loanObject!: any;
  public installmentAmount: any;

  public loanAmount: any;
  public installmentMonths: any;
  public year: any;
  public month: any;
  public loanDate: any;
  public loanType: any;
  public status: any;
  public remarks: any;
  public id: any;
  public searchModel = '';
  public loanData: any = [];
  public advanceData: any = [];
  public document: any = {};
  public loanAdvType: any = '';
  public submitProcessing = false;
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public selectedPaymentDate: any;
  public now = new Date();
  public empId: any = Number(sessionStorage.getItem('empId'));

  p: number = 1;
  //pagination
  itemsPerPage: any = 20;
  totalItems: any;
  currentPage: any;
  totalElements: number = 0;
  showingFrom: number = 0;
  showingTo: number = 0;
  public pageNumber: Number = 0;

  public loanForm = this.formBuilder.group({
    // loanAdvType: [],
    loanType: [''],
    appliedDate: [''],
    budgetLimit: [''],
    amountRequired: [''],
    // noOfInstallment: [''],
    emiCalculatedField: [''],
    workPeriod: [''],
    workPeriodyear: [''],
    workPeriodMonth: [''],
    year: [""],
    month: [""],
    installmentMonths: [''],
    status: ["Active"],
    purpose: [""],
    selectedFile: [""],
    paymentAmount: ['', Validators.required],
    paymentDate: ['', Validators.required],
    totalDue: ['']
  })

  ngOnInit(): void {
    this.companyId = Number(sessionStorage.getItem('companyId'));
    this.getAllEmployees();
  }

  getAllEmployees() {
    this.spinner.show();
    let api = 'employee/search-list/' + this.companyId + '?search=' + this.searchModel + '&page=' + this.pageNumber + '&size=20';
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      console.log(data, "===data");
      this.employees = data.data.content;
      //pagination call
      this.handlePagination(data);
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }
  handlePagination(data: any) {
    this.totalElements = data.data.totalElements;
    this.itemsPerPage = 20;
    this.currentPage = data.data.pageable.pageNumber + 1;
    this.totalItems = (data.data.totalPages) * this.itemsPerPage;
    this.showingFrom = (data.data.pageable.pageNumber * this.itemsPerPage) + 1;
    const to = (data.data.pageable.pageNumber + 1) * this.itemsPerPage;
    if (this.totalElements >= to) {
      this.showingTo = to;
    } else {
      this.showingTo = this.totalElements;
    }
  }
  pageChanged(event: any) {
    this.pageNumber = event - 1;
    this.loanData = [];
    this.advanceData = [];
    this.getAllEmployees();
  }

  clickedRow(index: Number, employeeId: any) {
    this.employeeId = employeeId;
    this.loanData = [];
    this.advanceData = [];
    if (this.highlightRow === index) {
      this.highlightRow = undefined;
    }
    else {
      this.highlightRow = index;
      this.fetchAppliedLoanAdvByEmp(this.employeeId);
    }
  }

  fetchAppliedLoanAdvByEmp(employeeId: any) {
    this.spinner.show();
    this.loanData = [];
    this.advanceData = [];
    let api = "employeeloanadvance/list?employeeId=" + employeeId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      let result = data.data;
      result.forEach((e: any) => {
        if (e.loanOrAdvType == 'Loan') {
          this.loanData.push(e);
        }
        if (e.loanOrAdvType == 'Advance') {
          this.advanceData.push(e);
        }
      });
      window.scroll(500, 500);
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }

  modelShow() {

    this.loanForm.reset();
    //hide edit button
    this.id = 0;
    this.editButtonEnable = false;

  }

  modelShowEdit(data: any) {
    //this.loanForm.reset();

    this.id = data.employeeLoanAdvanceId;
    this.editButtonEnable = true;
    this.loanAdvType = data.loanOrAdvType;
    this.loanForm.controls['amountRequired'].patchValue(data.loanAmount);
    let date = this.datePipe.transform(data.appliedDate, 'dd-MM-yyyy');
    this.loanForm.controls['appliedDate'].patchValue(date);
    this.loanForm.controls['loanType'].patchValue(data.loanTypeId.loanName);
    this.loanForm.controls['purpose'].patchValue(data.purpose);
    this.loanForm.controls['status'].patchValue(data.status);
    this.loanForm.controls['budgetLimit'].patchValue(data.budgetLimit);
    this.loanForm.controls['workPeriodyear'].patchValue(data.workPeriod.year);
    this.loanForm.controls['workPeriodMonth'].patchValue(data.workPeriod.month);
    this.loanForm.controls['year'].patchValue(data.startrecoveryfrom.year);
    this.loanForm.controls['month'].patchValue(data.startrecoveryfrom.month);
    this.loanForm.controls['emiCalculatedField'].patchValue(data.emiCalculatedField);
    this.loanForm.controls['installmentMonths'].patchValue(data.installmentMonths);
    this.loanForm.controls['totalDue'].patchValue(data.balanceAmount);
    (<any>$('#employeeModelPopup')).modal('show');
  }

  search() {
    this.getAllEmployees();
  }

  downloadDocumentAttachment(filePath: string, fileName: string) {
    let downloadApi = 'employeeloanadvance/document_download?filePath=' + filePath;
    this.crudOperationsService.downloadDocument(downloadApi)
      .subscribe((response: any) => {
        let blob: any = new Blob([response], { type: "application/octet-stream" }); // must match the Accept type
        const filename = fileName;
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        console.log(fileName)
        anchor.download = filename;
        anchor.href = url;
        anchor.click();
      },
        (error) => {
          this.notification.notify('error', 'Error while downloading the file');
        }
      )
  }
  viewDocument(doc: any, data: any) {
    this.id = data.employeeLoanAdvanceId;
    (<any>$('#donwload_doc')).modal('show');
    this.document = doc;
  }

  submit() {
    this.submitted = true;
    console.log(this.loanForm.value)
    for (let el in this.loanForm.controls) {
      if (this.loanForm.controls[el].errors) {
        console.log(el)
      }
    }
    if (this.loanForm.valid) {
      let formData = this.getFormData();
      this.update(formData, `employeeloanadvance/updateLoan/${this.id}`);
    }
  }
  update(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.update(formData, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        (<any>$('#employeeModelPopup')).modal('hide');
        this.submitProcessing = false;
        this.fetchAppliedLoanAdvByEmp(this.employeeId);
        this.clear();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }
  getFormData(): any {
    let data = {
      paymentAmount: this.loanForm.value.paymentAmount,
      paymentDate: this.loanForm.value.paymentDate,
      employee: {
        "employeeId": this.empId
      }
    }
    return data;
  }

  clear() {
    this.submitted = false;
    this.loanForm.controls['paymentAmount'].patchValue('');
    this.loanForm.controls['paymentDate'].patchValue('');
  }

  onAppliedDateValueChange(event: any) {
    this.selectedPaymentDate = new Date(event);
  }
}
