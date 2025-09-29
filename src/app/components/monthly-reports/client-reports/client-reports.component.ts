import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { AddEmployeeService } from '../../master/addEmplyee.service';

@Component({
  selector: 'app-client-reports',
  templateUrl: './client-reports.component.html',
  styleUrls: ['./client-reports.component.css']
})
export class ClientReportsComponent implements OnInit {
  public headers: any = ['Client Name', 'Client Website', 'Client Industry', 'Client Location', 'Client Address', 'Client Created Date', 'Job Count', 'Client Owner', 'Client Team', 'Client Stage', 'Contract Type'];
  public stageList: any = ['Prospect', 'Lead', 'Engaged', 'Negotiation', 'Signed'];
  public teamMembersHeader: any = ['Name', 'Display Name', 'Last Active'];
  public contractType: any = ['Permanent', 'Hierarchy', 'Contract'];
  public clientList: any = [];
  public teamMembersList: any = [];
  public employeeList: any = [];
  public id: any;
  public clientSearchModel = '';
  public api = 'client'
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public employeeId: any = Number(sessionStorage.getItem('empId'));

  //pagination
  public p: number = 1;
  public numberOfEntitesToShow: number = 20;
  public itemsPerPage: any;
  public totalItems: any;
  public currentPage: any;
  public totalElements: number = 0;
  public showingFrom: number = 0;
  public showingTo: number = 0;
  public pageNumber: Number = 0;
  public stageModel: any = '';
  public contarctModel: any = null;
  public UserModel: any = '';
  public selectedStartDate: any = undefined;
  public selectedEndDate: any = undefined;
  public now = new Date();
  public startDate: any = '';
  public endDate: any = '';
  public selectedItemsTeam: any = [];
  public selectedItemsStage: any = [];

  public dropdownSettingsTeam = {
    singleSelection: false,
    idField: 'employeeId',
    textField: 'fullName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 4,
    allowSearchFilter: true,
  };
  public dropdownSettingsStage = {
    singleSelection: false,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 4,
    allowSearchFilter: false,
  };

  onItemSelectTeam(data: any) { }
  onItemSelectStage(data: any) { }
  OnStageItemDeSelect(item: any) { }
  OnTeamItemDeSelect(item: any) { }
  onSelectAllTeam(event: any) { }
  onSelectAllStage(event: any) { }

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService,
    public crudOperationsService: CrudOperationsService, private notification: NotifierService,
    public datePipe: DatePipe, private employeeService: AddEmployeeService) { }

  ngOnInit(): void {
    this.searchFilter();
    this.getEmployees();
  }

  exportTable(type: string) {
    this.companyId = Number(sessionStorage.getItem('companyId'));
    let obj = this.prepareFilterData();
    //spinner show
    var fileType = '';
    if (type == 'EXCEL') {
      fileType = 'ClientReport.xls';
      let api: any = "reports/client/exportExcel/" + this.companyId + '/true?search=' + this.clientSearchModel;
      this.crudOperationsService.exportExcelReport2(api, fileType, obj)
    }
    else {
      fileType = 'ClientReport.pdf';
      let api: any = "reports/client/exportPDF/" + this.companyId + '/true?search=' + this.clientSearchModel;
      this.crudOperationsService.exportPDF2(api, fileType, obj)
    }
  }

  showTeamMembers(id: any) {
    this.id = id;
    this.getTeamMembers();
  }

  getTeamMembers() {
    let api = this.api + '/getTeamMembers?id=' + this.id;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.teamMembersList = data.data.team ? data.data.team : [];
    },
      (error) => {
        console.log(error);
      })
  }

  getEmployees() {
    this.employeeList = [];
    var filterJson = {
      "companyId": this.companyId,
      "search": ''
    }

    this.employeeService.getFilterData(filterJson)
      .subscribe((data: any) => {
        this.employeeList = data.data;
        this.employeeList.map(function (obj: any) {
          obj.selected = false;
        })
        console.log(this.employeeList);
      })
  }

  searchFilter() {
    this.spinner.show();
    let obj = this.prepareFilterData();
    let api = this.api + '/getFilterData';
    this.crudOperationsService.getFilterData(obj, api)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.clientList = data.data;
        this.totalElements=this.clientList.length;
        this.updatePagination();
      })
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

  prepareFilterData(): any {
    let employeeIdList = [];
    if (this.selectedItemsTeam.length > 0) {
      for (let i = 0; i < this.selectedItemsTeam.length; i++) {
        employeeIdList.push(this.selectedItemsTeam[i].employeeId);
      }
    }
    let stages = '';
    for (var i = 0; i < this.selectedItemsStage.length; i++) {
      stages = stages.concat("'" + this.selectedItemsStage[i] + "'");
    }
    return {
      "clientStage": this.selectedItemsStage,
      "userIds": employeeIdList,
      "contractType": this.contarctModel,
      "startDate": this.startDate ? this.selectedStartDate : '',
      "endDate": this.endDate ? this.selectedEndDate : '',
      "companyId": this.companyId
    }
  }

  clear() {
    this.selectedItemsStage = [];
    this.selectedItemsTeam = [];
    this.startDate = '';
    this.endDate = '';
    this.contarctModel = null;
    this.searchFilter();
  }

  onStartDateValueChange(event: any) {
    this.selectedStartDate = new Date(event);
  }

  onEndDateValueChange(event: any) {
    this.selectedEndDate = new Date(event);
  }
  onSorted($event: Event) {
    let data: any = $event;
    console.log("data ::: ", data)
    let sortedArray = (this.clientList || []).sort((a: any, b: any) => {
      if (a[data.sortColumn] > b[data.sortColumn]) {
        return (data.sortDirection === 'desc') ? 1 : -1;
      }
      if (a[data.sortColumn] < b[data.sortColumn]) {
        return (data.sortDirection === 'desc') ? -1 : 1;
      }
      return 0;
    })
    this.clientList = sortedArray;
  }
}
