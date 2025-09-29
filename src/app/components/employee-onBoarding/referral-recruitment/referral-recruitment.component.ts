import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-referral-recruitment',
  templateUrl: './referral-recruitment.component.html',
  styleUrls: ['./referral-recruitment.component.css']
})
export class ReferralRecruitmentComponent implements OnInit {
  public candidateStatuses: any = ["Screening & Evaluation"]
  public headers: any = ["Candidate Id", "Candidate Name", "Phone No.", "Email ID", "JD ID", "Status", "Joining Date", "Action"]
  public editButtonEnable: boolean = true;
  public candidateData!: any[];
  public jdIdData: any = [];
  public candidateObject: any;
  public candidetId!: number;
  public togglebtn: boolean = true;
  public editStatusbtn: boolean = false;
  public hideStatusWhileEditing: boolean = false;
  public toDay = new Date();
  public joiningDate: any;
  public jdIdData1: any;
  public newResourceIndent: any = {};
  public submitted: boolean = false;
  public emailExists: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public submitProcessing: boolean = false;
  public submitText: any = 'Save';
  public showExternal: boolean = false;
  public companyId = sessionStorage.getItem("companyId");
  public employeeList!: any[];
  constructor(private formBuilder: FormBuilder, private crudOperationsService: CrudOperationsService,
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
    this.getAllEmployees();
  };
  onItemSelect(data: any) {
    console.log('data', data);
  }
  onSelectAll(event: any) {
    console.log('data', event);
  }
  onDeSelectAll(event: any) {
    console.log('data', event);
  }
  onItemDeSelect(data: any) {
    console.log('data', data);
  }
  CandidatesForm: any = this.formBuilder.group({
    candidetName: ["", Validators.required],
    phonenumber: ["", Validators.required],
    emailId: ["", Validators.required],
    jobId: ["", Validators.required],
    candidetStatus: ["", Validators.required],
    joiningDate: [""],
    referencedType: ["Internal"],
    referencedPersonName: [""]
  });
  get form_() { return this.CandidatesForm.controls; };
  addClick() {
    this.togglebtn = true;
    this.hideStatusWhileEditing = false;
    this.CandidatesForm.reset();
    this.CandidatesForm = this.formBuilder.group({
      candidetName: ["", Validators.required],
      phonenumber: ["", Validators.required],
      emailId: ["", Validators.required],
      jobId: [''],
      candidetStatus: [''],
      referencedType: ["Internal"],
      referencedPersonName: [""]
    });
  }

  checkIfEmailExists(data: any) {
    this.emailExists = false;
    if (this.togglebtn) {
      let emailtovalidate2: any[] = this.candidateData.filter(x => x.emailId == this.CandidatesForm.value.emailId);
      if (emailtovalidate2.length > 0) {
        this.emailExists = true;
      }
    } else {
      let list1: any[] = this.candidateData.filter(x => x.candidetId != this.candidetId);

      let list2: any[] = list1.filter(x => x.emailId == this.CandidatesForm.value.emailId);
      if (list2.length > 0) {
        this.emailExists = true;
      }
    }


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
  fetchReferalRecruitment() {
    this.spinner.show();
    let api = "referralrecruitment/list/" + this.companyId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.candidateData = data.data.content;
      this.candidateData.sort((a: any, b: any) => a.candidetId - b.candidetId);
    },
    (error)=>{
      this.spinner.hide();
      this.notification.notify('danger','Something Went Wrong');
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
  onSubmit() {
    this.submitted = true;
    let emailtovalidate: any[] = this.candidateData.filter(x => x.emailId == this.CandidatesForm.value.emailId);
    console.log(emailtovalidate.length)
    if (this.CandidatesForm.valid == true && emailtovalidate.length == 0) {
      this.CandidatesForm.value.company = { companyId: this.companyId };
      if (!this.showExternal) {
        this.setEmployeeDetails();
      } else {
        this.CandidatesForm.value.employeeId = '';
      }
      this.CandidatesForm.value.resourceIndentRequest = { "jobId": this.CandidatesForm.value.jobId };
      this.CandidatesForm.value.verificationStatus = "In Progress";
      this.crudOperationsService.create(this.CandidatesForm.value, "referralrecruitment").subscribe((data: any) => {
        this.submitted = false;
        (<any>$('#myModal-add')).modal('hide');
        this.fetchReferalRecruitment();
        this.CandidatesForm.reset();
      })
    }
  }
  setEmployeeDetails() {
    this.employeeList.forEach(emp => {
      if (emp.employeeId == this.CandidatesForm.value.referencedPersonName) {
        this.CandidatesForm.value.referencedPersonName = emp.firstName + ' ' + emp.lastName;
        this.CandidatesForm.value.employeeId = emp.employeeId;
      }
    })
  };

  editCandidate(data: any) {
    this.submitText = 'Update';
    this.togglebtn = false;
    this.hideStatusWhileEditing = true;
    this.candidetId = data.candidetId;
    let referencedPersonName = '';
    if (data.referencedType == 'Internal') {
      referencedPersonName = data.employeeId;
      this.showExternal = false;
    } else {
      referencedPersonName = data.referencedPersonName;
      this.showExternal = true;
    }
    this.CandidatesForm = this.formBuilder.group({
      candidetName: [data.candidetName, Validators.required],
      phonenumber: [data.phonenumber, Validators.required],
      emailId: [data.emailId, Validators.required],
      jobId: [data.jobId, Validators.required],
      candidetStatus: [data.candidetStatus, Validators.required],
      referencedType: [data.referencedType],
      referencedPersonName: [referencedPersonName]
    });
  };

  updateReferalRecruitment() {
    this.submitted = true;
    if (this.CandidatesForm.valid) {
      let api: any = "referralrecruitment/" + this.candidetId;
      this.CandidatesForm.value.company = { companyId: this.companyId };
      if (!this.showExternal) {
        this.setEmployeeDetails();
      } else {
        this.CandidatesForm.value.employeeId = '';
      }
      this.crudOperationsService.update(this.CandidatesForm.value, api).subscribe((data: any) => {
        this.submitted = false;
        (<any>$('#myModal-add')).modal('hide');
        this.fetchReferalRecruitment();
        this.togglebtn = true;
        this.CandidatesForm.reset();
        this.hideStatusWhileEditing = false;
      })
    }
  };

  removeCandidate(candidetId: number) {
    this.candidetId = candidetId;
  }

  deleteCandidate() {
    let api: any = "referralrecruitment/" + this.candidetId;
    this.crudOperationsService.delete(api).subscribe((data: any) => {
      this.fetchReferalRecruitment();
    })
  };
  clear() {
    this.CandidatesForm.reset();
    this.hideStatusWhileEditing = false;
    this.submitText = 'Save';
    this.submitted = false;
    this.emailExists = false;
  }

  updateMultipleStatuses() {

    let api: any = 'referralrecruitment/update_multiple_status';
    // this.candidateData.joiningDate=this.joiningDate;
    console.log("sadfsadfas", this.candidateData)
    this.crudOperationsService.updateList(this.candidateData, api).subscribe((data: any) => {
      console.log(data);
      this.fetchReferalRecruitment();
      this.editStatusbtn = false;

    })

  }

  editStatus() {
    this.editStatusbtn = true;
  }

  cancelUpdateMultipleStatuses() {
    this.editStatusbtn = false;
    // this.candidateData=[];
    this.fetchReferalRecruitment();

  }

  onStartDateValueChange(event: any) {
    this.joiningDate = this.datePipe.transform(event, 'dd-MM-yyyy');
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

  handleReferencedType(type: any) {
    this.showExternal = type == 'External' ? true : false;
  }

  submit() {
    if (this.importFileData != null) {
      this.spinner.show();
      this.toggleLoader = true;
      this.importResult = [];
      this.disableImport = true;
      this.importText = 'Please Wait.!!';
      console.log(this.importFileData);
      const form = new FormData();
      let scheduleObj:any = {};
      scheduleObj.companyId = this.companyId;
      form.append('data', JSON.stringify(scheduleObj));
      form.append('excel', this.importFileData);
      let url = 'referralrecruitment/importExcel';
      this.crudOperationsService.importFile(form, url).subscribe((data: any) => {
        this.spinner.hide();
        this.successCount = 0;
        this.errorCount = 0;
        this.importResult = data.data;
        this.toggleLoader = false;
        this.disableImport = false;
        this.importText = 'Import';
        for (let i = 0; i < this.importResult.length; i++) {
          if (this.importResult[i].errors.length > 0) {
            this.errorCount = this.errorCount + 1;
          } else {
            this.successCount = this.successCount + 1;
          }
        }
        this.showSuccessMsg = this.successCount > 0;
        this.showErrorMsg = this.errorCount > 0;
        if(this.showSuccessMsg) {
          this.fetchReferalRecruitment();
        }
      });
    }
  }

  clickImport(){
    this.importResult = [];
    this.importText = 'Import';
    this.showSuccessMsg = false;
    this.showErrorMsg = false;
    this.importFileModel = '';
    this.importFileData = null;
    this.toggleLoader = false;
  }

  public importFileData: any = File;
  public importText = 'Import';
  public listOfErrors: any[] = [];
  public importResult: any[] = [];
  public showSuccessMsg = false;
  public showErrorMsg = false;
  public successCount = 0;
  public errorCount = 0;
  public errors: any;
  public disableImport: boolean = false;
  public toggleLoader: boolean = false;
  public importEmpty: boolean = false;
  public importFileModel: any;
  importFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      console.log(event.target.files[0].type);
      if (event.target.files[0].type === 'application/vnd.ms-excel' || event.target.files[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        this.importFileData = event.target.files[0];
      }
    }
  }
}