import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-manage-tickets',
  templateUrl: './manage-tickets.component.html',
  styleUrls: ['./manage-tickets.component.css']
})
export class ManageTicketsComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService,
    public crudOperationsService: CrudOperationsService, private notification: NotifierService,
    public datePipe: DatePipe) { }

  public headers: any = ['Ticket Id', 'Problem', 'Created By', 'Department', 'Head of Department', 'Status', 'Remarks', 'Actions'];
  public logsHeaders: any = ['Log Id', 'Message'];
  public statuses: any = ['Inprogress', 'Resolved', 'Rejected'];
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public employeeId: any = Number(sessionStorage.getItem('empId'));
  public ticketsList: any = [];
  public departmentList: any = [];
  public logsList: any = [];
  public id: any = '';
  public submitted: boolean = false;
  public reassignSubmitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public api = 'helpdesk_ticket'
  public submitProcessing = false;
  public employeeDetails: any = [];
  public isForEdit: any = false;
  public tempTicketStatus: any = '';
  public tempTicketDept: any = '';
  public tempTicketDeptHead: any = '';

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

  public ticketsForm = this.formBuilder.group({
    ticketId: [''],
    problem: [''],
    department: [''],
    hod: [''],
    status: [null, Validators.required],
    remarks: ['', Validators.required],
  })

  get form_() { return this.ticketsForm.controls; };
  get _form() { return this.ticketsForm.value };

  public reassignForm = this.formBuilder.group({
    ticketId: [''],
    problem: [''],
    department: [null, Validators.required],
    asigneeId: [null, Validators.required],
    reassignRemarks: ['', Validators.required],
  })

  get reassignForm_() { return this.reassignForm.controls; };
  get _reassignForm() { return this.reassignForm.value };

  ngOnInit(): void {
    this.getTicketsList();
    this.fetchDepartments();
  }

  fetchDepartments() {
    let api: any = 'department/dropdownList_departments2/' + this.employeeId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.departmentList = data.data;
    });
  }

  getTicketsList() {
    this.spinner.show();
    let api = this.api + '/list-by/' + this.employeeId + '?page=' + this.pageNumber + '&size=' + this.pageSize;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.ticketsList = data.data.content;
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
    this.getTicketsList();
  }

  modelShow() {
    this.isForEdit = false;
    this.clear();
  }

  loadFormData(data: any) {
    this.loadCommonFormData(data);
    this.form_['ticketId'].patchValue(data.helpdeskTicketId);
    this.form_['problem'].patchValue(data.problem);
    this.form_['department'].patchValue(data.departmentId.departmentName);
    this.form_['hod'].patchValue(data.asigneeId.firstName + ' ' + data.asigneeId.lastName);
    this.form_['remarks'].patchValue(data.remarks);
    this.form_['status'].patchValue(data.ticketStatus);
    (<any>$('#edit-popup')).modal('show');
  }

  modelShowEdit(data: any) {
    this.loadFormData(data);
    this.isForEdit = true;
    this.tempTicketStatus = data.ticketStatus;
  }

  public handleReassign(data: any): void {
    this.loadReassignFormData(data);
  }

  public loadCommonFormData(data: any): void {
    this.reassignForm.reset();
    this.ticketsForm.reset();
    this.submitted = false;
    this.reassignSubmitted = false;
    this.id = data.helpdeskTicketId;
  }

  loadReassignFormData(data: any) {
    this.loadCommonFormData(data);
    this.reassignForm_['ticketId'].patchValue(data.helpdeskTicketId);
    this.reassignForm_['problem'].patchValue(data.problem);
    this.reassignForm_['department'].patchValue(data.departmentId.departmentId);
    this.reassignForm_['asigneeId'].patchValue(data.asigneeId.employeeId);
    this.reassignForm_['reassignRemarks'].patchValue(data.reassignRemarks);
    this.getDepartmentheadsDetails();
    (<any>$('#reassign-popup')).modal('show');
    this.tempTicketDept = data.departmentId.departmentId;
    this.tempTicketDeptHead = data.asigneeId.employeeId;
  }

  public getDepartmentheadsDetails(): void {
    this.employeeDetails = [];
    this.reassignForm_['asigneeId'].patchValue(null);
    this.crudOperationsService.getList('employee/departmentheads/' + this._reassignForm.department)
      .subscribe((data: any) => {
        this.employeeDetails = data.data;
        if (this.employeeDetails.length == 0) {
          this.reassignForm_['asigneeId'].patchValue(null);
        } else {
          let count = 0;
          this.employeeDetails.forEach((e: any) => {
            if (e.employeeId == this.tempTicketDeptHead) {
              count += 1;
            }
          });
          if (count > 0) {
            this.reassignForm_['asigneeId'].patchValue(this.tempTicketDeptHead);
          } else {
            this.reassignForm_['asigneeId'].patchValue(null);
          }
        }
      });
  }
  public ticketId:number=0;
  public handleLogs(id: any): void {
    this.ticketId=id;
    this.submitted = false;
    this.reassignSubmitted = false;
    this.crudOperationsService.getList('logs-history/list-by/' + id)
      .subscribe((data: any) => {
        this.logsList = data.data.content;
        this.logsList.forEach((x: { logMessage: string }) => {
          if (x.logMessage.includes("Department and Department Head")) 
            x.logMessage = x.logMessage.replace("Department and Department Head", "Department");
        });
      });
    (<any>$('#logs-popup')).modal('show');
  }

  submit() {
    this.submitted = true;
    for (let el in this.form_) {
      if (this.form_[el].errors) {
        console.log(el)
      }
    }
    if (this.ticketsForm.valid) {
      let formData = this.getFormData();
      this.update(formData, this.api + `/${this.id}`);
    }
  }
  update(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.update(formData, api)
      .subscribe((data: any) => {
        this.notification.notify(data.status, data.message);
        this.submitProcessing = false;
        if (data.status == 'success') {
          (<any>$('#edit-popup')).modal('hide');
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
    let object = {
      "ticketStatus": this.ticketsForm.value.status,
      "remarks": this.ticketsForm.value.remarks,
      "loggedEmpId": this.employeeId
    };
    return object;
  }

  clear() {
    this.submitted = false;
    this.form_['remarks'].patchValue('');
    this.form_['status'].patchValue(this.tempTicketStatus);
    this.id = undefined;
  }

  submitReassign() {
    this.reassignSubmitted = true;
    for (let el in this.reassignForm_) {
      if (this.reassignForm_[el].errors) {
        console.log(el)
      }
    }
    if (this.reassignForm.valid) {
      let formData = this.getReassignFormData();
      this.updateReassign(formData, this.api + `/${this.id}`);
    }
  }
  updateReassign(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.update(formData, api)
      .subscribe((data: any) => {
        this.notification.notify(data.status, data.message);
        this.submitProcessing = false;
        if (data.status == 'success') {
          (<any>$('#reassign-popup')).modal('hide');
          this.ngOnInit();
          this.clear();
        }
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }

  getReassignFormData(): any {
    let result = this.departmentList.find((e: any) => e.departmentId == this.reassignForm.value.department);
    let emp = this.employeeDetails.find((e: any) => e.employeeId == this.reassignForm.value.asigneeId);
    let object = {
      "asigneeId": {
        'employeeId': this.reassignForm.value.asigneeId,
        'firstName': emp.firstName, 'lastName': emp.lastName
      },
      "departmentId": {
        'departmentId': this.reassignForm.value.department,
        'departmentName': result.departmentName
      },
      "reassignRemarks": this.reassignForm.value.reassignRemarks,
      "loggedEmpId": this.employeeId
    };
    return object;
  }

  clearReassign() {
    this.reassignSubmitted = false;
    this.reassignForm_['department'].patchValue(this.tempTicketDept);
    this.reassignForm_['asigneeId'].patchValue(this.tempTicketDeptHead);
    this.reassignForm_['reassignRemarks'].patchValue('');
    this.id = undefined;
  }

}
