import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.css']
})
export class CreateTicketComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService,
    public crudOperationsService: CrudOperationsService, private notification: NotifierService) { }

  public headers2: any = ["Ticket Id", "Department", "Assigned To", "Problem", "Status", "Remarks", "Actions"];
  public departMentList: any = [];
  public statusList: any = ["Active"];
  public logsHeaders: any = ['Log Id', 'Message'];

  public employees2: any = [];
  public companyId!: number;
  public employeeId: any = Number(sessionStorage.getItem('empId'));
  public editButtonEnable!: boolean;
  public helpdeskTicketId: any;
  public logsList: any = [];
  public searchModel = '';
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public submitText = '';
  public api = 'helpdesk_ticket';
  public submitProcessing = false;
  public employeeDetails: any = [];
  public submitted1: boolean = false;
  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public confirmClicked = false;
  public cancelClicked = false;
  public isSubmitDisabled: boolean = false;
  public submitErrorText: any = '';
  public tempTicketDeptHead: any = '';
  public ticketForm = this.formBuilder.group({
    problem: ['', Validators.required],
    asigneeId: [null, Validators.required],
    department: [null, Validators.required],
    ticketStatus: [''],
  })

  get form_() { return this.ticketForm.controls; };

  ngOnInit(): void {
    this.companyId = Number(sessionStorage.getItem('companyId'));
    this.fetchDepartments();
    this.fetchListTickets();
  }

  getDepartmentheadsDetails() {
    this.employeeDetails = [];
    this.form_['asigneeId'].patchValue(null);
    this.crudOperationsService.getList('employee/departmentheads/' + this.ticketForm.value.department)
      .subscribe((data: any) => {
        this.employeeDetails = data.data;
        if (this.employeeDetails.length == 0) {
          this.form_['asigneeId'].patchValue(null);
        } else {
          let count = 0;
          this.employeeDetails.forEach((e: any) => {
            if (e.employeeId == this.tempTicketDeptHead) {
              count += 1;
            }
          });
          if (count > 0) {
            this.form_['asigneeId'].patchValue(this.tempTicketDeptHead);
          } else {
            this.form_['asigneeId'].patchValue(null);
          }
        }
      });
    this.crudOperationsService.getList('employee/departmentheads/' + this.ticketForm.value.department)
      .subscribe((data: any) => {
        this.employeeDetails = data.data;
      });
  }



  modelShow() {
    this.ticketForm.reset();
    //hide edit button
    this.ticketForm.controls['ticketStatus'].patchValue('Open');
    this.editButtonEnable = false;
    this.submitText = 'Save';
    this.isSubmitDisabled = false;
    this.submitErrorText = '';
  }

  modelShowEdit(employee: any) {
    this.ticketForm.reset();
    this.isSubmitDisabled = false;
    this.submitErrorText = '';
    this.submitted = false;
    this.submitText = 'Update';
    this.helpdeskTicketId = employee.helpdeskTicketId;

    this.editButtonEnable = true;
    console.log(employee, "data")
    this.ticketForm.controls['ticketStatus'].patchValue(employee.ticketStatus);
    this.ticketForm.controls['problem'].patchValue(employee.problem);
    this.ticketForm.controls['asigneeId'].patchValue(employee.asigneeId.employeeId);
    this.ticketForm.controls['department'].patchValue(employee.departmentId.departmentId);
    this.getDepartmentheadsDetails();
    (<any>$('#employeeModelPopup')).modal('show');
    this.tempTicketDeptHead = employee.asigneeId.employeeId;
  }

  fetchDepartments() {
    let api: any = 'department/dropdownList_departments2/' + this.employeeId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.departMentList = data.data;
    });
  }

  fetchListTickets() {
    this.spinner.show();
    let api: any = 'helpdesk_ticket/ticketdropdownList_other/' + this.employeeId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.employees2 = data.data;
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }



  submit() {
    this.submitted = true;
    for (let el in this.ticketForm.controls) {
      if (this.ticketForm.controls[el].errors) {
        console.log(el)
      }
    }
    if (this.ticketForm.valid) {
      if (this.submitText == 'Save') {
        this.save(this.api);
      } else {

        this.update(this.api + `/${this.helpdeskTicketId}`);
      }
    }
  }
  update(api: string) {
    this.submitProcessing = true;
    let object: any = {
      'ticketStatus': this.ticketForm.value.ticketStatus,
      'problem': this.ticketForm.value.problem,
      "employeeId": { 'employeeId': this.employeeId },
      "asigneeId": { 'employeeId': this.ticketForm.value.asigneeId },
      "departmentId": { 'departmentId': this.ticketForm.value.department },
      "company": { 'companyId': this.companyId },
    }
    this.crudOperationsService.update(object, api)
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
  save(api: string) {
    this.submitProcessing = true;
    let object: any = {
      'ticketStatus': this.ticketForm.value.ticketStatus,
      'problem': this.ticketForm.value.problem,
      "employeeId": { 'employeeId': this.employeeId },
      "asigneeId": { 'employeeId': this.ticketForm.value.asigneeId },
      "departmentId": { 'departmentId': this.ticketForm.value.department },
      "company": { 'companyId': this.companyId },
    }

    console.log(object, 'object')

    this.crudOperationsService.create(object, api)
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


  clear() {
    this.submitted = false;
    this.isSubmitDisabled = false;
    this.submitErrorText = '';
    this.ticketForm.reset();
    this.ticketForm.controls['ticketStatus'].patchValue('Open');
  }


  delete(id: number) {
    this.crudOperationsService.delete(this.api + `/${id}`).subscribe((data: any) => {
      this.notification.notify('success', data.message);
      this.ngOnInit();
    }, (error) => { this.notification.notify('error', 'something went wrong') })
  }

  public handleLogs(id: any): void {
    // this.submitted = false;
    // this.reassignSubmitted = false;
    this.crudOperationsService.getList('logs-history/list-by/' + id)
      .subscribe((data: any) => {
        this.logsList = data.data.content;
      });
    (<any>$('#logs-popup')).modal('show');
  }

}
