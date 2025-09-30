import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-technical-round',
  templateUrl: './technical-round.component.html',
  styleUrls: ['./technical-round.component.css']
})
export class TechnicalRoundComponent implements OnInit {
  public headers: any = ["Candidate Id", "Candidate Name", "JD ID", "Interview Date And Time", "Technical Results", "Point", "Remarks", "HR Name", "HR Interview Date & Time", "Action"]
  public results: any = ["Selected", "Not Selected"];
  public points: any = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];
  public technicalResult: any = '';
  public point: any = '';
  public technicalRemarks: any = '';
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
  public empId = sessionStorage.getItem("empId");
  public employeeList!: any[];
  public interviewDate: any = '';
  public result: any = '';
  public remarks: any = '';
  public minutesGap = 5;
  public interviewTime: any = '';
  public description: any = '';
  public mailSubmitted: boolean = false;
  public hrInterviewDate: any = '';
  public hrInterviewTime: any = '';
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
    if (data.hrInterviewDate) {
      this.hrInterviewDate = this.datePipe.transform(data.hrInterviewDate, 'dd-MM-yyyy');
    }
    if (data.hrInterviewTime) {
      this.hrInterviewTime = data.hrInterviewTime;
    }
    if (data.point) {
      this.point = data.point;
    }
    if (data.technicalResult) {
      this.technicalResult = data.technicalResult;
    }
    this.technicalRemarks = data.technicalRoundRemarks;
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
    let api = "referralrecruitment/technical_round_candidate_list/" + this.companyId
      + '?interviewerId=' + this.empId + '&page=' + this.pageNumber + '&size=10';
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
    if (this.technicalResult && this.point) {
      if (this.technicalResult == 'Selected') {
        if (this.hrInterviewDate && this.hrInterviewTime) {
          this.updateDetails();
        }
      } else {
        this.updateDetails();
      }
    }
  }
  updateDetails() {
    this.spinner.show();
    let obj = {
      candidateId: this.candidateViewData.candidateId,
      hrInterviewDate: this.hrInterviewDate,
      hrInterviewTime: this.hrInterviewTime,
      point: this.point,
      technicalResult: this.technicalResult,
      technicalRemarks: this.technicalRemarks
    };
    this.crudOperationsService.create(JSON.stringify(obj), "referralrecruitment/update_technical_round_candidate").subscribe((data: any) => {
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

  clear() {
    this.submitted = false;
    this.interviewDate = '';
    this.interviewTime = '';
    this.point = 0;
    this.technicalResult = '';
    this.technicalRemarks = '';
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
      this.crudOperationsService.create(JSON.stringify(obj), "referralrecruitment/send_mail_to_technical_round_candidate").subscribe((data: any) => {
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

  decimalFilter(event: any) {
    const reg = /^-?\d*(\.\d{0,2})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }

  technicalRecultChange() {
    if (this.technicalResult == 'Selected') {
      this.hrInterviewDate = '';
      this.hrInterviewTime = '';
    }
  }
}
