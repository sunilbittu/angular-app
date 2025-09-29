import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-hiring-performance',
  templateUrl: './hiring-performance.component.html',
  styleUrls: ['./hiring-performance.component.css']
})
export class HiringPerformanceComponent implements OnInit {


  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public sourceChannelHeader: any = ['Sourcing Channel', 'Sourced', 'Dropped', 'Active', 'Placed', 'Dropped %', 'Active %', 'Placed %'];
  public recruitmentFunnelHeader: any = ['Stage', 'Total', 'Dropped', 'Dropped %'];
  public recruitmentFunnelByMatchOwnerHeader: any = ['Owner', 'Total', 'New Candidates', 'Interested', 'Shortlisted', 'Client Submission','Client Interview','Offered','Hired','Started','Probation Passed'];
  //public recruitmentFunnelByJobHeader: any = ['Job','Client', 'Total', 'New Candidates', 'Interested', 'Shortlisted', 'Client Submission','Client Interview','Offered','Hired','Started','Probation Passed'];
  public recruitmentFunnelByJobHeader: any = ['Job','Client', 'Total Candidates', 'New Candidates', 'Client Submission','Client Interview','Offered','Rejected','Started','Probation Passed'];
  public submittedtointerviewRatioSourceChannelHeader: any = ['Submitted to Interview %', 'Total Of Submitted', 'Total Of Interviewed'];
  public interviewtoofferRatioSourceChannelHeader: any = ['Interviewed to offered %', 'Total Of Interviewed', 'Total Of Offered'];
  public offertoplacementRatioSourceChannelHeader: any = ['Offer to Placement %', 'Total Of Offered', 'Total Of Placed'];
  public submittedtoplacementRatioSourceChannelHeader: any = ['Submitted to Placement %', 'Total Of Submitted', 'Total Of Placed'];
  public addedtosubmittedRatioSourceChannelHeader: any = ['Added to Submitted %', 'Total Of Added', 'Total Of submitted'];
  public addedtoplacementRatioSourceChannelHeader: any = ['Added to Placement %', 'Total Of Added', 'Total Of Placed'];
  public interviewRatioSourceChannelHeader: any = ['Sourcing Channel', 'Interview Ratio'];
  public placementRatioSourceChannelHeader: any = ['Sourcing Channel', 'Placement Ratio'];
  public sourceChannelList: any = [];
  public recruitmentFunnelList: any = [];
  public referrerChannelHeader: any = ['Referrer', 'Referred', 'Dropped', 'Active', 'Placed', 'Dropped %', 'Active %', 'Placed %'];
  public interviewRatioReferrerChannelHeader: any = ['Referrer', 'Interview Ratio'];
  public placementRatioReferrerChannelHeader: any = ['Referrer', 'Placement Ratio'];
  public referrerChannelList: any = [];
  public userPerformanceHeader: any = ['User', 'Sourced', 'Dropped', 'Active', 'Placed', 'Dropped %', 'Active %', 'Placed %'];
  public userPerformanceList: any;
  public statusList: any = ['Active', 'Completed', 'Cancelled', 'On Hold'];
  public recruitmentPerformancePerformanceByUserList: any;
  public recruitmentPerformancePerformanceByJobList: any;

  public selectedStartDate: any = undefined;
  public selectedEndDate: any = undefined;
  public startDate: any = '';
  public endDate: any = '';
  public searchParam: any = '';
  public searchParam1: any = '';
  public selectedItemsStatus: any = [];

  public dropdownSettingsStatus = {
    singleSelection: false,
    // idField: 'clientId',
    // textField: 'clientName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 4,
    allowSearchFilter: false,
  };

  constructor(private spinner: NgxSpinnerService,public datePipe: DatePipe,
    public crudOperationsService: CrudOperationsService, private notification: NotifierService) { }

  ngOnInit(): void {
    //this.getRecruitmentFunnel();
  }

  showChannelPerformance(type: string) {
    this.startDate='';
    this.endDate='';
    console.log(type)
    switch (type) {
      case 'Sourcing':
        this.getSourcingChannelPerformanceList();
        break;
      case 'Referrer':
        this.getReferrerPerformanceList();
        break;
      case 'User':
        this.getUserPerformanceList();
        break;
      case 'recruitment-funnel':
        this.getRecruitmentFunnel();
        break;
      case 'recruitment-funnel-by-user':
        //this.getRecruitmentPerformancePerformanceByUser();
        break;
      case 'recruitment-funnel-by-job':
        //this.getRecruitmentPerformancePerformanceByJob();
        break;
    }
  }
  searchFilter() {
    this.getRecruitmentFunnel();
  }
  searchReferrerPerformanceList(){
    this.getReferrerPerformanceList();
  }
  searchFilterByJob(){
    this.getRecruitmentPerformancePerformanceByJob();
  }

  searchFilterByMatchOwner(){
    this.getRecruitmentPerformancePerformanceByUser();
  }
  clear(){
    this.startDate ='';
    this.endDate = '';
  }
  onStartDateValueChange(event: any) {
    this.selectedStartDate = new Date(event);
  }

  onEndDateValueChange(event: any) {
    this.selectedEndDate = new Date(event);
  }
  getUserPerformanceList() {
    this.spinner.show();
    let api = 'candidate/getUserPerformance/' + this.companyId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.userPerformanceList = data.data;
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }
  getReferrerPerformanceList() {
    this.spinner.show();
    let obj={
      "startDate": this.startDate ? this.selectedStartDate : '',
      "endDate": this.endDate ? this.selectedEndDate : '',
    }
    let api = 'candidate/getReferrerPerformance/' + this.companyId;
    this.crudOperationsService.getFilterData(obj,api).subscribe((data: any) => {
      this.spinner.hide();
      this.referrerChannelList = data.data;
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }
  serachSourcingChannelPerformanceList(){
    this.spinner.show();
    let obj={
      "startDate": this.startDate ? this.selectedStartDate : '',
      "endDate": this.endDate ? this.selectedEndDate : '',
    }
    let api = 'candidate/getSourcingPerformance/' + this.companyId;
    this.crudOperationsService.getFilterData(obj,api).subscribe((data: any) => {
      this.spinner.hide();
      this.sourceChannelList = data.data;
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }
  getSourcingChannelPerformanceList() {
    this.spinner.show();
    let api = 'candidate/getSourcingPerformance/' + this.companyId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.sourceChannelList = data.data;
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }

  onItemSelectStatus(data: any) {
    this.selectedItemsStatus.push(data);
  }
  onSelectAllStatus(event: any) {
    this.selectedItemsStatus = event;
  }

  OnItemStatusDeSelect(item: any) {
    console.log(item);
   //console.log(this.selectedItemsBranch);
   for (let i = 0; i < this.selectedItemsStatus.length; i++) {

     if (this.selectedItemsStatus[i] == item) {


       this.selectedItemsStatus.splice(i, 1);
     }
   }
 }

  getRecruitmentFunnel() {

    let obj={
      "startDate": this.startDate ? this.selectedStartDate : '',
      "endDate": this.endDate ? this.selectedEndDate : '',
    }
    this.spinner.show();
    let api = 'candidate/getRecruitmentFunnel/' + this.companyId;
    this.crudOperationsService.getFilterData(obj,api).subscribe((data: any) => {
      this.spinner.hide();
      this.recruitmentFunnelList = data.data;
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }

  getRecruitmentPerformancePerformanceByUser() {
    let obj={
      "startDate": this.startDate ? this.selectedStartDate : '',
      "endDate": this.endDate ? this.selectedEndDate : '',
    }
    //console.log(this.searchParam)
    console.log(obj)
    this.spinner.show();
    let api = 'candidate/getRecruitmentPerformancePerformanceByUser/' + this.companyId;
    this.crudOperationsService.getFilterData(obj,api).subscribe((data: any) => {
      this.spinner.hide();
      if(this.searchParam){
        this.recruitmentPerformancePerformanceByUserList = data.data.filter((item: any) =>
          item.name.toLowerCase().includes(this.searchParam.toLowerCase())
        );      }
      else{
        this.recruitmentPerformancePerformanceByUserList = data.data;
      }
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }
  getRecruitmentPerformancePerformanceByJob() {
    let obj={
      "startDate": this.startDate ? this.selectedStartDate : '',
      "endDate": this.endDate ? this.selectedEndDate : '',
      "status":this.selectedItemsStatus
    }
    console.log(obj)
    this.spinner.show();
    let api = 'candidate/getRecruitmentPerformancePerformanceByJob/' + this.companyId;
    this.crudOperationsService.getFilterData(obj,api).subscribe((data: any) => {
      this.spinner.hide();
      if(this.searchParam1){
        this.recruitmentPerformancePerformanceByJobList = data.data.filter((item: any) =>
          item.jobName.toLowerCase().includes(this.searchParam1.toLowerCase()) ||
          item.clientName.toLowerCase().includes(this.searchParam1.toLowerCase())
        );      
      }
      else{
        this.recruitmentPerformancePerformanceByJobList = data.data;
      }
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }

  exportTable(value: string, type: string, rootapi: string, rowcount: any) {
    let obj={
      "startDate": this.startDate ? this.selectedStartDate : '',
      "endDate": this.endDate ? this.selectedEndDate : '',
      "status":this.selectedItemsStatus
    }
    this.companyId = Number(sessionStorage.getItem('companyId'));
    //spinner showexport
    //var rootapi = 'reports/channel-performance/exportPDF/';
    var fileType = '';
    if (type == 'EXCEL') {
      fileType = value+'-PerformanceReport.xls';
      let api: any = rootapi + this.companyId + '/' + value+ '/' + rowcount;
      this.crudOperationsService.exportExcelReport1(api, fileType,obj)
    } else {
      fileType = value+'-PerformanceReport.pdf';
      let api: any = rootapi + this.companyId + '/' + value+ '/' + rowcount;
      this.crudOperationsService.exportPDF1(api, fileType,obj)
    }
  }
  exportSourceTable(value: string, type: string, rootapi: string) {
    let obj={
      "startDate": this.startDate ? this.selectedStartDate : '',
      "endDate": this.endDate ? this.selectedEndDate : '',
      "status":this.selectedItemsStatus
    }
    this.companyId = Number(sessionStorage.getItem('companyId'));
    //spinner show
    //var rootapi = 'reports/channel-performance/exportPDF/';
    var fileType = '';
    if (type == 'EXCEL') {
      fileType = value+'-PerformanceReport.xls';
      let api: any = rootapi + this.companyId + '/' + value;
      this.crudOperationsService.exportExcelReport1(api, fileType,obj)
    } else {
      fileType = value+'-PerformanceReport.pdf';
      let api: any = rootapi + this.companyId + '/' + value;
      this.crudOperationsService.exportPDF1(api, fileType,obj)
    }
  }
}
