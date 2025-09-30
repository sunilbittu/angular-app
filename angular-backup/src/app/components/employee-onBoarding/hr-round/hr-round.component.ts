import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { AddEmployeeService } from '../../master/addEmplyee.service';

@Component({
  selector: 'app-hr-round',
  templateUrl: './hr-round.component.html',
  styleUrls: ['./hr-round.component.css']
})
export class HrRoundComponent implements OnInit {

  public candidateStatuses: any = ["Screening", "Evaluation", "Align for Interview", "Technical Round", "HR Round", "Offer Letter Rollout", "Offer Accepted", "Profile Rejected"]
  public headers: any = ["Candidate Id", "Candidate Name", "JD ID", "Interviewer", "HR Name", "Hr Screening Status", "Action"]
  public candidateData!: any[];
  public jdIdData: any = [];
  public jdIdData1: any[] = [];
  public filePath: any;
  public salaryComponentList: any;
  public earningList: any = [];
  public branchId: any;
  public deptId: any;
  public deductionList: any = [];
  public otherList: any = [];
  public candidetId!: number;
  public imageFileName: any;
  public toDay = new Date();
  public grossSalary: number = 0;
  public totalDeductions: number = 0;
  public netPay: number = 0;
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
  public submitText: String = 'Save';
  public candidateSalaryStructureId: any = null;
  public saveAlert: boolean = false;
  public updateAlert: boolean = false;
  public leaveText: String = 'Save';
  public leavesList: any[] = [];
  public finalleavesList: any[] = [];
  public onBoardingCandidetSalaryId: any;
  public onboardingCandidetLeaveId: any;
  public candidateApprovedByHr!: boolean;






  constructor(private employeeService: AddEmployeeService, private formBuilder: FormBuilder, private crudOperationsService: CrudOperationsService,
    private notification: NotifierService, private datePipe: DatePipe, private spinner: NgxSpinnerService) { }

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
    candidetHrStatus: ["", Validators.required],
  });
  get form_() { return this.CandidatesForm.controls; };



  fetchReferalRecruitment() {
    this.spinner.show();
    let api = "referralrecruitment/find-by-status2/" + this.companyId;
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

  reset(){
    
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
        candidetHrStatus: ["", Validators.required],
      });
      this.showAttcahment = true;
      console.log(this.showAttcahment)

    } else {
      this.CandidatesForm = this.formBuilder.group({
        candidetName: [data.candidetName, Validators.required],
        phonenumber: [data.phonenumber, Validators.required],
        emailId: [data.emailId, Validators.required],
        jobId: [data.resourceIndentRequest.jobId, Validators.required],
        candidetHrStatus: [data.hrScreeningStatus, Validators.required],
      });
      this.showAttcahment = false;
      console.log(this.showAttcahment)
    }



  };



  updateReferalRecruitment() {
    this.submitted = true;
    let url: any = "referralrecruitment/update_hr_status_candidate/" + this.candidetId;
    if (this.CandidatesForm.valid) {
      this.spinner.show();
      this.crudOperationsService.create(this.CandidatesForm.value.candidetHrStatus, url).subscribe((data) => {
        this.submitted = false;
        this.notification.notify('Successful', 'Updated Successfully');
        (<any>$('#myModal-edit')).modal('hide');
        this.fetchReferalRecruitment();
        this.spinner.hide();
      }
        ,
        (error) => {
          this.notification.notify('error', 'Error while Updating Status');
          this.spinner.hide();
        })
    }

  };

  clear() {
    this.submitted = false;
  };

  statusChanged() {
    this.isStatusSelected = true;
  }

  leaveMapping(data: any) {
    if (data.hrScreeningStatus == 'Approved') {
      this.candidateApprovedByHr = true;
    } else {
      this.candidateApprovedByHr = false;
    }
    this.candidetId = data.candidetId;
    this.CandidatesForm = this.formBuilder.group({
      candidetName: [data.candidetName, Validators.required],
      phonenumber: [data.phonenumber, Validators.required],
      emailId: [data.emailId, Validators.required],
      jobId: [data.resourceIndentRequest.jobId, Validators.required],
      candidetHrStatus: [data.candidetHrStatus, Validators.required],
    });

    this.crudOperationsService.getList('OnBoardingCandidetLeaveDetails/findByCandidetId/' + this.candidetId + '/' + sessionStorage.getItem('companyId')).subscribe((data: any) => {
      this.leavesList = data.data.leaveTypeInfo;
      this.leavesList.sort((a: any, b: any) => a.leaveTypeId - b.leaveTypeId);
      this.onboardingCandidetLeaveId = data.data.onboardingCandidetLeaveId;
      if (this.onboardingCandidetLeaveId == undefined || this.onboardingCandidetLeaveId == null) {
        this.leavesList.forEach((l) => l.currentBal = 0);
      } else {
        this.leaveText = 'Update';
      }
    })

  }

  leavesReferalRecruitment() {
    console.log(this.onboardingCandidetLeaveId, "dfasfs")
    if (this.onboardingCandidetLeaveId != null || this.onboardingCandidetLeaveId != undefined) {
      this.spinner.show();

      let url2: any = "OnBoardingCandidetLeaveDetails/" + this.onboardingCandidetLeaveId;
      const empObj = { 'candidetId': this.candidetId };
      this.leavesList.forEach((l) => {
        let tempObj: any = { 'leaveTypeCode': l.leaveTypeCode, 'openingBal': l.currentBal, 'currentBal': l.currentBal };
        this.finalleavesList.push(tempObj);
      });

      const formObj = { 'referralRecruitment': empObj, 'leaveTypeInfo': this.finalleavesList };
      this.crudOperationsService.update(formObj, url2).subscribe((data) => {
        this.spinner.hide();
        this.submitted = false;
        this.notification.notify('Successful', 'Mail Sent Successfully');
        this.leaveText = 'Save';
        (<any>$('#myModal-mail')).modal('hide');
        this.fetchReferalRecruitment();
        this.saveAlert = true;
        setTimeout(() => {
          this.saveAlert = false;
        }, 4000);
        this.finalleavesList = [];
      }
        ,
        (error) => {
          this.notification.notify('error', 'Error while downloading the file');
          this.spinner.hide();
          this.finalleavesList = [];

        })
    } else {
      this.spinner.show();
      let url2: any = "OnBoardingCandidetLeaveDetails";
      const empObj = { 'candidetId': this.candidetId };
      this.leavesList.forEach((l) => {
        let tempObj: any = { 'leaveTypeCode': l.leaveTypeCode, 'openingBal': l.currentBal, 'currentBal': l.currentBal };
        this.finalleavesList.push(tempObj);
      });

      const formObj = { 'referralRecruitment': empObj, 'leaveTypeInfo': this.finalleavesList };
      this.crudOperationsService.create(formObj, url2).subscribe((data) => {
        this.spinner.hide();
        this.submitted = false;
        this.notification.notify('Successful', 'Mail Sent Successfully');
        this.finalleavesList = [];
        (<any>$('#myModal-mail')).modal('hide');
        this.fetchReferalRecruitment();
        this.saveAlert = true;
        setTimeout(() => {
          this.saveAlert = false;
        }, 4000);
      }
        ,
        (error) => {
          this.notification.notify('error', 'Error while downloading the file');
          this.spinner.hide();
          this.finalleavesList = [];

        })

    }



    console.log(this.finalleavesList, "leaves list");
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

  fetchSalaryMapping(data: any) {
    if (data.hrScreeningStatus == 'Approved') {
      this.candidateApprovedByHr = true;
    } else {
      this.candidateApprovedByHr = false;
    }
    this.candidetId = data.candidetId;
    this.branchId = data.resourceIndentRequest.branchDetail.companyBranchDetailsId;
    this.deptId = data.resourceIndentRequest.department.departmentId;
    this.employeeService.fetchCandidateSalaryMapping(Number(this.deptId), Number(this.branchId), Number(this.companyId), Number(this.candidetId)).subscribe((res: any) => {
      this.salaryComponentList = res.data;
      if (this.salaryComponentList != null) {
        this.candidateSalaryStructureId = res.data.onBoardingCandidetSalaryId;
        this.earningList = this.salaryComponentList.earnings;
        this.deductionList = this.salaryComponentList.deductions;
        this.otherList = this.salaryComponentList.others;
        this.grossSalary = this.salaryComponentList.grossSalary;
        this.netPay = this.salaryComponentList.netPay;
        this.totalDeductions = this.salaryComponentList.totalDeduction;

      }
    }, (error) => {
    });
  }

  sumOfEarnings() {
    this.grossSalary = 0;
    this.earningList.forEach((e: any) => {
      this.grossSalary += e.componentValue;
    });
    this.getNetPay();
  }

  sumOfDeductions() {
    this.totalDeductions = 0;
    this.deductionList.forEach((e: any) => {
      this.totalDeductions += e.componentValue;
    });
    this.getNetPay();
  }

  getNetPay() {
    this.netPay = this.grossSalary - this.totalDeductions;
  }


  onclickSubmit() {
    console.log(this.submitText, this.candidateSalaryStructureId)
    const tempText = this.submitText;
    this.submitText = 'Please wait!!!';
    const empObj = { 'candidetId': this.candidetId };
    const formObj = { 'earnings': this.earningList, 'deductions': this.deductionList, 'others': this.otherList, 'referralRecruitment': empObj, 'grossSalary': this.grossSalary, 'totalDeduction': this.totalDeductions, 'netPay': this.netPay };

    if (tempText == 'Save' && this.candidateSalaryStructureId == null) {
      this.save(formObj, tempText);

    } else {
      this.update(formObj, tempText);

    }
  }

  save(formObj: any, tempText: any) {
    this.employeeService.saveCandidateSalaryStructure(formObj).subscribe((res: any) => {
      if (res.status == "success") {
        (<any>$('#view_emp')).modal('hide');
        this.submitText = tempText;
        this.candidateSalaryStructureId = null;
        this.fetchReferalRecruitment();
        this.saveAlert = true;
        setTimeout(() => {
          this.saveAlert = false;
        }, 4000);
      }
    },
      (error) => {
        (<any>$('#view_emp')).modal('hide');
        this.submitText = tempText;
        this.notification.notify('error', 'Something Went Worng');
      })
  }

  update(formObj: any, tempText: String) {
    this.employeeService.updateCandidateSalaryStructure(this.candidateSalaryStructureId, formObj).subscribe((res: any) => {
      if (res.status == "success") {
        (<any>$('#view_emp')).modal('hide');
        this.submitText = tempText;
        this.candidateSalaryStructureId = null;
        this.fetchReferalRecruitment();
        this.updateAlert = true;
        setTimeout(() => {
          this.updateAlert = false;
        }, 4000);
      }
    },
      (error) => {
        (<any>$('#view_emp')).modal('hide');
        this.submitText = tempText;
        this.notification.notify('error', 'Something Went Worng');
      })
  }



}
