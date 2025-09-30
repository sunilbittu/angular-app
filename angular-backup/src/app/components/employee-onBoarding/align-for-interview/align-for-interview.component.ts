import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-align-for-interview',
  templateUrl: './align-for-interview.component.html',
  styleUrls: ['./align-for-interview.component.css']
})
export class AlignForInterviewComponent implements OnInit {
  public headers: any = ["Candidate Id", "Candidate Name", "JD ID", "Interview Date And Time", "Interviewers Name", "HR Name", "Mode Of Interview", "Action"]
  public results: any = ["Align for Interview", "Reject"];
  public candidateData!: any[];
  public candidateViewData: any = {};
  public jdIdData: any = [];
  public candidetId!: number;
  public togglebtn: boolean = true;
  public toDay = new Date();
  public newResourceIndent: any = {};
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public submitProcessing: boolean = false;
  public submitText: any = 'Save';
  public showExternal: boolean = false;
  public companyId = sessionStorage.getItem("companyId");
  public employeeList!: any[];
  public interviewDate: any = '';
  public result: any = '';
  public remarks: any = '';
  public minutesGap = 5;
  public interviewTime: any = '';
  public interviewerId: any = '';
  public hrId: any = '';
  public modeOfInterview: any = '';
  public hrList: any = [];
  public managerList: any = [];
  public description: any = '';
  public mailSubmitted: boolean = false;
  p: number = 1;
  //pagination
  itemsPerPage: any;
  totalItems: any;
  currentPage: any;
  totalElements: number = 0;
  showingFrom: number = 0;
  showingTo: number = 0;
  public pageNumber: Number = 0;

  constructor(private formBuilder: FormBuilder, private crudOperationsService: CrudOperationsService,
    private notification: NotifierService, private datePipe: DatePipe, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.fetchCandidateList();
    this.getAllEmployees();
    this.getHRList();
    this.getManagerList();
  }
  getManagerList() {
    let listApi = 'employee/get_manager_list?companyId=' + this.companyId;
    this.crudOperationsService.getList(listApi)
      .subscribe((data: any) => {
        this.managerList = data.data;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
        })
  }
  getHRList() {
    let listApi = 'employee/get_hr_list?companyId=' + this.companyId;
    this.crudOperationsService.getList(listApi)
      .subscribe((data: any) => {
        this.hrList = data.data;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
        })
  }

  onDateValueChange(event: any) {
    this.interviewDate = this.datePipe.transform(event, 'dd-MM-yyyy');
  }

  viewJD(data: any) {
    this.spinner.show();
    let jobidRequired: any = data;
    let api = "resourceindentrequest/" + jobidRequired;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      (<any>$('#view-jd')).modal('show');
      this.newResourceIndent = data.data;
    },
      (error) => {
        (<any>$('#view-jd')).modal('hide');
        this.spinner.hide();
        this.notification.notify('error', 'Something Went Worng');
      })
  }

  editCandidate(data: any) {
    this.togglebtn = false;
    this.clear();
    this.candidateViewData.candidateId = data.candidetId;
    this.candidateViewData.candidateName = data.candidetName;
    this.candidateViewData.jobId = data.jobId;
    if (data.interviewDate) {
      this.interviewDate = this.datePipe.transform(data.interviewDate, 'dd-MM-yyyy');
    }
    if (data.interviewTime) {
      this.interviewTime = data.interviewTime;
    }
    if (data.hrId) {
      this.hrId = data.hrId;
    }
    if (data.interviewerId) {
      this.interviewerId = data.interviewerId;
    }
    if (data.modeOfInterview) {
      this.modeOfInterview = data.modeOfInterview;
    }
  };

  downloadDocumentAttachment(filePath: string, fileName: string) {
    let downloadApi = 'resourceindentrequest/jobresourcedownload?filePath=' + filePath;
    this.crudOperationsService.downloadDocument(downloadApi)
      .subscribe((response: any) => {
        let blob: any = new Blob([response], { type: "application/octet-stream" }); // must match the Accept type
        const filename = fileName;
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        console.log(fileName)
        anchor.download = filename;
        anchor.href = url;
        anchor.click();
      },
        (error) => {
          this.notification.notify('error', 'Error while downloading the file');
        }
      )
  }

  getAllEmployees() {
    let listApi = `employee/emp_list_company/${this.companyId}`;
    this.crudOperationsService.getList(listApi)
      .subscribe((data: any) => {
        this.employeeList = data.data.content;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
        })
  }
  fetchCandidateList() {
    this.spinner.show();
    let api = "referralrecruitment/align_for_interview_candidate_list/" + this.companyId
      + '?page=' + this.pageNumber + '&size=10';
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.candidateData = data.data.content;
      this.candidateData.sort((a: any, b: any) => a.candidetId - b.candidetId);
      //pagination call
      this.handlePagination(data);
    },
      (error) => {
        this.spinner.hide();
        this.notification.notify('error', 'Something Went Wrong');
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
    if (this.totalItems == 0) {
      this.showingFrom = 0;
    }
  }
  pageChanged(event: any) {
    this.pageNumber = event - 1;
    this.fetchCandidateList();
  }

  onSubmit() {
    this.submitted = true;
    if (this.interviewDate && this.interviewTime && this.hrId && this.interviewerId && this.modeOfInterview) {
      this.spinner.show();
      let interviewerName = '';
      let hrName = '';
      this.managerList.forEach((emp: any) => {
        if (emp.employeeId == this.interviewerId) {
          interviewerName = emp.firstName + ' ' + emp.lastName;
        }
      })
      this.hrList.forEach((emp: any) => {
        if (emp.employeeId == this.hrId) {
          hrName = emp.firstName + ' ' + emp.lastName;
        }
      })
      let obj = {
        candidateId: this.candidateViewData.candidateId,
        interviewDate: this.interviewDate,
        interviewTime: this.interviewTime,
        interviewerId: this.interviewerId,
        interviewerName: interviewerName,
        hrId: this.hrId,
        hrName: hrName,
        modeOfInterview: this.modeOfInterview,
        result: this.result,
        remarks: this.remarks
      };
      this.crudOperationsService.create(JSON.stringify(obj), "referralrecruitment/update_align_for_interview_candidate").subscribe((data: any) => {
        this.spinner.hide();
        (<any>$('#myModal-add')).modal('hide');
        this.fetchCandidateList();
        this.clear();
      },
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Wrong');
        })
    }
  }

  clear() {
    this.submitted = false;
    this.interviewDate = '';
    this.interviewTime = '';
    this.hrId = '';
    this.interviewerId = '';
    this.modeOfInterview = '';
  }

  timeChange1(event: any) {
    console.log(event)
  }

  sendMail() {
    this.mailSubmitted = true;
    if (this.description) {
      this.spinner.show();
      let obj = {
        candidateId: this.candidateViewData.candidateId,
        description: this.description
      };
      this.crudOperationsService.create(JSON.stringify(obj), "referralrecruitment/send_mail_to_align_for_interview_candidate").subscribe((data: any) => {
        this.spinner.hide();
        this.mailSubmitted = false;
        (<any>$('#send-mail')).modal('hide');
        this.fetchCandidateList();
        this.clear();
      },
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Wrong');
        })
    }
  }

  clearMail() {
    this.mailSubmitted = false;
    this.description = '';
  }
}
