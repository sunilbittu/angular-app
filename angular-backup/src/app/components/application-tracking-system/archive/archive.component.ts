import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { ShareDataService } from 'src/app/services/sharaData.service';
import { AddEmployeeService } from '../../master/addEmplyee.service';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService,
    public crudOperationsService: CrudOperationsService, private notification: NotifierService,
    public datePipe: DatePipe, private employeeService: AddEmployeeService,
    public shareService: ShareDataService, private router: Router) { }

  public headers: any = ['Client Name', 'Client Website', 'Client Industry', 'Client Location', 'Client Address', 'Client Created Date', 'Job Count', 'Client Owner', 'Client Team', 'Client Stage', 'Actions'];
  public jobHeaders: any = ['Position Name', 'Job Client', 'Job Location', 'Headcount', 'Job Stage', 'Minimum Salary', 'Maximum Salary', 'Job Owner', 'Job Team', 'Job Status', 'Actions'];
  public candidateheaders: any = ['Candidate Name', 'Candidate Reference', 'Candidate Location', 'Current Position', 'Current Company', 'Notice Period', 'Current Salary', 'Expected Salary', 'Candidate Owner', 'Candidate Created Date', 'Actions'];
  public tagsList: any = [{ color: 'red', name: 'Critical', selected: false }, { color: 'green', name: 'Difficult', selected: false },
  { color: 'yellow', name: 'Important', selected: false }, { color: 'pink', name: 'Open to foreigners', selected: false }];
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public employeeId: any = Number(sessionStorage.getItem('empId'));
  public clientList: any = [];
  public jobList: any = [];
  public candidateList: any = [];
  public submitTextJob = '';
  public jobSearchModel = '';
  public clientSearchModel = '';
  public candidatesSearchModel = '';
  public submitProcessing = false;
  public clientId: any = '';
  public jobId: any = '';
  public candidateId: any = '';

  public clientForm = this.formBuilder.group({
    clientName: ['', Validators.required],
    clientWebsite: [''],
    clientLocation: [''],
    clientDescription: ['']
  })

  public jobForm = this.formBuilder.group({
    positionName: ['', Validators.required],
    clientId: ['', Validators.required],
    headCount: [''],
    jobLocation: [''],
    contractDetails: [''],
    minSalary: [''],
    maxSalary: [''],
    currency: [''],
    frequency: [''],
    jobDescription: ['']
  })
  public jobsubmitted: boolean = false;

   //pagination
   public p: number = 1;
   public itemsPerPage: any;
   public totalItems: any;
   public currentPage: any;
   public totalElements: number = 0;
   public showingFrom: number = 0;
   public showingTo: number = 0;
   public pageNumber: Number = 0;
 
   //pagination
   public jobp: number = 1;
   public jobitemsPerPage: any;
   public jobtotalItems: any;
   public jobcurrentPage: any;
   public jobtotalElements: number = 0;
   public jobshowingFrom: number = 0;
   public jobshowingTo: number = 0;
   public jobpageNumber: Number = 0;

   //pagination
   public candidatep: number = 1;
   public candidateitemsPerPage: any;
   public candidatetotalItems: any;
   public candidatecurrentPage: any;
   public candidatetotalElements: number = 0;
   public candidateshowingFrom: number = 0;
   public candidateshowingTo: number = 0;
   public candidatepageNumber: Number = 0;
 
   get form_() { return this.clientForm.controls; };
 
   get _form() { return this.clientForm.value };
 
   get jobform_() { return this.jobForm.controls; };
 
   get _formJob() { return this.jobForm.value };

   ngOnInit(): void {
    this.getClients();
    this.getArchivedJobs();
    this.getCandidates();
  }

  getCandidates() {
    this.spinner.show();
    let api = 'candidate/list?companyId=' + this.companyId + '&search=' + this.candidatesSearchModel + '&page=' + this.pageNumber + '&size=20&isArchived=true';
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.candidateList = data.data.content;
      //pagination call
      this.handlePaginationCandidate(data);
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }
  handlePaginationCandidate(data: any) {
    this.candidatetotalElements = data.data.totalElements;
    this.candidateitemsPerPage = 10;
    this.candidatecurrentPage = data.data.pageable.pageNumber + 1;
    this.candidatetotalItems = (data.data.totalPages) * this.candidateitemsPerPage;
    this.candidateshowingFrom = (data.data.pageable.pageNumber * 10) + 1;
    const to = (data.data.pageable.pageNumber + 1) * 10;
    if (this.candidatetotalElements >= to) {
      this.candidateshowingTo = to;
    } else {
      this.candidateshowingTo = this.candidatetotalElements;
    }
  }
  pageChangedCandidate(event: any) {
    this.pageNumber = event - 1;
    this.getCandidates();
  }
  getClients() {
    this.spinner.show();
    let api = 'client/list?companyId=' + this.companyId + '&search=' + this.clientSearchModel + '&username=' + localStorage.getItem("userName")  + '&page=' + this.pageNumber + '&size=20&isArchived=true';
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.clientList = data.data.content;
      this.clientList.map(function (obj: any) {
        obj.selected = false;
      })
      //pagination call
      this.handlePagination(data);
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }
  getArchivedJobs() {
    this.spinner.show();
    let api = 'job/archivedjobs?companyId=' + this.companyId + '&search=' + this.clientSearchModel + '&page=' + this.pageNumber + '&size=20';
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.jobList = data.data.content;
      //pagination call
      this.jobList.map(function (obj: any) {
        obj.selected = false;
      })
      this.handlePagination(data);
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }

  handlePagination(data: any) {
    this.totalElements = data.data.totalElements;
    this.itemsPerPage = 10;
    this.currentPage = data.data.pageable.pageNumber + 1;
    this.totalItems = (data.data.totalPages) * this.itemsPerPage;
    this.showingFrom = (data.data.pageable.pageNumber * 10) + 1;
    const to = (data.data.pageable.pageNumber + 1) * 10;
    if (this.totalElements >= to) {
      this.showingTo = to;
    } else {
      this.showingTo = this.totalElements;
    }
  }
  pageChanged(event: any) {
    this.pageNumber = event - 1;
    this.getClients();
  }

  search() {
    this.getClients();
  }

  public tabType: any = 'Clients';
  setType(type: any) {
    this.tabType = type;
  }

  handleClient(data: any) {
    this.clientId = data.clientId;
  }
  handleJob(data: any) {
    this.jobId = data.id;
  }

  clientArchive() {
    this.spinner.show();
    let api = 'client/undoArchive?id=' + this.clientId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      (<any>$('#client-archive-undo')).modal('hide');
      this.notification.notify('success', data.data);
      this.getClients();
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }
  jobArchive() {
    this.spinner.show();
    let api = 'job/undoArchive?id=' + this.jobId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      (<any>$('#job-archive-undo')).modal('hide');
      this.notification.notify('success', data.data);
      this.getArchivedJobs();
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }

  handleCandidate(data: any) {
    this.candidateId = data.candidateId;
  }

  candidateArchive() {
    this.spinner.show();
    let api = 'candidate/undoArchive?id=' + this.candidateId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      (<any>$('#candidate-archive-undo')).modal('hide');
      this.notification.notify('success', data.data);
      this.getCandidates();
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }

  viewJob(data: any) {
    this.shareService.changeMessage(data);
    this.router.navigateByUrl('HRMS/ATS/jobs');
  }
}
