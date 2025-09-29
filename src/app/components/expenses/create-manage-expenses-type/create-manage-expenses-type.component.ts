import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime } from 'rxjs/operators';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
@Component({
  selector: 'app-create-manage-expenses-type',
  templateUrl: './create-manage-expenses-type.component.html',
  styleUrls: ['./create-manage-expenses-type.component.css']
})
export class CreateManageExpensesTypeComponent implements OnInit {
  projectList: any;
  public weathertoshowupdatebutton: boolean = true;
  employeeId: any;

  constructor(public fb: FormBuilder, public datePipe: DatePipe,
    private crudOperationsService: CrudOperationsService, private notification: NotifierService,
    private spinner: NgxSpinnerService) { }
  public saveAlert: boolean = false;
  public updateAlert: boolean = false;
  public submitText = '';
  public companyId: any;
  public toggleLoader: boolean = false;
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public submitProcessing: boolean = false;
  public now = new Date();
  public numberOfDaysInMonth = new Date(this.now.getFullYear(), this.now.getMonth() + 1, 0).getDate();
  public headers: any = ['Expense Code', 'Expense Type', 'Description', 'Budget Limit', 'Cut Off Date', 'Approval Workflow'];
  public expensesTypeList: any = [];
  public expenseTypeId = '';
  public cutOffDateList: any = ['1-10', '11-20', '21-' + this.numberOfDaysInMonth];
  public searchModel = '';

  public form = this.fb.group({
    expenseCode: ['', Validators.required],
    expenseType: ['', Validators.required],
    description: ['', Validators.required],
    budgetLimit: ['', Validators.required],
    advance: [''],
    cutOffDate: ['', Validators.required],
    approvalWorkflow: ['', Validators.required]
  });

  get form_() { return this.form.controls; };
  public tempReqDate: any;

  public userName: any;
  public api = 'expenseType';
  public employeeList!: any[];

  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public confirmClicked = false;
  public cancelClicked = false;
  approvalList: any;

  ngOnInit(): void {
    this.toggleLoader = true;
    this.expensesTypeList = [];
    this.userName = localStorage.getItem('userName');
    this.employeeId = sessionStorage.getItem('empId');
    this.companyId = sessionStorage.getItem('companyId');
    this.fetchExpensesList();
    this.getApprovalWorkFlowList();
  }

  getApprovalWorkFlowList() {
    let params = '?search=&page=0&size=100';
    let api: any = 'approvalworkflow/approvalworkflow_list/' + params;
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.approvalList = data.data.content;
      })
  }

  fetchExpensesList() {
    this.spinner.show();
    let listApi = this.api + '/list-by/' + this.companyId + '?search=' + this.searchModel;
    this.crudOperationsService.getList(listApi)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.expensesTypeList = data.data;
        this.toggleLoader = false;
      },
        (_error) => {
          this.spinner.hide();
          this.toggleLoader = false;
          this.notification.notify('error', 'Something Went Worng');
        })
  }

  search() {
    let listApi = this.api + '/list-by/' + this.companyId + '?search=' + this.searchModel;
    this.crudOperationsService.getList(listApi)
      .pipe(debounceTime(2000))
      .subscribe((data: any) => {
        this.expensesTypeList = data.data;
        this.toggleLoader = false;
      },
        (_error) => {
          this.toggleLoader = false;
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  addExpenseType() {
    this.submitText = 'Save';
    this.tempReqDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
    this.clear();
  }
  editExpenseType(data: any) {
    this.submitted = false;
    this.submitText = 'Update';
    (<any>$('#add-expense-type')).modal('show');
    this.form.controls['expenseCode'].patchValue(data.expenseCode);
    this.form.controls['expenseType'].patchValue(data.expenseType);
    this.form.controls['description'].patchValue(data.description);
    this.form.controls['budgetLimit'].patchValue(data.budgetLimit);
    this.form.controls['advance'].patchValue(data.advance);
    this.form.controls['cutOffDate'].patchValue(data.cutOffDate);
    this.form.controls['approvalWorkflow'].patchValue(data.approvalWorkflow.id);
    this.expenseTypeId = data.expenseTypeId;
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
      let formData = this.setFormData();
      if (this.submitText == 'Save') {
        this.save(formData, this.api);
      } else {
        this.update(formData, this.api + '/' + this.expenseTypeId);
      }
    }
  }
  update(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.update(formData, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        (<any>$('#add-expense-type')).modal('hide');
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
        (<any>$('#add-expense-type')).modal('hide');
        this.submitProcessing = false;
        this.ngOnInit();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }
  setFormData(): any {
    let data = {
      approvalWorkflow: {
        id: this.form.value.approvalWorkflow
      },
      company: {
        companyId: this.companyId
      },
      expenseCode: this.form.value.expenseCode,
      description: this.form.value.description,
      expenseType: this.form.value.expenseType,
      budgetLimit: this.form.value.budgetLimit,
      advance: this.form.value.advance,
      cutOffDate: this.form.value.cutOffDate
    }
    return data;
  }

  clear() {
    this.submitted = false;
    this.form.reset();
    this.showAdvanceError = false;
    this.showBudgetLimitError = false;
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

  decimalFilter(event: any): any {
    let input = event;
    if (input) {
      this.showBudgetLimitError = false;
      if (this.form.value.advance)
        this.showAdvanceError = (Number(this.form.value.advance) > Number(this.form.value.budgetLimit));
    }
  }

  public showAdvanceError: any = false;
  public showBudgetLimitError: any = false;
  validateFilter(event: any) {
    this.showAdvanceError = false;
    this.showBudgetLimitError = false;
    let input = event;
    let budLimit = this.form.value.budgetLimit;
    if (input) {
      if (budLimit) {
        this.showAdvanceError = (Number(input) > Number(budLimit));
      } else {
        this.showBudgetLimitError = true;
      }
    }
  }
}
