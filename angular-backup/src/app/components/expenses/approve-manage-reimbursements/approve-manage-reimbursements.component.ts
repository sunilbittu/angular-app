import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-approve-manage-reimbursements',
  templateUrl: './approve-manage-reimbursements.component.html',
  styleUrls: ['./approve-manage-reimbursements.component.css']
})
export class ApproveManageReimbursementsComponent implements OnInit {
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
  public headers1: any = ["Status", "Approved Date", "Approved By", "Approved Amount", "Remarks"];
  public reimbursementsList: any = [];
  public outReimbursementsList: any = [];
  public approvedReimbursementsList: any = [];
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
  public statusModal: any = '';
  public jobId: any;
  public document: any = {};
  public employeeIdAndName = '';
  public approvalFlowDetails: any = [];
  public searchModel = '';

  public status: any = '';
  public approvedDate: any = '';
  public approvedAmount: any = '';
  public remarks: any = '';
  public approvedBy = localStorage.getItem("userName");

  public form = this.fb.group({
    employeeName: [""],
    appliedDate: ["", Validators.required],
    expenseType: ["", Validators.required],
    reportingManager: [""],
    description: ["", Validators.required],
    amount: ["", Validators.required],
    selectedFile: [""],

    status: [""],
    approvedAmount: [""],
    approvedDate: [""],
    remarks: [""]
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
    this.getEmpDetails();
    this.getReportingHeadEmpDetails();
    this.fetchExpensesList();
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
  getApprovalWorkFlowList() {
    let params = "?search=&page=0&size=100";
    let api: any = "approvalworkflow/approvalworkflow_list/" + params;
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.approvalList = data.data.content;
      })
  }

  fetchReimbursementsList() {
    this.spinner.show();
    this.outReimbursementsList = [];
    let approvedListApi = this.api + '/list?companyId=' + this.companyId + '&employeeId=' + this.employeeId + '&search=' + this.searchModel;
    this.crudOperationsService.getList(approvedListApi)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.approvedReimbursementsList = data.data.content;
        this.toggleLoader = false;
      },
        (_error) => {
          this.spinner.hide();
          this.toggleLoader = false;
          this.notification.notify('error', 'Something Went Worng');
        })

    let listApi = this.api + '/list/' + this.companyId;
    this.crudOperationsService.getList(listApi)
      .subscribe((data: any) => {
        // this.spinner.hide();
        this.reimbursementsList = data.data.content;
        this.outReimbursementsList = [];
        for (var i = 0; i < this.reimbursementsList.length; i++) {
          //let reimbursement = this.reimbursementsList[i];
          let userId = sessionStorage.getItem("empId");
          console.log("reimbursement value is ========= ", this.reimbursementsList[i]);
          let json = this.reimbursementsList[i];
          let workflowId = this.reimbursementsList[i].approvalWorkflow.id;
          let reimbursementId = this.reimbursementsList[i].reimbursementId;

          let approvedCheckApi = this.api + '/checkApprovalLevel?reimbursementId=' + reimbursementId + '&workFlowId=' + workflowId + '&employeeId=' + userId;
          this.crudOperationsService.getList(approvedCheckApi)
            .subscribe((data: any) => {
              // this.spinner.hide();
              // console.log("data is ========== ",data);
              // console.log("next reimbursement value is ========= ",this.reimbursementsList[i].employeeId);
              if (data == true) {


                this.outReimbursementsList.push(json);
              }
            },
              (_error) => {
                // this.spinner.hide();
                this.toggleLoader = false;
                this.notification.notify('error', 'Something Went Worng');
              })


        }
        //console.log("final data is =========== ",this.outReimbursementsList);

        this.toggleLoader = false;
      },
        (_error) => {
          // this.spinner.hide();
          this.toggleLoader = false;
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  addReimbursement() {
    this.clear();
    this.submitText = 'Save';
    this.tempReqDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
    this.setDefaultFormValues();
  }
  setDefaultFormValues() {
    let employeeName = this.employeeDetails.employeeId + ' ' + this.employeeDetails.firstName + ' ' + this.employeeDetails.lastName;
    let managerName = this.managerDetails.employeeId + ' ' + this.managerDetails.firstName + ' ' + this.managerDetails.lastName;
    this.form.controls['employeeName'].patchValue(employeeName);
    this.form.controls['reportingManager'].patchValue(managerName);
  }
  onAppliedDateValueChange(event: any) {
    this.selectedAppliedDate = new Date(event);
  }
  public selectedFile: any;
  onFileChanged(event: any) {
    this
      .selectedFile = event.target.files[0];
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

  showApprvalWorlflow(reimbursement: any) {
    let employeeName = this.employeeDetails.employeeId + ' ' + this.employeeDetails.firstName + ' ' + this.employeeDetails.lastName;
    let obj = {
      employeeName: employeeName,
      appliedDate: reimbursement.appliedDate,
      amount: reimbursement.amount
    }
    this.approvalFlowDetails.push(obj);
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
  public level: String = '';
  approveReimbursement(data: any) {
    console.log("edit data is ============== ", data);
    this.submitted = false;


    let userId = sessionStorage.getItem("empId");
    let approvedCheckApi = this.api + '/getApprovalLevel?workFlowId=' + data.approvalWorkflow.id + '&employeeId=' + userId;
    this.crudOperationsService.getList(approvedCheckApi)
      .subscribe((data: any) => {
        // this.spinner.hide();
        console.log("data is ========== ", data);
        // console.log("next reimbursement value is ========= ",this.reimbursementsList[i].employeeId);
        this.level = data.level;
      },
        (_error) => {
          // this.spinner.hide();
          this.toggleLoader = false;
          this.notification.notify('error', 'Something Went Worng');
        })





    this.submitText = 'Update';
    this.setDefaultFormValues();
    (<any>$('#add-reimbursement')).modal('show');
    this.form.controls['expenseType'].patchValue(data.expenseTypeId);
    this.form.controls['appliedDate'].patchValue(this.datePipe.transform(data.appliedDate, 'dd-MM-yyyy'));
    this.form.controls['description'].patchValue(data.description);
    this.form.controls['amount'].patchValue(data.amount);
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
    if (this.form.valid) {
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
  public approveReimbursementDTO: any;
  update(formData: any, api: string) {
    this.submitProcessing = true;
    this.approveReimbursementDTO = {
      "status": this.form.value.status,
      "approverName": this.approvedBy,
      "approvedAmount": this.form.value.approvedAmount,
      "approvedDate": this.form.value.approvedDate,
      "remarks": this.form.value.remarks,
      "approverId": this.employeeId
    };
    console.log(this.form.value, '.... approveReimbursementDTO ... ',this.approveReimbursementDTO)
    const approveFormData = new FormData();
    approveFormData.append('approveReimbursementDTO', JSON.stringify(this.approveReimbursementDTO));
    approveFormData.append('reimbursementId', this.reimbursementId);
    this.submitProcessing = true;
    this.crudOperationsService.create(approveFormData, this.api + '/approveReimbursement')
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        (<any>$('#add-reimbursement')).modal('hide');
        this.submitProcessing = false;
        this.clear();
        this.fetchReimbursementsList();
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
        this.fetchReimbursementsList();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }
  getFormData(): any {
    let data = {
      employee: {
        employeeId: this.employeeId
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
      expenseType: { expenseTypeId: this.form.value.expenseType },
      approvalWorkflow: {
        id: 8
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

  decimalFilter(event: any) {
    const reg = /^-?\d*(\.\d{0,2})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }


  search() {
    let listApi = this.api + '/list?companyId=' + this.companyId + '&employeeId=' + this.employeeId + '&search=' + this.searchModel;
    this.crudOperationsService.getList(listApi)
      .pipe(debounceTime(2000))
      .subscribe((data: any) => {
        this.approvedReimbursementsList = data.data.content;
        this.toggleLoader = false;
      },
        (_error) => {
          // this.spinner.hide();
          this.toggleLoader = false;
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  //public approve:any;
  checkValue(approveReimbursements: any) {

    if (approveReimbursements != null) {
      if (approveReimbursements.some((approve: any) => approve.approverName === this.userName)) {
        // do something
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
