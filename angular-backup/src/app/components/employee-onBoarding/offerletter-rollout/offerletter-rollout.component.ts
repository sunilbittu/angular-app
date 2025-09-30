import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { csLocale } from 'ngx-bootstrap/chronos';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-offerletter-rollout',
  templateUrl: './offerletter-rollout.component.html',
  styleUrls: ['./offerletter-rollout.component.css']
})
export class OfferletterRolloutComponent implements OnInit {

  public candidateStatuses: any = ["Screening", "Evaluation", "Align for Interview", "Technical Round", "HR Round", "Offer Letter Rollout", "Offer Accepted", "Profile Rejected"]
  public headers: any = ["Candidate Id", "Candidate Name", "JD ID", "Interviewer", "HR Name", "Hr Screening Status", "Candidet Status", "Action"]
  public candidateData!: any[];
  public jdIdData: any = [];
  public jdIdData1: any[] = [];
  public filePath: any;
  public candidetId!: number;
  public imageFileName: any;
  public toDay = new Date();
  public newResourceIndent: any;
  public candidateStatusValue: any;
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public companyId = sessionStorage.getItem("companyId");
  public employeeList!: any[];
  public isStatusSelected: boolean = false;
  public selectedFile: any;
  public selectedFileValue: any;
  public fileSelected: boolean = false;
  showAttcahment!: boolean;
  salaryComponentList: any;
  earningList: any;
  deductionList: any;
  otherList: any;
  grossSalary: any;
  netPay: any;
  totalDeductions: any;
  leavesList: any;

  constructor(private formBuilder: FormBuilder, private crudOperationsService: CrudOperationsService,
    private notification: NotifierService, private datePipe: DatePipe, private spinner: NgxSpinnerService, private router: Router) { }

  public dropdownSettings = {
    singleSelection: true,
    idField: 'employeeId',
    textField: 'fullName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
    allowSearchFilter: true
  };
  ngOnInit(): void {
    this.fetchReferalRecruitment();
    this.fetchJobId();
  };

  CandidatesForm: any = this.formBuilder.group({
    candidetName: [{ value: "", disabled: true }, Validators.required],
    phonenumber: [{ value: "", disabled: true }, Validators.required],
    emailId: [{ value: "", disabled: true }, Validators.required],
    jobId: [{ value: "", disabled: true }, Validators.required],
    candidetStatus: ["", Validators.required],
    mailBody: ["", Validators.required],
    selectedFile: [""]


  });
  get form_() { return this.CandidatesForm.controls; };



  fetchReferalRecruitment() {
    this.spinner.show();
    let api = "referralrecruitment/find-by-status3/" + this.companyId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.candidateData = data.data.content;

      this.candidateData.sort((a: any, b: any) => a.candidetId - b.candidetId);
    },
      (error) => {
        this.spinner.hide();
        this.notification.notify('error', 'Something Went Wrong');
      })

  }

  fetchJobId() {
    let api = "resourceindentrequest/getJobIds/" + this.companyId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.jdIdData1 = data.data;
      this.jdIdData = this.jdIdData1.filter((value: any) => {
        return value.hrManagerStatus == "recruitment"
      })
    })
  }


  setEmployeeDetails() {
    this.employeeList.forEach(emp => {
      if (emp.employeeId == this.CandidatesForm.value.referencedPersonName) {
        this.CandidatesForm.value.referencedPersonName = emp.firstName + ' ' + emp.lastName;
        this.CandidatesForm.value.employeeId = emp.employeeId;
      }
    })
  };

  sumOfEarnings() {

  }

  sumOfDeductions() {
    
  }

  viewJD(data: any) {
    let jobidRequired: any = data;
    (<any>$('#view-jd')).modal('show');
    console.log(data)
    this.newResourceIndent = this.jdIdData.filter((value: any) => {
      return value.jobId == jobidRequired;
    })

  }

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

  editCandidate(data: any) {
    this.candidetId = data.candidetId;
    if (data.fileName == null) {
      this.CandidatesForm = this.formBuilder.group({
        candidetName: [data.candidetName, Validators.required],
        phonenumber: [data.phonenumber, Validators.required],
        emailId: [data.emailId, Validators.required],
        jobId: [data.resourceIndentRequest.jobId, Validators.required],
        candidetStatus: ["", Validators.required],
        selectedFile: [""]

      });
      this.showAttcahment = true;

    } else {
      this.CandidatesForm = this.formBuilder.group({
        candidetName: [data.candidetName, Validators.required],
        phonenumber: [data.phonenumber, Validators.required],
        emailId: [data.emailId, Validators.required],
        jobId: [data.resourceIndentRequest.jobId, Validators.required],
        candidetStatus: [data.candidetStatus, Validators.required],
        selectedFile: [""]
      });
      this.showAttcahment = false;
    }


    // 
  };

  viewSalaryLeave(data: any) {
    this.salaryComponentList = [];
    this.earningList = [];
    this.deductionList = [];
    this.otherList = [];
    this.grossSalary = [];
    this.netPay = 0;
    this.totalDeductions = 0;
    this.leavesList = [];
    this.candidetId = data.candidetId;
    let api: any = "OnBoardingCandidetSalaryDetails/salary_leave_display/" + this.candidetId;
    this.crudOperationsService.getList(api).subscribe((res: any) => {
      this.salaryComponentList = res.data;
      if (this.salaryComponentList != null) {
        this.earningList = this.salaryComponentList.earnings;
        this.deductionList = this.salaryComponentList.deductions;
        this.otherList = this.salaryComponentList.others;
        this.grossSalary = this.salaryComponentList.grossSalary;
        this.netPay = this.salaryComponentList.netPay;
        this.totalDeductions = this.salaryComponentList.totalDeduction;
        this.leavesList = res.data.leaveTypeInfo;

      }
    }, (error) => {
    });
  }

  updateReferalRecruitment() {
    this.submitted = true;
    let url: any = "referralrecruitment/statuschnageafterofferrollout/" + this.candidetId + "/" + this.CandidatesForm.value.candidetStatus;
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    this.spinner.show();
    this.crudOperationsService.uploadeDocument1(url, formData).subscribe((data) => {
      this.submitted = false;
      this.notification.notify('Successful', 'Updated Successfully');
      (<any>$('#myModal-edit')).modal('hide');
      this.fetchReferalRecruitment();
      this.spinner.hide();
      if (this.CandidatesForm.value.candidetStatus == 'Negotiation') {
        this.router.navigateByUrl('HRMS/Employee-Onboarding/hr-round');
      }
    }
      ,
      (error) => {
        this.notification.notify('error', 'Error while Updating Status');
        this.spinner.hide();
      })

  };

  clear() {
    this.submitted = false;
  };

  statusChanged() {
    this.isStatusSelected = true;
  }

  sendMailToCandidate(data: any) {
    this.CandidatesForm = this.formBuilder.group({
      candidetName: [data.candidetName, Validators.required],
      phonenumber: [data.phonenumber, Validators.required],
      emailId: [data.emailId, Validators.required],
      jobId: [data.resourceIndentRequest.jobId, Validators.required],
      candidetStatus: [data.candidetStatus, Validators.required],
      mailBody: ["", Validators.required]

    });


  }

  mailReferalRecruitment() {
    this.spinner.show();
    let url2: any = "referralrecruitment/emailCandidate/" + this.CandidatesForm.value.emailId + "/" + this.CandidatesForm.value.mailBody;
    this.crudOperationsService.create(null, url2).subscribe((data) => {
      this.spinner.hide();
      this.submitted = false;
      this.notification.notify('Successful', 'Mail Sent Successfully');
    }
      ,
      (error) => {
        this.notification.notify('error', 'Error while downloading the file');
        this.spinner.hide();
      }
    )
  }

  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    this.fileSelected = false;
  }



  download(data: any) {
    let downloadApi = 'referralrecruitment/offerletterdownload?filePath=' + data.filePath;
    this.crudOperationsService.downloadDocument(downloadApi)
      .subscribe((response: any) => {
        let blob: any = new Blob([response], { type: "application/octet-stream" }); // must match the Accept type
        const filename = data.fileName;
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        console.log(data.fileName)
        anchor.download = filename;
        anchor.href = url;
        anchor.click();
      },
        (error) => {
          this.notification.notify('error', 'Error while downloading the file');
        }
      )
  }




}
