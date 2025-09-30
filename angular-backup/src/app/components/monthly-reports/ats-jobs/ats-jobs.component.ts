import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';

@Component({
  selector: 'app-ats-jobs',
  templateUrl: './ats-jobs.component.html',
  styleUrls: ['./ats-jobs.component.css'],
})
export class AtsJobsComponent implements OnInit {
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public jobList: any = [];
  public clientSearchModel = '';
  public clientList: any = [];
  public contractDetailsList: any = [
    'Fulltime',
    'Part-time',
    'Temporary',
    'Freelance',
    'Internship',
    'Apprenticeship',
    'Contractor',
    'Consultancy',
  ];
  public statusList: any = ['Active', 'Completed', 'Cancelled', 'On Hold'];
  public submitted: boolean = false;
  public requiredErrorText = "can't be blank";
  public searchInput: string = '';
  public toggleLoader: boolean = false;
  public selectedItemsContracct: any = [];
  public selectedItemsClient: any = [];
  public selectedItemsStatus: any = [];

  public selectedStartDate: any = undefined;
  public selectedEndDate: any = undefined;
  public now = new Date();
  public startDate: any = '';
  public endDate: any = '';

  //pagination
  public p: number = 1;
  public numberOfEntitesToShow: number = 20;
  itemsPerPage: any = 20;
  totalItems: any;
  currentPage: any;
  totalElements: number = 0;
  showingFrom: number = 0;
  showingTo: number = 0;
  public pageNumber: Number = 0;

  //public headers: any = ["Employee Id", "Employee Name", "Time shift", "Date Of Shift"];

  public headers: any = [
    'S.No',
    'Job ID',
    'Position Name',
    'Job Client',
    'Job Location',
    'Headcount',
    'Minimum Salary',
    'Maximum Salary',
    'Job Owner',
    'Job Stage',
    'Created Date',
  ];

  public dropdownSettingsContract = {
    singleSelection: false,
    // idField: 'shiftId',
    // textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 4,
    allowSearchFilter: true,
  };

  public dropdownSettingsClient = {
    singleSelection: false,
    idField: 'clientId',
    textField: 'clientName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 4,
    allowSearchFilter: true,
  };
  public dropdownSettingsStatus = {
    singleSelection: false,
    // idField: 'clientId',
    // textField: 'clientName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 4,
    allowSearchFilter: false,
  };

  constructor(
    private crudOperationsService: CrudOperationsService,
    public fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private notification: NotifierService,
    private employeMasterService: EmployeeMastersService
  ) {}

  ngOnInit(): void {
    this.getClients();
    this.applyConditionFilter();
  }

  // getJobs() {
  //   this.spinner.show();
  //   let api = 'job/list?companyId=' + this.companyId + '&search=' + this.clientSearchModel + '&page=' + this.pageNumber + '&size=20';
  //   this.crudOperationsService.getList(api).subscribe((data: any) => {
  //     this.spinner.hide();
  //     this.jobList = data.data.content;
  //     //pagination call

  //     this.handlePagination(data);
  //   },
  //     (error) => {
  //       this.spinner.hide();
  //       console.log(error);
  //     })
  // }

  getClients() {
    this.spinner.show();
    let api =
      'client/list?companyId=' +
      this.companyId +
      '&search=' +
      '&username=' +
      localStorage.getItem('userName') +
      '&page=' +
      this.pageNumber +
      '&size=20&isArchived=false';
    this.crudOperationsService.getList(api).subscribe(
      (data: any) => {
        this.spinner.hide();
        this.clientList = data.data.content;
        //pagination call
        //this.handlePagination(data);
      },
      (error) => {
        // this.spinner.hide();
        console.log(error);
      }
    );
  }

  changeContractDestination(data: any) {}
  onItemSelectContract(data: any) {}
  onItemSelectClient(data: any) {}
  onItemSelectStatus(data: any) {}
  OnItemDeSelect(item: any) {}
  OnItemStatusDeSelect(item: any) {}
  OnItemClientDeSelect(item: any) {}
  onSelectAllContract(event: any) {}
  onSelectAllClient(event: any) {}
  onSelectAllStatus(event: any) {}

  clear() {
    this.selectedItemsStatus = [];
    this.selectedItemsClient = [];
    this.selectedItemsContracct = [];
    this.startDate = '';
    this.endDate = '';
    this.applyConditionFilter();
  }

  onStartDateValueChange(event: any) {
    this.selectedStartDate = new Date(event);
  }

  onEndDateValueChange(event: any) {
    this.selectedEndDate = new Date(event);
  }

  prepareFilterData(): any {
    let clientIds = [];
    if (this.selectedItemsClient.length > 0) {
      for (let i = 0; i < this.selectedItemsClient.length; i++) {
        clientIds.push(this.selectedItemsClient[i].clientId);
      }
    }
    return {
      statuses: this.selectedItemsStatus,
      clientIds: clientIds,
      contractDetails: this.selectedItemsContracct,
      startDate: this.startDate ? this.selectedStartDate : '',
      endDate: this.endDate ? this.selectedEndDate : '',
      companyId: this.companyId,
    };
  }

  applyConditionFilter() {
    this.spinner.show();
    let obj = this.prepareFilterData();
    this.spinner.show();
    let api = 'job/getFilterData';
    this.crudOperationsService.getFilterData(obj, api).subscribe(
      (data: any) => {
        this.spinner.hide();
        this.jobList = data.data;
        this.totalElements = this.jobList.length;
        this.updatePagination();
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }

  updatePagination() {
    this.showingFrom = (this.p - 1) * this.numberOfEntitesToShow + 1;
    this.showingTo = Math.min(
      this.p * this.numberOfEntitesToShow,
      this.totalElements
    );
  }

  onPageChange(page: number) {
    this.p = page;
    this.updatePagination();
  }

  handlePagination(data: any) {
    this.totalElements = data.data.totalElements;
    this.itemsPerPage = 20;
    this.currentPage = data.data.pageable.pageNumber + 1;
    this.totalItems = data.data.totalPages * this.itemsPerPage;
    this.showingFrom = data.data.pageable.pageNumber * this.itemsPerPage + 1;
    const to = (data.data.pageable.pageNumber + 1) * this.itemsPerPage;
    if (this.totalElements >= to) {
      this.showingTo = to;
    } else {
      this.showingTo = this.totalElements;
    }
  }

  pageChanged(event: any) {}

  exportTable(type: string) {
    this.companyId = Number(sessionStorage.getItem('companyId'));
    let obj = this.prepareFilterData();
    //spinner show
    var fileType = '';
    if (type == 'EXCEL') {
      fileType = 'JobReport.xls';
      let api: any =
        'reports/job/exportExcel/' +
        this.companyId +
        '?search=' +
        this.clientSearchModel;
      this.crudOperationsService.exportExcelReport2(api, fileType, obj);
    } else {
      fileType = 'JobReport.pdf';
      let api: any =
        'reports/job/exportPDF/' +
        this.companyId +
        '?search=' +
        this.clientSearchModel;
      this.crudOperationsService.exportPDF2(api, fileType, obj);
    }
  }
}