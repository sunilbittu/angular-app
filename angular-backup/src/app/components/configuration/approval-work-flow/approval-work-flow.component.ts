import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AddEmployeeService } from 'src/app/components/master/addEmplyee.service';
//import { NgxNotificationDirection, NgxNotificationMsgService, NgxNotificationStatusMsg } from 'ngx-notification-msg';
import { NgxSpinnerService } from 'ngx-spinner';
import { Sort } from '@angular/material/sort';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { NotifierService } from 'angular-notifier';
declare var $: any;

@Component({
  selector: 'app-approval-work-flow',
  templateUrl: './approval-work-flow.component.html',
  styleUrls: ['./approval-work-flow.component.css']
})
export class ApprovalWorkFlowComponent implements OnInit, AfterViewInit {

  popoverTitle = 'Delete';
  popoverMessage = 'Are you sure ?';
  confirmClicked = false;
  cancelClicked = false;

   //pagination
   public p: number = 1;
   itemsPerPage: any=10;
   totalItems: any;
   currentPage: any;
   totalElements: number = 0;
   showingFrom: number = 0;
   showingTo: number = 0;
   public pageNumber: Number = 0;
   public pageSize: number = 10;

  public params: any;

  public approvalForm: any;
  public approvalFormObject: any;
  public approvalFormLevelArray: any = [];
  approvalList: any;
  approvalById: any;
  public sortedData: any = [];

  public companyId!: number;
  public employeeId!: number;

  public updateButton: boolean = false;
  usersList: any;
  ticketStatusList: any;
  public submitted: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private CrudeOperationsService: CrudOperationsService,
    private addEmployeeService: AddEmployeeService,
    private spinner: NgxSpinnerService,
    private notification: NotifierService,
    // private readonly ngxNotificationMsgService: NgxNotificationMsgService,
    private router: Router) { }

  ngOnInit(): void {

    this.approvalForm = this.formBuilder.group({

      name: ['', [Validators.required]],
      // statusOnApproval: ['', [Validators.required]],
      // statusOnDeny: ['', [Validators.required]],
      levelArray: this.formBuilder.array([
        this.createArray()
      ])

    })
  }

  ngAfterViewInit(): void {

    //calling approval list
    this.getApprovalWorkFlowList();

    //calling users List
    this.getUsersList();

    //calling ticket status
    // this.getTicketsStatusList()
  }
  //getting form controls
  get f() {
    return this.approvalForm.controls;
  }

  gotoDashboard() {
    this.router.navigateByUrl("Admin-panel/dashboard/home");
  }

  public searchModel='';
  getApprovalWorkFlowListBySearchParam($event: any) {
    const param = $event.target.value;
    this.searchModel=param;

    if (param.trim() == "") {
      //calling approval list
      this.getApprovalWorkFlowList();
    }

    else {
      //alert($event.target.value);
      //spinner show
      this.spinner.show();

      this.params = "?search=" + param + "&page=" + this.pageNumber + "&size=10"

      let api: any = "approvalworkflow/approvalworkflow_list/"+sessionStorage.getItem('companyId')+"/" + this.params;

      this.CrudeOperationsService.getList(api)
        .subscribe((data: any) => {
          this.approvalList = data.data.content;

          //pagination properties
          this.handlePagination(data);

          //spinner hide
          this.spinner.hide();

        },
          (error) => {

            //hide spinner
            this.spinner.hide();

          })

    }

  }

  public handlePagination(data: any) {
    this.totalElements = data.data.totalElements;
    this.itemsPerPage = 10;
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

  public pageChanged(event: any): void {
    this.pageNumber = event - 1;
    this.getApprovalWorkFlowList();
  }


  clearFormOnAdd() {
    this.approvalForm.reset();
    this.resetGroup();
    this.updateButton = false
  }

  createArray() {
    return this.formBuilder.group({
      Levelname: ['', [Validators.required]],
      // matcher: ['', [Validators.required]],
      users: [null, [Validators.required]],
      //userTypes: ['', [Validators.required]]
    })
  }

  addGroup() {
    // add group to the list
    const control = <FormArray>this.approvalForm.get('levelArray');
    control.push(this.createArray());
  }

  removeGroup(i: number) {
    // remove group from the list
    const control = <FormArray>this.approvalForm.get('levelArray');
    control.removeAt(i);
  }

  //clears form array
  resetGroup() {
    const control = <FormArray>this.approvalForm.get('levelArray');
    //control.clear();  

    while (control.length !== 1) {
      control.removeAt(0)
    }
  }

  getUsersList() {

    // let api: any = "user/list_agents_by_role";

    // this.CrudeOperationsService.getList(api)
    //   .subscribe((data: any) => {
    //     this.usersList = data.data;

    //   },
    //     (error) => {

    //     })
    this.companyId = Number(sessionStorage.getItem('companyId'));
    this.employeeId = Number(sessionStorage.getItem('empId'));
    this.addEmployeeService.getReportingEmployeeById(this.employeeId, this.companyId)
      .subscribe((data: any) => {
        this.usersList = data.data;

      })

  }

  // getTicketsStatusList() {

  //   let api: any = "ticketstatus/ticket_status_list";

  //   this.CrudeOperationsService.getList(api)
  //     .subscribe((data: any) => {
  //       this.ticketStatusList = data.data;

  //     },
  //       (error) => {

  //       })

  // }

  sortData(sort: Sort) {
    this.sortedData = this.CrudeOperationsService.sortData(sort, this.approvalList);

  }
  //calling approval list
  getApprovalWorkFlowList() {

    //show spinner
    this.spinner.show();

    //this.params = "?page=" + this.pageNumber + "&size=10"
    this.params = "?search=" + this.searchModel + "&page=" + this.pageNumber + "&size=10"


    let api: any = "approvalworkflow/approvalworkflow_list/"+sessionStorage.getItem('companyId')+"/" + this.params;

    this.CrudeOperationsService.getList(api)
      .subscribe((data: any) => {
        this.approvalList = data.data.content;
        this.sortedData = data.data.content;
        //pagination properties
        this.handlePagination(data);
        //hide spinner
        this.spinner.hide();

      },
        (error) => {

          //hide spinner
          this.notification.notify('error', 'Something went wrong!');
          this.spinner.hide();

        })

  }

  onEditApprovalWorkflow(id: number) {

    const control = <FormArray>this.approvalForm.get('levelArray');

    control.clear();

    let api: any = "approvalworkflow/" + id;

    this.CrudeOperationsService.getList(api)
      .subscribe((data: any) => {
        this.approvalById = data.data;
        //enable update button
        this.updateButton = true;

        this.approvalById.approvalLevelDTO.forEach((element: any) => {

          const formArrayGroup = this.formBuilder.group({
            id: element.id,
            Levelname: element.name,
            matcher: element.match,
            users: element.usersId,
            userTypes: element.userType
          })

          control.push(formArrayGroup);

        });

        this.approvalForm.patchValue({

          name: this.approvalById.name,
          statusOnApproval: this.approvalById.actionOnApprove,
          statusOnDeny: this.approvalById.actionOnDeny
        })
      },
        (error) => {

        })

  }

  //deleting approval work flow
  deleteApprovalWorkFlow(id: number) {

    let api: any = "approvalworkflow/" + id;

    this.CrudeOperationsService.delete(api)
      .subscribe((data: any) => {

        //calling approval list
        this.getApprovalWorkFlowList();

      },
        (error) => {

        })

  }

  //update 
  onUpdate() {

    //clear array
    this.approvalFormLevelArray = [];

    this.approvalForm.value.levelArray.forEach((element: any) => {

      const approvalLevel =
      {
        "id": element.id,
        "match": element.matcher,
        "name": element.Levelname,
        "usersId": element.users,
        'company': { 'companyId': sessionStorage.getItem('companyId') },
        "userType": element.userTypes
      }

      this.approvalFormLevelArray.push(approvalLevel);

    });

    this.approvalFormObject =
    {
      "id": this.approvalById.id,
      "actionOnApprove": this.approvalForm.value.statusOnApproval,
      "actionOnDeny": this.approvalForm.value.statusOnDeny,
      "name": this.approvalForm.value.name,
      "type": "expense",
      "createdAt": this.approvalById.createdAt,
      'company': { 'companyId': sessionStorage.getItem('companyId') },
      "approvalLevelDTO": this.approvalFormLevelArray,

    }

    console.log(this.approvalFormObject);

    let api: any = "approvalworkflow/update/" + this.approvalById.id
    this.CrudeOperationsService.update(this.approvalFormObject, api)

      .subscribe((data: any) => {

        //hide modelpopup
        $('.approvalWorkFlow-model').modal('hide');

        this.approvalForm.reset();

        //calling approval list
        this.getApprovalWorkFlowList()

        //clear array
        this.resetGroup();

        //spinner hide
        this.spinner.hide();

      },
        (error) => {

          //hide modelpopup
          $('.approvalWorkFlow-model').modal('hide');

          //this.departmentForm.reset();

          //spinner hide
          this.spinner.hide();
          console.log(error);
        })

  }

  onSubmit() {

    this.submitted = true;
    if (this.approvalForm.invalid) {
      return
    }

    this.approvalForm.value.levelArray.forEach((element: any) => {

      const approvalLevel =
      {
        //"match": element.matcher,
        "name": element.Levelname,
        "usersId": element.users,
        //"userType": element.userTypes
      }

      this.approvalFormLevelArray.push(approvalLevel);

    });

    this.approvalFormObject =
    {
      // "actionOnApprove": this.approvalForm.value.statusOnApproval,
      // "actionOnDeny": this.approvalForm.value.statusOnDeny,
      "name": this.approvalForm.value.name,
      "type": "leave",
      'company': { 'companyId': sessionStorage.getItem('companyId') },
      "approvalLevelDTO": this.approvalFormLevelArray
    }

    console.log(this.approvalFormObject);

    let api: any = "approvalworkflow"
    this.CrudeOperationsService.create(this.approvalFormObject, api)
      .subscribe((data: any) => {

        //hide modelpopup
        $('.approvalWorkFlow-model').modal('hide');

        this.approvalForm.reset();

        //calling approval list
        this.getApprovalWorkFlowList();

        //clear array
        this.resetGroup();

        //spinner hide
        this.spinner.hide();

      },
        (error) => {

          //hide modelpopup
          $('.approvalWorkFlow-model').modal('hide');

          //this.departmentForm.reset();

          //spinner hide
          this.spinner.hide();
          console.log(error);
        })

  }

}
