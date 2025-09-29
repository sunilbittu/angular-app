import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { AddEmployeeService } from '../addEmplyee.service';

@Component({
  selector: 'app-employee-resignation',
  templateUrl: './employee-resignation.component.html',
  styleUrls: ['./employee-resignation.component.css']
})
export class EmployeeResignationComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService,
    public crudOperationsService: CrudOperationsService, private notification: NotifierService,
    public datePipe: DatePipe, private addEmployeeService: AddEmployeeService) { }

  public headers: any = ['Employee Id', 'Employee Name', 'Notice Period', 'Resignation Date', 'Last Working Date',
    'Reason', 'Actions'];
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public employeeId: any = Number(sessionStorage.getItem('empId'));
  public empList: any = [];

  public id: any;
  public searchModel = '';
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public tempLastWorkingDate: any;
  public selectedDate: any;
  public now = new Date();
  public employeeData: any = {};
  public submitText = 'Apply';
  public api = 'employeeResignation'
  public submitProcessing = false;
  public employeeDetails: any = {};
  public isForViewAndSubmitDisabled: boolean = false;
  public submitErrorText: any = '';
  public isNoticePeriodInvalid = false;
  public showAddButton: boolean = false;
  public empForm = this.formBuilder.group({
    employeeId: ['', Validators.required],
    employeeName: ['', Validators.required],
    reportingManager: ['', Validators.required],
    department: ['', Validators.required],
    designation: ['', Validators.required],
    project: [''],
    category: ['', Validators.required],
    costCenter: ['', Validators.required],
    noticePeriod: ['', Validators.required],
    resignationDate: ['', Validators.required],
    lastWorkingDate: ['', Validators.required],
    reason: ['', Validators.required]
  })
  get form_() { return this.empForm.controls; };
  get _form() { return this.empForm.value };

  ngOnInit(): void {
    this.showAddButton = false;
    this.getEmployeeResignationList();
  }
  getEmployeeDetailsById() {
    //calling spinner
    this.spinner.show();
    this.addEmployeeService.getEmployeeById(this.employeeId)
      .subscribe((data: any) => {
        this.employeeData = data.data;
        this.getReportingHeadEmpDetails(this.employeeData.employeeId);
        this.form_['employeeId'].patchValue(this.employeeData.employeeId);
        this.form_['employeeName'].patchValue(this.employeeData.firstName + ' ' + this.employeeData.lastName);
        this.form_['department'].patchValue(this.employeeData.department.departmentName);
        this.form_['designation'].patchValue(this.employeeData.designation.designationName);
        if (this.employeeData.projectMaster != null) {
          this.form_['project'].patchValue(this.employeeData.projectMaster.projectName);
        } else {
          this.form_['project'].patchValue('');
        }
        this.form_['category'].patchValue(this.employeeData.categoryMaster.categoryName);
        this.form_['costCenter'].patchValue(this.employeeData.costCenterMaster.costCenterName);
        if (this.employeeData.noticePeriod) {
          this.form_['noticePeriod'].patchValue(this.employeeData.noticePeriod);
        } else {
          this.notification.notify('error', 'Notice period is not found for current Employee!, Please contact to Admin.');
          this.form_['noticePeriod'].patchValue("");
          this.isNoticePeriodInvalid = true;
        }
        this.spinner.hide();
        console.log(this._form)
      })
  }
  public managerDetails: any = {};
  getReportingHeadEmpDetails(id: any) {
    this.crudOperationsService.getList('employee/get_employee_reporting/' + id)
      .subscribe((data: any) => {
        this.managerDetails = data.data;
        if (this.managerDetails == null) {
          this.notification.notify('error', 'Reporting Head Employee Not Found!, Please contact to Admin.');
        } else {
          let managerName = this.managerDetails.employeeId + ' ' + this.managerDetails.firstName + ' ' + this.managerDetails.lastName;
          this.form_['reportingManager'].patchValue(managerName);
        }
      });
  }
  getEmployeeResignationList() {
    this.spinner.show();
    let api = "employeeResignation/list?employeeId=" + this.employeeId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.empList = data.data;
      let count = 0;
      this.empList.forEach((emp: any) => {
        if (emp.status == 'Rejoin' && emp.rejoinDate) {
          count = count + 1;
        }
      });
      if(this.empList.length == 0 || (count > 0 && this.empList.length == count)) {
        this.showAddButton = true;
      }
      this.spinner.hide();
    },
      (_error) => {
        this.spinner.hide();
        this.notification.notify('error', 'Something Went Wrong')
      })
  }

  modelShow() {
    this.clear();
    this.loadDefault();
  }
  loadDefault() {
    this.empForm.disable();
    this.form_['resignationDate'].enable();
    this.form_['reason'].enable();
    this.getEmployeeDetailsById();
  }

  loadAdditionalFormData(data: any) {
    this.form_['resignationDate'].patchValue(this.datePipe.transform(data.resignationDate, 'dd-MM-yyyy'));
    this.form_['lastWorkingDate'].patchValue(this.datePipe.transform(data.lastWorkingDate, 'dd-MM-yyyy'));
    this.form_['reason'].patchValue(data.reason);
    (<any>$('#applyPopup')).modal('show');
    this.selectedDate = new Date(data.resignationDate);
    this.tempLastWorkingDate = new Date(data.lastWorkingDate);
  }

  modelShowEdit(data: any) {
    this.submitted = false;
    this.submitText = 'Update';
    this.isNoticePeriodInvalid = false;
    this.id = data.employeeResignationId;
    this.loadDefault();
    this.loadAdditionalFormData(data);
  }

  clear() {
    this.submitted = false;
    this.isForViewAndSubmitDisabled = false;
    this.form_['resignationDate'].patchValue('');
    this.form_['lastWorkingDate'].patchValue('');
    this.form_['reason'].patchValue('');
    this.id = undefined;
    this.submitText = 'Apply';
    this.tempLastWorkingDate = '';
  }

  onDateValueChange(event: any) {
    if (event) {
      this.selectedDate = new Date(event);
      const date = new Date(event);
      date.setDate(date.getDate() + this.employeeData.noticePeriod);
      console.log(date);
      this.tempLastWorkingDate = date;
      this.form_['lastWorkingDate'].patchValue(this.datePipe.transform(date, 'dd-MM-yyyy'));
    }
  }

  submit() {
    this.submitted = true;
    for (let el in this.form_) {
      if (this.form_[el].errors) {
        console.log(el)
      }
    }
    if (this.empForm.valid && !this.isNoticePeriodInvalid) {
      let formData = this.getFormData();
      if (this.submitText !== 'Update') {
        this.save(formData, this.api);
      } else {
        this.update(formData, this.api + `/${this.id}`);
      }
    }
  }
  update(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.update(formData, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        (<any>$('#applyPopup')).modal('hide');
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
        (<any>$('#applyPopup')).modal('hide');
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
    let object = {
      "employeeId": { 'employeeId': this.employeeId },
      "lastWorkingDate": this.tempLastWorkingDate,
      "resignationDate": this.selectedDate,
      "reason": this._form.reason
    };
    return object;
  }
}
