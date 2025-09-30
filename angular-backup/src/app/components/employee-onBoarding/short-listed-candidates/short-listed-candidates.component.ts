import { APP_ID, Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-short-listed-candidates',
  templateUrl: './short-listed-candidates.component.html',
  styleUrls: ['./short-listed-candidates.component.css']
})
export class ShortListedCandidatesComponent implements OnInit {
  public candidateData: any;
  public jdIdData1: any;
  public jdIdData: any;
  public newResourceIndent: any;

  constructor(private notification: NotifierService, private crudOperationsService: CrudOperationsService,
    private router: Router, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.fetchShortlistedCandidates();
    this.fetchJobId();

  }
  public headers: any = ["Candidate Id", "Candidate Name", "Phone No.", "Email ID", "JD ID", "Action"]

  sendMail(data: any) {
    //console.log("emp data is ========== ", data);
    sessionStorage.setItem("candidetId", data.candidetId);
    sessionStorage.setItem("candidetName", data.candidetName);
    sessionStorage.setItem("joiningDate", data.joiningDate);
    sessionStorage.setItem("emailId", data.emailId);
    this.router.navigateByUrl('HRMS/Employee-Onboarding/onboarding-employee-mails');
  };

  fetchJobId() {
    let api = "resourceindentrequest/list_hr_forwarding/" + sessionStorage.getItem("companyId");
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.jdIdData1 = data.content;
      this.jdIdData = this.jdIdData1.filter((value: any) => {
        return value.hrManagerStatus == "recruitment"
      })
    })
  }

  fetchShortlistedCandidates() {
    this.spinner.show();
    let api: any = "referralrecruitment/find-by-status/" + sessionStorage.getItem("companyId");
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      console.log(data);
      this.candidateData = data.data.content;
      this.candidateData.sort((a: any, b: any) => a.candidetId - b.candidetId);
    },
      (_error) => {
        this.spinner.hide();
        this.notification.notify('error', 'Something Went Worng');
      })
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


}
