import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-apply-manage-reimbursements',
  templateUrl: './apply-manage-reimbursements.component.html',
  styleUrls: ['./apply-manage-reimbursements.component.css']
})
export class ApplyManageReimbursementsComponent implements OnInit {
  constructor(public fb: FormBuilder, public datePipe: DatePipe,
    private crudOperationsService: CrudOperationsService, private notification: NotifierService,
    private spinner: NgxSpinnerService) { }
  public submitText = '';
  public userName = localStorage.getItem("userName");
  public employeeId = sessionStorage.getItem("empId");
  public companyId = sessionStorage.getItem("companyId");
  public toggleLoader: boolean = false;
  public submitted: boolean = false;
  public submitted1: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public submitProcessing: boolean = false;
  public selectedAppliedDate: any;
  public now = new Date();
  public numberOfDaysInMonth = new Date(this.now.getFullYear(), this.now.getMonth() + 1, 0).getDate();
  public headers: any = ["Employee Id & Name", "Applied Date", "Expense ", "Description", "Reporting Manager", "Docs"];
  public reimbursementsList: any = [];
  public awHeaders: any = ["Employee Id & Name", "Applied Date", "Amount ", "(Level1) shows", "Approved Amunt", "Lavel2"];
  public expenseTypeList: any = [];
  public reimbursementId = '';
  public cutOffDateList: any = ['1-10', '11-20', '21-' + this.numberOfDaysInMonth];
  public imageFileName: any;
  public filePath: any;
  public fileSelected: boolean = false;
  public managerDetails: any = {};
  public employeeDetails: any = {};
  public expenseTypeModal: any = '';
  public jobId: any;
  public document: any = {};
  public employeeIdAndName = '';
  public headers1: any = ["Employee Id & Name", "Applied Date", "Amount ", "Level", "Status", "Approved Date", "Approved By", "Approved Amount", "Remarks"];
  public approvalFlowDetails: any = [];
  public searchModel = '';
  public approvalById: any;
  public isExpenseTypeApplicable: Boolean = true;
  public form = this.fb.group({
    employeeName: [""],
    appliedDate: ["", Validators.required],
    expenseType: [null, Validators.required],
    reportingManager: [""],
    budgetLimit: [""],
    advance: [""],
    description: ["", Validators.required],
    amount: ["", Validators.required],
    selectedFile: [""],
  });

  get form_() { return this.form.controls; };
  public tempReqDate: any;

  public api = 'apply_reimbursement';
  public employeeList!: any[];

  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public confirmClicked = false;
  public cancelClicked = false;
  approvalList: any;

  ngOnInit(): void {
    this.toggleLoader = true;
    this.fetchReimbursementsList();
  }
  ngAfterViewInit(): void {
    this.fetchExpensesList();
    this.getEmpDetails();
    this.getReportingHeadEmpDetails();
  }
  getEmpDetails() {
    this.crudOperationsService.getList('employee/get_employee_by_id/' + this.employeeId)
      .subscribe((data: any) => {
        this.employeeDetails = data.data;
        if (this.employeeDetails == null) {
          this.notification.notify('error', 'Employee Not Found!, Please contact to Admin.');
        }
      });
  }
  getReportingHeadEmpDetails() {
    this.crudOperationsService.getList('employee/get_employee_reporting/' + this.employeeId)
      .subscribe((data: any) => {
        this.managerDetails = data.data;
        if (this.managerDetails == null) {
          this.notification.notify('error', 'Reporting Head Employee Not Found!, Please contact to Admin.');
        }
      });
  }

  fetchExpensesList() {
    // this.spinner.show();
    let listApi = 'expenseType/list-by/' + this.companyId + '?search=';
    this.crudOperationsService.getList(listApi)
      .subscribe((data: any) => {
        // this.spinner.hide();
        this.expenseTypeList = data.data;
        this.toggleLoader = false;
      },
        (_error) => {
          // this.spinner.hide();
          this.toggleLoader = false;
          this.notification.notify('error', 'Something Went Worng');
        })
  }

  fetchReimbursementsList() {
    this.spinner.show();
    let listApi = this.api + '/list?companyId=' + this.companyId + '&employeeId=' + this.employeeId + '&search=' + this.searchModel; this.crudOperationsService.getList(listApi)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.reimbursementsList = data.data.content;
        this.toggleLoader = false;
      },
        (_error) => {
          this.spinner.hide();
          this.toggleLoader = false;
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  addReimbursement() {
    this.clear();
    this.submitText = 'Save';
    this.tempReqDate = this.datePipe.transform(new Date(), 'dd-MMM-yyyy');
    let employeeName = this.employeeDetails.employeeId + ' ' + this.employeeDetails.firstName + ' ' + this.employeeDetails.lastName;
    this.form.controls['employeeName'].patchValue(employeeName);
    let managerName = this.managerDetails.employeeId + ' ' + this.managerDetails.firstName + ' ' + this.managerDetails.lastName;
    this.form.controls['reportingManager'].patchValue(managerName);
  }
  onAppliedDateValueChange(event: any) {
    this.selectedAppliedDate = new Date(event);
  }
  public selectedFile: any;
  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    this.fileSelected = false;
  }
  public selectedFile1: any;
  onFileChanged1(event: any) {
    this.selectedFile1 = event.target.files[0];
  }
  download() {
    this.downloadDocumentAttachment(this.filePath, this.imageFileName);
  }
  downloadDocumentAttachment(filePath: string, fileName: string) {
    let downloadApi = this.api + '/document_download?filePath=' + filePath;
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
  viewDocument(doc: any, reimbursementId: any) {
    this.reimbursementId = reimbursementId;
    (<any>$('#donwload_doc')).modal('show');
    this.document = doc;
  }

  public childHeader: any = [];
  public result: any = [];
  showApprvalWorlflow(reimbursement: any) {
    this.result = [];
    this.childHeader = [];
    this.approvalFlowDetails = [];
    this.approvalById = [];
    let employeeName = this.employeeDetails.employeeId + ' ' + this.employeeDetails.firstName + ' ' + this.employeeDetails.lastName;

    this.result.push(employeeName, reimbursement.appliedDate, reimbursement.amount);
    this.getApprovalWorkFlowListById(reimbursement.approvalWorkflow.id, reimbursement);
  }
  public approvalDTOs: any = [];
  getApprovalWorkFlowListById(id: any, reimbursement: any) {
    this.spinner.show();
    let api: any = "approvalworkflow/" + id;
    this.approvalFlowDetails = reimbursement.approveReimbursements;
    let employeeName = this.employeeDetails.employeeId + ' ' + this.employeeDetails.firstName + ' ' + this.employeeDetails.lastName;
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.approvalById = data.data;
        this.approvalDTOs = this.approvalById.approvalLevelDTO;
        this.approvalDTOs.forEach((a: any) => {
          a.employeeName = employeeName
          a.appliedDate = reimbursement.appliedDate;
          a.amount = reimbursement.amount;
          if (this.approvalFlowDetails) {
            let result = this.getDataByFilter(a.usersId);
            if (result) {
              a.status = result.status;
              a.approvedDate = result.approvedDate;
              a.approverName = result.approverName;
              a.approvedAmount = result.approvedAmount;
              a.remarks = result.remarks
            }
          }
        });
        this.spinner.hide();
      },
        (error) => {
          this.spinner.hide();
        })
  }
  getDataByFilter(id: any) {
    return this.approvalFlowDetails.find((x: any) => x.approverId === id);
  }
  deleteDoc(fileName: any) {
    this.crudOperationsService.getList(this.api + '/deleteFile?reimbursementId=' + this.reimbursementId + '&fileName=' + fileName)
      .subscribe((data: any) => {
        (<any>$('#donwload_doc')).modal('hide');
        this.submitProcessing = false;
        this.ngOnInit();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }
  editReimbursement(data: any) {
    this.submitted = false;
    this.submitText = 'Update';
    (<any>$('#add-reimbursement')).modal('show');
    this.form.controls['expenseType'].patchValue(data.expenseTypeId);
    this.form.controls['appliedDate'].patchValue(this.datePipe.transform(data.appliedDate, 'dd-MMM-yyyy'));
    this.form.controls['description'].patchValue(data.description);
    this.form.controls['amount'].patchValue(data.amount);
    this.form.controls['reportingManager'].patchValue(data.reportingManagerId + ' ' + data.reportingManagerName);
    this.form.controls['employeeName'].patchValue(data.employeeId + ' ' + data.employeeName);
    // this.changeExpenceType();
    let result = this.expenseTypeList.find((e: any) => e.expenseTypeId == data.expenseTypeId);
    this.form.controls['budgetLimit'].patchValue(result.budgetLimit);
    this.form.controls['advance'].patchValue(result.advance);
    this.workflowId = result.approvalWorkflow.id;
    // this.form.controls['approvalWorkflow'].patchValue(data.approvalWorkflow.id);
    this.reimbursementId = data.reimbursementId;
    this.fileSelected = true;
  }
  reset() {
    this.submitText = 'Save';
  }
  submit() {
    this.submitted = true;
    console.log(this.form.value)
    for (let el in this.form.controls) {
      if (this.form.controls[el].errors) {
        console.log(el)
      }
    }
    if (this.form.valid && !this.showAmountError && this.isExpenseTypeApplicable) {
      if (this.submitText == 'Save') {
        let formData = this.setFormData();
        if (this.selectedFile != undefined && this.selectedFile != '') {
          this.save(formData, this.api);
        }
      } else {
        let formData = this.getFormData();
        this.update(formData, this.api + `/${this.reimbursementId}`);
      }
    }
  }
  update(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.update(formData, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        (<any>$('#add-reimbursement')).modal('hide');
        this.submitProcessing = false;
        this.ngOnInit();
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
        (<any>$('#add-reimbursement')).modal('hide');
        this.submitProcessing = false;
        this.ngOnInit();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }
  getFormData(): any {
    let result = this.expenseTypeList.find((e: any) => e.expenseTypeId == this.form.value.expenseType);
    let data = {
      employee: {
        employeeId: this.employeeId,
        firstName: this.employeeDetails.firstName,
        lastName: this.employeeDetails.lastName
      },
      reportingManager: {
        employeeId: this.managerDetails.employeeId
      },
      company: {
        companyId: this.companyId
      },
      appliedDate: this.selectedAppliedDate,
      amount: this.form.value.amount,
      description: this.form.value.description,
      expenseType: {
        expenseTypeId: this.form.value.expenseType,
        expenseType: result.expenseType
      },
      approvalWorkflow: {
        id: this.workflowId
      },
    }
    return data;
  }
  setFormData(): any {
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('applyReimbursementDTO', JSON.stringify(this.getFormData()));
    return formData;
  }

  addFileClick(data: any) {
    this.reimbursementId = data.reimbursementId;
    this.employeeIdAndName = data.employeeId + ' ' + data.employeeName;
    this.selectedFile1 = '';
  }
  addFile() {
    if (this.selectedFile1 != undefined && this.selectedFile1 != '') {
      const formData = new FormData();
      formData.append('file', this.selectedFile1);
      formData.append('reimbursementId', this.reimbursementId);
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
    this.form.reset();
    this.showAmountError = false;
  }

  clear1() {
    this.submitted1 = false;
    this.selectedFile1 = undefined;
  }
  getAllEmployees() {
    let listApi = this.api + `/list-by/${this.companyId}`;
    this.crudOperationsService.getList(listApi)
      .subscribe((data: any) => {
        this.employeeList = data.data;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
        })
  }

  delete(id: number) {
    this.crudOperationsService.delete(this.api + `/${id}`).subscribe((data: any) => {
      this.notification.notify('success', data.message);
      this.ngOnInit();
    }, (error) => { this.notification.notify('error', 'something went wrong') })
  }

  public showAmountError: boolean = false;
  public remAmount: any;
  decimalFilter() {
     //alert(this.form.value.amount);
    // const reg = /^-?\d*(\.\d{0,2})?$/;
    // let input = event;

    // if (input && !reg.test(input)) {
    //   event.preventDefault();
    // }

    //if (input) {
      this.remAmount = this.form.value.budgetLimit - this.form.value.advance;
      this.showAmountError = (Number(this.form.value.amount) > Number(this.remAmount));
     // alert(this.showAmountError);
    //}
  }

  public workflowId: any;
  changeExpenceType() {
    let result = this.expenseTypeList.find((e: any) => e.expenseTypeId == this.form.value.expenseType);
    this.form.controls['budgetLimit'].patchValue(result.budgetLimit);
    this.form.controls['advance'].patchValue(result.advance);
    this.workflowId = result.approvalWorkflow.id;
  }

  validateExpense() {
    let url = "approvalworkflow/workflowvalidation/" + this.employeeId + "/" + this.form.value.expenseType + "/Expense";
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      this.isExpenseTypeApplicable = data.data;
    });
  }

  search() {
    let listApi = this.api + '/list?companyId=' + this.companyId + '&employeeId=' + this.employeeId + '&search=' + this.searchModel;
    this.crudOperationsService.getList(listApi)
      .pipe(debounceTime(2000))
      .subscribe((data: any) => {
        this.reimbursementsList = data.data.content;
        this.toggleLoader = false;
      },
        (_error) => {
          // this.spinner.hide();
          this.toggleLoader = false;
          this.notification.notify('error', 'Something Went Worng');
        })
  }

}
