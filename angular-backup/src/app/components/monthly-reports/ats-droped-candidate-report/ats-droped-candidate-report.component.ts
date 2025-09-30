import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { AddEmployeeService } from '../../master/addEmplyee.service';
@Component({
  selector: 'app-ats-droped-candidate-report',
  templateUrl: './ats-droped-candidate-report.component.html',
  styleUrls: ['./ats-droped-candidate-report.component.css']
})
export class AtsDropedCandidateReportComponent implements OnInit {

  public headers: any = ['Candidate Name', 'Drop Reasons', 'Drop Date', 'Drop Description', 'Current Company', 'Notice Period', 'Current Salary', 'Expected Salary', 'Candidate Owner', 'Candidate Created Date', 'Candidate Stage'];
  public stageList: any = ['New Candidate', 'Owned', 'Added to a job', 'Dropped', 'Placed'];
  public teamMembersHeader: any = ['Name', 'Display Name', 'Last Active'];
  public candidateList: any = [];
  public teamMembersList: any = [];
  public employeeList: any = [];
  public id: any;
  public candidateSearchModel = '';
  public api = 'candidate'
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
  public reasonModel: any = '';
  public UserModel: any = '';
  public selectedStartDate: any = undefined;
  public selectedEndDate: any = undefined;
  public now = new Date();
  public startDate: any = '';
  public endDate: any = '';
  public selectedItemsTeam: any = [];

  public dropdownSettingsTeam = {
    singleSelection: false,
    idField: 'employeeId',
    textField: 'fullName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 4,
    allowSearchFilter: false,
  };

  onItemSelectTeam(data: any) { }
  OnTeamItemDeSelect(item: any) { }
  onSelectAllTeam(event: any) { }

  public dropDescription: any = '';
  public dropList: any = ['Above budget', 'Accepted another offer', 'Cultural fit', 'Did not attend the interview',
    'Not available', 'Not Qualified', 'Other', 'Overqualified', 'Reference check failed', 'Rejected the offer',
    'Technical test failed', 'Unresponsive'];
  public selectedItemsDropReason: any = [];
  public dropdownSettingsDropReason = {
    singleSelection: false,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 4,
    allowSearchFilter: false,
  };

  onItemSelectDropReason(data: any) { }
  OnDropReasonItemDeSelect(item: any) { }
  onSelectAllDropReason(event: any) { }

  constructor(private spinner: NgxSpinnerService, public crudOperationsService: CrudOperationsService,
    public datePipe: DatePipe) { }

  ngOnInit(): void {
    this.searchFilter();
  }

  exportTable(type: string) {
    this.companyId = Number(sessionStorage.getItem('companyId'));
    let obj = this.prepareFilterData();
    //spinner show
    var fileType = '';
    if (type == 'EXCEL') {
      fileType = 'CandidateReport.xls';
      let api: any = "reports/candidateDrop/exportExcel/" + this.companyId + '/true?search=' + this.candidateSearchModel;
      this.crudOperationsService.exportExcelReport2(api, fileType, obj)
    }
    else {
      fileType = 'CandidateReport.pdf';
      let api: any = "reports/candidateDrop/exportPDF/" + this.companyId + '/true?search=' + this.candidateSearchModel;
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

  searchFilter() {
    let obj = this.prepareFilterData();
    let api = this.api + '/getFilterDataByDropReason';
    this.crudOperationsService.getFilterData(obj, api)
      .subscribe((data: any) => {
        this.candidateList = data.data;
      })
  }

  prepareFilterData(): any {
    return {
      "candidateDropReason": this.reasonModel,
      "startDate": this.startDate ? this.selectedStartDate : '',
      "endDate": this.endDate ? this.selectedEndDate : '',
      "companyId": this.companyId
    }
  }

  clear() {
    this.reasonModel = '';
    this.stageModel = '';
    this.startDate = '';
    this.endDate = '';
    this.searchFilter();
  }

  onStartDateValueChange(event: any) {
    this.selectedStartDate = new Date(event);
  }

  onEndDateValueChange(event: any) {
    this.selectedEndDate = new Date(event);
  }

}
