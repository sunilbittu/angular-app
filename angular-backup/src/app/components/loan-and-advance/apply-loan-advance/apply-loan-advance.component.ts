import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-apply-loan-advance',
  templateUrl: './apply-loan-advance.component.html',
  styleUrls: ['./apply-loan-advance.component.css']
})
export class ApplyLoanAdvanceComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService,
    public crudOperationsService: CrudOperationsService, private notification: NotifierService) { }

  public months: any = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  public years: any = [];
  public headers2: any = ["Type", "Loan/Advance Name", "Applied Date", "Budget Limit", "Amount Required", "EMI Calculated field", "Tenure Months", "Start Recovery From", "Status", "Purpose", "Docs", "Actions"];
  public loanTypes: any = [];
  public tenures: any = [];
  public statusList: any = ["Active"];

  public employees2: any = [];
  public companyId!: number;
  public employeeId: any = Number(sessionStorage.getItem('empId'));

  public editButtonEnable!: boolean;
  public loanObject!: any;
  public installmentAmount: any;
  public isLoanTypeApplicable:boolean=true;
  public loanAmount: any;
  public installmentMonths: any;
  public year: any;
  public month: any;
  public loanDate: any;
  public loanType: any;
  public status: any = 'Active';
  public purpose: any;
  public id: any;
  public searchModel = '';
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public selectedAppliedDate: any;
  public now = new Date();
  public selectedFile: any;
  public imageFileName: any;
  public filePath: any;
  public fileSelected: boolean = false;
  public document: any = {};
  public submitText = '';
  public api = 'employeeloanadvance'
  public submitProcessing = false;
  public selectedFile1: any;
  public loanAdvType: any = '';
  public year1 = this.now.getFullYear();
  public employeeDetails: any = {};
  public submitted1: boolean = false;
  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public confirmClicked = false;
  public cancelClicked = false;
  public isSubmitDisabled: boolean = false;
  public submitErrorText: any = '';
  public initialValue: number = 0;
  public loanForm = this.formBuilder.group({
    // loanAdvType: [, Validators.required],
    loanType: ['', Validators.required],
    appliedDate: ['', Validators.required],
    budgetLimit: [''],
    amountRequired: [0, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    // noOfInstallment: ['', Validators.required],
    emiCalculatedField: [''],
    workPeriod: [''],
    workPeriodyear: [''],
    workPeriodMonth: [''],
    year: [" ", Validators.required],
    month: [" ", Validators.required],
    installmentMonths: ['', Validators.required],
    status: ["Active"],
    purpose: [" "],
    selectedFile: [""]
  })

  get form_() { return this.loanForm.controls; };

  ngOnInit(): void {
    this.companyId = Number(sessionStorage.getItem('companyId'));
    this.getAppliedLoanAndAdvance();
    this.getEmpDetails();
  }

  getEmpDetails() {
    this.crudOperationsService.getList('employee/get_employee_by_id/' + this.employeeId)
      .subscribe((data: any) => {
        this.employeeDetails = data.data;
      });
  }
  setJoiningData() {
    let doj = new Date(this.employeeDetails.dateOfJoining);
    var todayDate = new Date();
    let dojyear = todayDate.getFullYear() - doj.getFullYear();
    let dojmonth = todayDate.getMonth() - doj.getMonth();
    var dojday = todayDate.getDate() - doj.getDate();

    if (dojmonth <= 0) {
      dojyear--;
      dojmonth = (12 + dojmonth);
    }
    if (todayDate < doj) {
      dojmonth--;
      dojday = 30 + dojday;
    }
    if (dojmonth == 12) {
      dojyear = dojyear + 1;
      dojmonth = 0;
    }
    this.loanForm.controls['workPeriodyear'].patchValue(dojyear + ' Year(s)');
    this.loanForm.controls['workPeriodMonth'].patchValue(dojmonth + ' Month(s)');
    console.log("Age in Year:" + dojyear + ',' + 'Month:' + dojmonth + ',' + 'Day:' + dojday);
  }
  getAppliedLoanAndAdvance() {
    this.spinner.show();
    let api = this.api + "/list-by-id?employeeId=" + this.employeeId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.employees2 = data.data.content;
      this.spinner.hide();
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
    this.submitText = 'Save';
    this.loanAdvType = 'Loan';
    this.isSubmitDisabled = false;
    this.submitErrorText = '';
    this.handleType(this.loanAdvType);
    this.setJoiningData();
    this.years = [];
    for (var i = this.year1; i > (this.year1 - 5); i--) {
      this.years.push(i);
    }
  }

  modelShowEdit(employee: any) {
    this.loanForm.reset();
    this.isSubmitDisabled = false;
    this.submitErrorText = '';
    this.fetchLoanTypes(employee.loanOrAdvType);
    this.tenures = [];
    let tens = [];
    for (let i = 1; i <= employee.loanTypeId.installmentsNumber; i++) {
      tens.push(i);
    }
    this.years = [];
    for (var i = this.year1; i > (this.year1 - 5); i--) {
      this.years.push(i);
    }
    this.tenures = tens;
    this.submitted = false;
    this.submitText = 'Update';
    this.id = employee.employeeLoanAdvanceId;
    // this.handleType(employee.loanOrAdvType);
    this.editButtonEnable = true;
    this.loanAdvType = employee.loanOrAdvType;
    this.loanType = employee.loanTypeId.loanId;
    this.loanForm.controls['budgetLimit'].patchValue(employee.budgetLimit);
    this.loanForm.controls['amountRequired'].patchValue(employee.loanAmount);
    this.loanForm.controls['appliedDate'].patchValue(new Date(employee.appliedDate));
    this.loanForm.controls['loanType'].patchValue(this.loanType);
    this.loanForm.controls['installmentMonths'].patchValue(employee.installmentMonths);
    this.loanForm.controls['emiCalculatedField'].patchValue(employee.emiCalculatedField);
    this.loanForm.controls['purpose'].patchValue(employee.purpose);
    this.loanAmount = employee.loanAmount;

    this.installmentAmount = employee.installmentAmount;
    this.year = employee.startrecoveryfrom.year;
    this.month = employee.startrecoveryfrom.month;
    this.purpose = employee.purpose;
    this.status = employee.status;
    this.setJoiningData();
    (<any>$('#employeeModelPopup')).modal('show');
    this.fileSelected = true;
  }

  handleType(type: any) {
    this.fetchLoanTypes(type);
  }
  validateApplyLoan(loanName: any, loanId: any) {
    this.crudOperationsService.getList(this.api + '/validate?employeeId=' +
      this.employeeId + '&type=' + this.loanAdvType + '&loanId=' + loanId).subscribe((data: any) => {
        if (!data.data) {
          this.isSubmitDisabled = true;
          this.submitErrorText = 'Oops! \n Your previous ' + this.loanAdvType.toUpperCase() +
            ' (' + loanName + ') ' + ' is still not Closed/Rejected, You can\'t apply ' + this.loanAdvType.toUpperCase();
        }
      });
  }

  checkValidation(){
    let url="approvalworkflow/workflowvalidation/"+this.employeeId+"/"+this.loanForm.value.loanType+"/Loan";
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      this.isLoanTypeApplicable=data.data;
    });
  }
  fetchLoanTypes(loanType: any) {
    this.loanType = null;
    this.loanTypes = [];
    this.amountRequiredIsValid = false;
    this.loanForm.controls['budgetLimit'].patchValue('');
    // this.loanForm.controls['amountRequired'].patchValue('');
    this.crudOperationsService.getList('loanmapping/dropdownList?employeeId=' +
      this.employeeId + '&type=' + loanType).subscribe((data: any) => {
        this.loanTypes = data.data;
      });
  }

  changeType(loanType: any) {
    this.loanTypes.forEach((e: any) => {
      if (e.loanId == loanType) {

        this.validateWorkPeriod(e.retentionYears);
        this.loanForm.controls['budgetLimit'].patchValue(e.loanLimit);
        this.installmentNumber = e.installmentsNumber;
        this.handleAmountReqValidation();
        let tens = [];
        for (let i = 1; i <= this.installmentNumber; i++) {
          tens.push(i);
        }
        this.tenures = tens;
        this.loanForm.controls['installmentMonths'].patchValue(this.installmentNumber);
        this.isSubmitDisabled = false;
        this.submitErrorText = '';
        this.validateApplyLoan(e.loanName, e.loanId);
      }
    });
  }

  validateWorkPeriod(retentionYears: any) {
    console.log('data >>>', retentionYears)
    let doj = new Date(this.employeeDetails.dateOfJoining);
    var todayDate = new Date();
    let dojyear = todayDate.getFullYear() - doj.getFullYear();
    let dojmonth = todayDate.getMonth() - doj.getMonth();

    if (dojmonth <= 0) {
      dojyear--;
      dojmonth = (12 + dojmonth);
    }
    if (dojmonth == 12) {
      dojyear = dojyear + 1;
      dojmonth = 0;
    }
    this.isSubmitDisabled = retentionYears > dojyear;
    this.submitErrorText = 'Retention Year is more than the Work Period, Please contact to Admin!';
  }

  public isAmountInValid = false;
  changeTennureMonths(ten: any) {
    let amount = this.loanForm.value.amountRequired;
    if (amount) {
      this.isAmountInValid = amount < 1;
      this.handleAmountReqValidation();
      let emiAmount = amount / ten;
      const result = this.roundTo(emiAmount, 2);
      this.loanForm.controls['emiCalculatedField'].patchValue(result);
    }
  }

  roundTo(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };

  onAppliedDateValueChange(event: any) {
    this.selectedAppliedDate = new Date(event);
  }

  public amountRequiredIsValid: boolean = false;
  public installmentNumber: any = 0;
  handleAmountReqValidation() {
    this.amountRequiredIsValid = false;
    let budgetLimit = this.loanForm.value.budgetLimit;
    let amount = this.loanForm.value.amountRequired;
    if (budgetLimit && amount) {
      this.amountRequiredIsValid = amount > budgetLimit;
    }
  }

  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    this.fileSelected = false;
  }

  onFileChanged1(event: any) {
    this.selectedFile1 = event.target.files[0];
  }
  download() {
    this.downloadDocumentAttachment(this.filePath, this.imageFileName);
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
    this.loanForm.value.status = 'Active';
    if (this.loanForm.valid && !this.amountRequiredIsValid && !this.isAmountInValid  && this.isLoanTypeApplicable) {
      if (this.submitText == 'Save') {
        let formData = this.setFormData();
        if (this.selectedFile != undefined && this.selectedFile != '' && this.isLoanTypeApplicable) {
          this.save(formData, this.api + '/persist');
        }
      } else {
        let formData = this.getFormData();
        this.update(formData, this.api + `/${this.id}`);
      }
    }
  }
  update(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.update(formData, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        (<any>$('#employeeModelPopup')).modal('hide');
        this.submitProcessing = false;
        this.ngOnInit();
        this.clear();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }
  save(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.create(formData, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        (<any>$('#employeeModelPopup')).modal('hide');
        this.submitProcessing = false;
        this.ngOnInit();
        this.clear();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }
  getFormData(): any {
    let months: any;
    let installAmount: any;
    if (this.loanForm.value.installmentMonths == null) {
      months = 1;
      installAmount = this.loanForm.value.loanAmount;
    } else {
      months = this.loanForm.value.installmentMonths;
      installAmount = (this.loanForm.value.loanAmount) / (this.loanForm.value.installmentMonths);
    }
    let result = this.loanTypes.find((e: any) => e.loanId == this.loanForm.value.loanType);
    let data = {
      "loanOrAdvType": this.loanAdvType,
      "appliedDate": this.loanForm.value.appliedDate,
      "loanDate": this.loanForm.value.appliedDate,
      "loanTypeId": {
        "loanId": this.loanForm.value.loanType,
        "loanName": result.loanName
      },
      "budgetLimit": this.loanForm.value.budgetLimit,
      "loanAmount": this.loanForm.value.amountRequired,
      // "noOfInstallment": this.loanForm.value.noOfInstallment,
      "installmentAmount": installAmount,
      "emiCalculatedField": this.loanForm.value.emiCalculatedField,
      "installmentMonths": months,
      "status": this.loanForm.value.status,
      "purpose": this.loanForm.value.purpose,
      "employee": {
        "employeeId": this.employeeId
      },
      "startrecoveryfrom": {
        "year": this.loanForm.value.year,
        "month": this.loanForm.value.month,
      },
      "workPeriod": {
        "year": this.loanForm.value.workPeriodyear,
        "month": this.loanForm.value.workPeriodMonth,
      }
    }
    return data;
  }
  setFormData(): any {
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('employeeLoanAdavanceDTO', JSON.stringify(this.getFormData()));
    return formData;
  }

  public loanTypeName: any = '';
  addFileClick(data: any) {
    this.id = data.employeeLoanAdvanceId;
    this.loanTypeName = data.loanOrAdvType + ' ' + data.loanTypeId.loanName;
    this.selectedFile1 = '';
  }
  addFile() {
    if (this.selectedFile1 != undefined && this.selectedFile1 != '') {
      const formData = new FormData();
      formData.append('file', this.selectedFile1);
      formData.append('id', this.id);
      this.submitProcessing = true;
      this.crudOperationsService.create(formData, this.api + '/addFile')
        .subscribe((data: any) => {
          this.notification.notify('success', data.message);
          (<any>$('#add-files')).modal('hide');
          this.submitProcessing = false;
          this.ngOnInit();
        },
          (_error) => {
            this.submitProcessing = false;
            this.notification.notify('error', 'Something Went Wrong')
          })
    }
  }

  clear() {
    this.submitted = false;
    this.fileSelected = false;
    this.isSubmitDisabled = false;
    this.isAmountInValid = false;
    this.submitErrorText = '';
    this.loanForm.reset();
    this.loanTypes = [];
    this.loanAdvType = 'Loan';
    this.handleType(this.loanAdvType);
    this.years = [];
    for (var i = this.year1; i > (this.year1 - 5); i--) {
      this.years.push(i);
    }
  }

  clear1() {
    this.submitted1 = false;
    this.selectedFile1 = undefined;
  }

  deleteDoc(fileName: any) {
    this.crudOperationsService.getList(this.api + '/deleteFile?id=' + this.id + '&fileName=' + fileName)
      .subscribe((data: any) => {
        this.notification.notify('success', 'File deleted successfully!');
        (<any>$('#donwload_doc')).modal('hide');
        this.submitProcessing = false;
        this.ngOnInit();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }

  delete(id: number) {
    this.crudOperationsService.delete(this.api + `/${id}`).subscribe((data: any) => {
      this.notification.notify('success', data.message);
      this.ngOnInit();
    }, (error) => { this.notification.notify('error', 'something went wrong') })
  }
}
