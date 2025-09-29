import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { AddEmployeeService } from '../../master/addEmplyee.service';

@Component({
  selector: 'app-candidate-info-db-report',
  templateUrl: './candidate-info-db-report.component.html',
  styleUrls: ['./candidate-info-db-report.component.css']
})
export class CandidateInfoDbReportComponent implements OnInit {

  public validationText: string = '';
  public showView: any = false;
  public selectedCandidateCount: number = 0;
  public submitProcessing = false;
  public headerList: any = [];
  public candidateList: any = [];

  public candidateDetails: any = [
    { key: 'candidateName', value: 'Candidate Name', selected: false },
    { key: 'candidateReference', value: 'Candidate Reference', selected: false },
    { key: 'gender', value: 'Gender', selected: false },
    { key: 'diploma', value: 'Highest Qualification', selected: false },
    { key: 'university', value: 'University', selected: false },
    { key: 'currentCompany', value: 'Current Company', selected: false },
    { key: 'currentPosition', value: 'Current Position', selected: false },
    { key: 'candidateLocation', value: 'Candidate Location', selected: false },
    { key: 'birthdate', value: 'Birth Date', selected: false },
    { key: 'candidateAddress', value: 'Candidate Address', selected: false },
    { key: 'candidateEmailAddress', value: 'Candidate Email Address', selected: false },
    { key: 'candidatePhoneNumber', value: 'Candidate Phone Number', selected: false },
    { key: 'skype', value: 'Skype', selected: false },
    { key: 'otherContact', value: 'Other Contact', selected: false },
    { key: 'fatherName', value: 'Father Name', selected: false },
    { key: 'fatherMobileNumber', value: 'Father\'s Contact Number', selected: false },
    { key: 'motherName', value: 'Mother Name', selected: false },
    { key: 'motherMobileNumber', value: 'Mother\'s Contact Number', selected: false }
  ];

  public additionalDetails: any = [
    { key: 'currentDepartment', value: 'Current Department', selected: false },
    { key: 'candidateIndustry', value: 'Candidate Industry', selected: false },
    { key: 'yearsOfExperience', value: 'Years of Experience', selected: false },
    { key: 'graduationDate', value: 'Graduation Date', selected: false },
    { key: 'currentSalary ', value: 'Current Salary', selected: false },
    { key: 'currentBenefits', value: 'Current Benefits', selected: false },
    { key: 'noticePeriod', value: 'Notice Period', selected: false },
    { key: 'expectedSalary', value: 'Expected Salary', selected: false },
    { key: 'expectedBenefits', value: 'Expected Benefits', selected: false },
    { key: 'nationalities', value: 'Nationalities', selected: false },
    { key: 'languages', value: 'Languages', selected: false },
    { key: 'candidateRefeenceName', value: 'Candidate Reference Name', selected: false },
    { key: 'gdprConsent', value: 'GDPR Consent', selected: false },
    { key: 'candidateDescription', value: 'Candidate Description', selected: false }
  ]

  public logBookDetails: any = [
    { key: 'source', value: 'Source', selected: false },
    { key: 'dateResumeAdded', value: 'Date Resume added', selected: false },
    { key: 'createdby', value: 'Created by', selected: false },
    { key: 'lastUpdated', value: 'Last updated', selected: false },
  ]

  public otherDetails: any = [
    { key: 'skills', value: 'Skills', selected: false },
    { key: 'education', value: 'Education', selected: false },
    { key: 'experiance', value: 'Experiance', selected: false },
    { key: 'jobs', value: 'Jobs', selected: false },
  ]

  public stageList: any = ['New candidate', 'Interested', 'Shortlisted', 'Client Submission', 'Client Interview', 'Offered', 'Hired', 'Started', 'Probation passed'];
  public teamMembersHeader: any = ['Name', 'Display Name', 'Last Active'];
  public sources: any = ['Form', 'Social Media', 'Referral', 'Other'];
  public referralList: any = [];
  public userList: any = [];
  public source: any = null;
  public referrer: any = null;
  public user: any = null;
  public teamMembersList: any = [];
  public employeeList: any = [];
  public id: any;
  public candidateSearchModel = '';
  public api = 'candidate'
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public employeeId: any = Number(sessionStorage.getItem('empId'));
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


  constructor(private spinner: NgxSpinnerService,
    public crudOperationsService: CrudOperationsService, private notification: NotifierService,
    public datePipe: DatePipe, private employeeService: AddEmployeeService) { }

  ngOnInit(): void {
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
    let headerList = [];
    const sItems = this.candidateDetails.filter((item: any) => item.selected === true);
    if (sItems.length > 0) {
      for (let i = 0; i < this.candidateDetails.length; i++) {
        if (this.candidateDetails[i].selected) {
          headerList.push(this.candidateDetails[i]);
        }
      }
    }
    const aItems = this.additionalDetails.filter((item: any) => item.selected === true);
    if (aItems.length > 0) {
      for (let i = 0; i < this.additionalDetails.length; i++) {
        if (this.additionalDetails[i].selected) {
          headerList.push(this.additionalDetails[i]);
        }
      }
    }

    const lItems = this.logBookDetails.filter((item: any) => item.selected === true);
    if (lItems.length > 0) {
      for (let i = 0; i < this.logBookDetails.length; i++) {
        if (this.logBookDetails[i].selected) {
          headerList.push(this.logBookDetails[i]);
        }
      }
    }
    const oItems = this.otherDetails.filter((item: any) => item.selected === true);
    if (oItems.length > 0) {
      for (let i = 0; i < this.otherDetails.length; i++) {
        if (this.otherDetails[i].selected) {
          headerList.push(this.otherDetails[i]);
        }
      }
    }
    if (sItems.length > 0 || aItems.length > 0 || lItems.length > 0 || oItems.length > 0) {
      this.submitProcessing = true;
      let dataObj = {
        candidateReportDTO: this.prepareFilterData(),
        headerList: headerList
      }
      // this.companyId = Number(sessionStorage.getItem('companyId'));
      // let obj = this.prepareFilterData();
      //spinner show
      var fileType = '';
      if (type == 'EXCEL') {
        fileType = 'CandidatesDetailedReport.xls';
        let api: any = 'additional/reports/candidateDetailedExport';
        this.crudOperationsService.exportExcelReport2(api, fileType, dataObj)
      }
    }
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
    // this.searchFilter();
  }

  onStartDateValueChange(event: any) {
    this.selectedStartDate = new Date(event);
  }

  onEndDateValueChange(event: any) {
    this.selectedEndDate = new Date(event);
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

  selectAllCandidateDetails(event: any) {
    const checked = event.target.checked;
    this.validationText = '';
    this.candidateDetails.forEach((item: any) => item.selected = checked);
  }

  selectAllAdditionalDetails(event: any) {
    const checked = event.target.checked;
    this.validationText = '';
    this.additionalDetails.forEach((item: any) => item.selected = checked);
  }

  selectAllLogBookDetails(event: any) {
    const checked = event.target.checked;
    this.validationText = '';
    this.logBookDetails.forEach((item: any) => item.selected = checked);
  }

  onClickCheckBox(value: any, type: any) {
    let i: any;
    switch (type) {
      case 'Summary':
        i = this.candidateDetails.findIndex((obj: any) => obj.value == value);
        this.candidateDetails[i].selected = !this.candidateDetails[i].selected;
        break;

      case 'Additional':
        i = this.additionalDetails.findIndex((obj: any) => obj.value == value);
        this.additionalDetails[i].selected = !this.additionalDetails[i].selected;
        break;

      case 'LogBook':
        i = this.logBookDetails.findIndex((obj: any) => obj.value == value);
        this.logBookDetails[i].selected = !this.logBookDetails[i].selected;
        // if (value == 'Source') {
        //   i = this.logBookDetails.findIndex((obj: any) => obj.value == 'Source Value');
        //   this.logBookDetails[i].selected = !this.logBookDetails[i].selected;
        // }
        break;

      case 'Other':
        i = this.otherDetails.findIndex((obj: any) => obj.value == value);
        this.otherDetails[i].selected = !this.otherDetails[i].selected;
        break;

      default:
        break;
    }
  }

  searchData() {
    this.spinner.show();
    let headerList = [];
    const sItems = this.candidateDetails.filter((item: any) => item.selected === true);
    if (sItems.length > 0) {
      for (let i = 0; i < this.candidateDetails.length; i++) {
        if (this.candidateDetails[i].selected) {
          headerList.push(this.candidateDetails[i]);
        }
      }
    }
    const aItems = this.additionalDetails.filter((item: any) => item.selected === true);
    if (aItems.length > 0) {
      for (let i = 0; i < this.additionalDetails.length; i++) {
        if (this.additionalDetails[i].selected) {
          headerList.push(this.additionalDetails[i]);
        }
      }
    }

    const lItems = this.logBookDetails.filter((item: any) => item.selected === true);
    if (lItems.length > 0) {
      for (let i = 0; i < this.logBookDetails.length; i++) {
        if (this.logBookDetails[i].selected) {
          headerList.push(this.logBookDetails[i]);
        }
      }
    }
    const oItems = this.otherDetails.filter((item: any) => item.selected === true);
    if (oItems.length > 0) {
      for (let i = 0; i < this.otherDetails.length; i++) {
        if (this.otherDetails[i].selected) {
          headerList.push(this.otherDetails[i]);
        }
      }
    }
    if (sItems.length > 0 || aItems.length > 0 || lItems.length > 0 || oItems.length > 0) {
      this.submitProcessing = true;
      let dataObj = {
        candidateReportDTO: this.prepareFilterData(),
        headerList: headerList
      }
      this.crudOperationsService.getFilterData(dataObj, 'candidate/candidateDetailedList')
        .subscribe((data: any) => {
          let response = data.data;
          this.headerList = response.headerList;
          this.candidateList = response.candidateList;
          (<any>$('#candidate-team-member-add')).modal('hide');
          this.submitProcessing = false;
          this.spinner.hide();
        },
          (_error) => {
            this.spinner.hide();
            this.submitProcessing = false;
            this.notification.notify('error', 'Something Went Wrong')
          })


    } else {
      this.spinner.hide();
      this.validationText = 'Please select atlease 1 field(s).';
    }
  }
}
