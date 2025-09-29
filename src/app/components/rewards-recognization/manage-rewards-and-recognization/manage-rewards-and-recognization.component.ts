import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-manage-rewards-and-recognization',
  templateUrl: './manage-rewards-and-recognization.component.html',
  styleUrls: ['./manage-rewards-and-recognization.component.css']
})
export class ManageRewardsAndRecognizationComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService,
    public crudOperationsService: CrudOperationsService, private notification: NotifierService,
    public datePipe: DatePipe) { }

  public headers: any = ['Department Name', 'Employee Details', 'Type', 'Name', 'Amount', 'Remarks', 'Status', 'Actions'];
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public employeeId: any = Number(sessionStorage.getItem('empId'));
  public userName: any = localStorage.getItem('userName');
  public rrsList: any = [];
  public departmentList: any = [];
  public logsList: any = [];
  public id: any = '';
  public submitted: boolean = false;
  public reassignSubmitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public api = 'manage-rewards-recognization'
  public submitProcessing = false;
  public employeeDetails: any = [];
  public isForEdit: any = false;
  public tempRRStatus: any = '';
  public tempRRDept: any = '';
  public tempRRDeptHead: any = '';
  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public confirmClicked = false;
  public cancelClicked = false;
  public type: any = 'Reward';
  public isForViewAndSubmitDisabled: boolean = false;
  public submitErrorText: any = '';
  public showRewards: boolean = true;
  public submitText: any = 'Create';
  public rr: any = [];
  public employeeList: any = [];
  public tempRR: any = '';

  public selectedItems: any = [];
  public dropdownSettings: any = {
    singleSelection: false,
    idField: 'employeeId',
    textField: 'fullName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: true
  };

  // pagination
  public p: number = 1;
  public itemsPerPage: any;
  public totalItems: any;
  public currentPage: any;
  public totalElements: number = 0;
  public showingFrom: number = 0;
  public showingTo: number = 0;
  public pageNumber: Number = 0;
  public pageSize: number = 20;

  public rrsForm = this.formBuilder.group({
    rewardAmount: [''],
    rrId: [null, Validators.required],
    department: [null, Validators.required],
    asigneeId: [null],
    remarks: [''],
  })

  get form_() { return this.rrsForm.controls; };
  get _form() { return this.rrsForm.value };


  ngOnInit(): void {
    this.getRRsList();
    this.fetchDepartments();
    this.handleType(this.type);
  }

  onItemSelect(data: any) {
    console.log('data', data);
  }
  onSelectAll(event: any) {
    console.log('data', event);
  }
  onDeSelectAll(event: any) {
    console.log('data', event);
  }
  onItemDeSelect(data: any) {
    console.log('data', data);
  }

  fetchDepartments() {
    let api: any = 'department/dropdownList_departments2/' + this.employeeId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.departmentList = data.data;
    });
  }

  getRRsList() {
    this.spinner.show();
    let api = this.api + '/findAllByCompanyAndHod/' + this.companyId + '/'+this.userName+'?page=' + this.pageNumber + '&size=' + this.pageSize;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.rrsList = data.data.content;
      //pagination call
      this.handlePagination(data);
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }

  public handlePagination(data: any): void {
    this.totalElements = data.data.totalElements;
    this.currentPage = data.data.pageable.pageNumber + 1;
    this.totalItems = (data.data.totalPages) * this.pageSize;
    this.showingFrom = (data.data.pageable.pageNumber * this.pageSize) + 1;
    const to = (data.data.pageable.pageNumber + 1) * this.pageSize;
    if (this.totalElements >= to) {
      this.showingTo = to;
    } else {
      this.showingTo = this.totalElements;
    }
  }
  public pageChanged(event: any): void {
    this.pageNumber = event - 1;
    this.getRRsList();
  }

  modelShow() {
    this.isForEdit = false;
    this.clear();
    this.submitText = 'Create';
  }

  loadFormData(data: any) {
    this.rrsForm.reset();
    this.selectedItems = [];
    this.submitted = false;
    this.reassignSubmitted = false;
    this.id = data.id;
    this.form_['rrId'].patchValue(data.rewardRecognitionId.rewardRecognitionId);
    this.form_['department'].patchValue(data.departmentId.departmentId);
    this.getDepartmentheadsDetails();
    this.handleType(data.rewardRecognitionId.type);
    this.form_['remarks'].patchValue(data.remarks);
    this.form_['rewardAmount'].patchValue(data.rewardRecognitionId.budget);
    // this.form_['status'].patchValue(data.rrStatus);
    this.type = data.rewardRecognitionId.type;
    data.empDetails.forEach((e: any) => {
      this.selectedItems.push({ employeeId: e.employeeId, fullName: e.fullName });
    });
    
    (<any>$('#add-edit-popup')).modal('show');
  }

  modelShowEdit(data: any) {
    this.loadFormData(data);
    this.isForEdit = true;
    this.tempRRStatus = data.rrStatus;
    this.submitText = 'Update';
    this.tempRR = data.rewardRecognitionId.rewardRecognitionId;
    this.id = data.id;
  }

  handleEmployees(data: any) {
    this.employeeList = data.empDetails;
  }

  submit() {
    console.log(this.selectedItems)
    this.submitted = true;
    for (let el in this.form_) {
      if (this.form_[el].errors) {
        console.log(el)
      }
    }
    if (this.rrsForm.valid) {
      let formData = this.getFormData();
      if (this.submitText !== 'Update') {
        this.save(formData, this.api);
      } else {
        this.update(formData, this.api + `/${this.id}`);
      }
    }
  }
  save(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.create(formData, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        (<any>$('#add-edit-popup')).modal('hide');
        this.submitProcessing = false;
        this.ngOnInit();
        this.clear();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }
  update(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.update(formData, api)
      .subscribe((data: any) => {
        this.notification.notify(data.status, data.message);
        this.submitProcessing = false;
        if (data.status == 'success') {
          (<any>$('#add-edit-popup')).modal('hide');
          this.ngOnInit();
          this.clear();
        }
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }

  getFormData(): any {
    let companyId = {
      'companyId': this.companyId
    };
    let departmentId = {
      'departmentId': this._form.department
    }
    let rewardRecognitionId = {
      "rewardRecognitionId": this.rrsForm.value.rrId
    }
    let object = {
      "rewardRecognitionId": rewardRecognitionId,
      "amount": this.rrsForm.value.rewardAmount,
      "remarks": this.rrsForm.value.remarks,
      "departmentId": departmentId,
      "company": companyId,
      "empDetails": this.selectedItems
    };
    return object;
  }

  clear() {
    this.submitted = false;
    this.rrsForm.reset();
    this.type = 'Reward';
    this.id = undefined;
    this.submitText = 'Create';
  }

  delete(id: number) {
    this.crudOperationsService.delete(this.api + `/${id}`).subscribe((data: any) => {
      this.notification.notify('success', data.message);
      this.ngOnInit();
    }, (error) => { this.notification.notify('error', 'something went wrong') })
  }

  public getDepartmentheadsDetails(): void {
    this.employeeDetails = [];
    this.selectedItems = [];
    this.crudOperationsService.getList('employee/departmentheads/' + this._form.department)
      .subscribe((data: any) => {
        this.employeeDetails = data.data;
      });
  }

  handleType(type: any) {
    this.rr = [];
    this.form_['rrId'].patchValue(null);
    this.crudOperationsService.getList('rewards_recognition/dropdownList_other/' + this.companyId + '?type=' + type+'&search=')
      .subscribe((data: any) => {
        this.rr = data.data;
        if (this.rr.length == 0) {
          this.form_['rrId'].patchValue(null);
        } else {
          let count = 0;
          this.rr.forEach((e: any) => {
            if (e.rewardRecognitionId == this.tempRR) {
              count += 1;
            }
          });
          if (count > 0) {
            this.form_['rrId'].patchValue(this.tempRR);
          } else {
            this.form_['rrId'].patchValue(null);
          }
        }
      });
  }
  changeRR() {
    let result = this.rr.find((e: any) => e.rewardRecognitionId == this.rrsForm.value.rrId);
    this.form_['rewardAmount'].patchValue(result.budget);
  }
}
