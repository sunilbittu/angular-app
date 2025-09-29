import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { AddEmployeeService } from '../../master/addEmplyee.service';

@Component({
  selector: 'app-ats-candidate-report',
  templateUrl: './ats-candidate-report.component.html',
  styleUrls: ['./ats-candidate-report.component.css']
})
export class AtsCandidateReportComponent implements OnInit {
  public headers: any = ['S.No', 'Candidate Created Date', 'Candidate Name', 'Position Title',  'Candidate Owner', 'Candidate Stage','Candidate Location','Notice Period','Current Salary','Expected Salary' ];
  //public stageList: any = ['New candidate', 'Interested', 'Shortlisted', 'Client Submission', 'Client Interview', 'Offered', 'Hired', 'Started', 'Probation passed'];
  public stageList: any = ['New candidate', 'Interested', 'Shortlisted', 'Submitted', 'Interviewed', 'Offered', 'Hired', 'Started', 'Probation passed','Rejected'];

  public teamMembersHeader: any = ['Name', 'Display Name', 'Last Active'];
  public sources: any = ['Form', 'Social Media', 'Referral', 'Other'];
  public referralList: any = [];
  public userList: any = [];
  public source: any = null;
  public referrer: any = null;
  public user: any = null;
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
  public contarctModel: any = '';
  public UserModel: any = '';
  public selectedStartDate: any = undefined;
  public selectedEndDate: any = undefined;
  public now = new Date();
  public startDate: any = '';
  public endDate: any = '';
  public selectedItemsUser: any = [];
  public selectedItemsStage: any = [];

  public dropdownSettingsUser = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };
  public dropdownSettingsStage = {
    singleSelection: false,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: false,
  };

  onItemSelectUser(data: any) { }
  onItemSelectStage(data: any) { }
  OnStageItemDeSelect(item: any) { }
  OnUserItemDeSelect(item: any) { }
  onSelectAllUser(event: any) { }
  onSelectAllStage(event: any) { }

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService,
    public crudOperationsService: CrudOperationsService, private notification: NotifierService,
    public datePipe: DatePipe, private employeeService: AddEmployeeService) { }

  ngOnInit(): void {
    this.searchFilter();
    this.getEmployees();
    this.getReferralList();
    this.getUserList();
  }

  getUserList() {
    this.spinner.show();
    let api = 'candidate/getCreatedByUser/' + this.companyId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.userList = data.data;
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }

  getReferralList() {
    this.spinner.show();
    let api = 'referral/list/' + this.companyId + '?page=0&size=200';
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.referralList = data.data.content;
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }

  exportTable(type: string) {
    this.companyId = Number(sessionStorage.getItem('companyId'));
    let obj = this.prepareFilterData();
    //spinner show
    var fileType = '';
    if (type == 'EXCEL') {
      fileType = 'CandidateReport.xls';
      let api: any = "additional/reports/candidateList/exportExcel/" + this.companyId + '/true?search=' + this.candidateSearchModel;
      this.crudOperationsService.exportExcelReport2(api, fileType, obj)
    }
    else {
      fileType = 'CandidateReport.pdf';
      let api: any = "additional/reports/candidateList/exportPDF/" + this.companyId + '/true?search=' + this.candidateSearchModel;
      this.crudOperationsService.exportPDF2(api, fileType, obj)
    }
  }

  getEmployees() {
    this.employeeList = [];
    var filterJson = {
      "selectedItemsBranch": [],
      "selectedItemsGrade": [],
      "selectedItemsDepartment": [],
      "selectedItemsDesignation": [],
      "selectedItemsCostCenter": [],
      "selectedItemsProject": [],
      "selectedItemsCategory": [],
      "selectedItemsBank": [],
      "companyId": this.companyId,
      "search": ''
    }

    this.employeeService.getEmployeesByFilter(filterJson)
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
        this.candidateList = data.data;
        this.totalElements=this.candidateList.length;
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

  handlePagination(data: any) {
    this.totalElements = data.data.totalElements;
    this.itemsPerPage = 20;
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
  pageChanged(event: any) {
    this.pageNumber = event - 1;
    this.candidateList();
  }
  prepareFilterData(): any {
    let employeeIdList = [];
    if (this.selectedItemsUser.length > 0) {
      for (let i = 0; i < this.selectedItemsUser.length; i++) {
        employeeIdList.push(this.selectedItemsUser[i].id);
      }
    }
    let stages = '';
    for (var i = 0; i < this.selectedItemsStage.length; i++) {
      stages = stages.concat("'" + this.selectedItemsStage[i] + "'");
    }
    return {
      "candidateStage": this.selectedItemsStage,
      "userIds": employeeIdList,
      "source": this.source,
      "referrer": this.referrer,
      "agreementDate": this.contarctModel,
      "startDate": this.startDate ? this.selectedStartDate : '',
      "endDate": this.endDate ? this.selectedEndDate : '',
      "companyId": this.companyId
    }
  }

  clear() {
    this.selectedItemsStage = [];
    this.selectedItemsUser = [];
    this.startDate = '';
    this.endDate = '';
    this.source = null;
    this.referrer = null;
    this.searchFilter();
  }

  onStartDateValueChange(event: any) {
    this.selectedStartDate = new Date(event);
  }

  onEndDateValueChange(event: any) {
    this.selectedEndDate = new Date(event);
  }
}
