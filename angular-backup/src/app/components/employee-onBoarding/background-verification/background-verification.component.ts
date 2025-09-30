import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-background-verification',
  templateUrl: './background-verification.component.html',
  styleUrls: ['./background-verification.component.css']
})
export class BackgroundVerificationComponent implements OnInit {
  candidateData: any;
  verficationAgent2: any;
  verificationRemarks2: any;
  verificationStatus2: any;
  emailId2: any;
  candidetName2: any;
  joiningDate2: any;
  candidetId2: any;
  public emailAddress: any

  constructor(private crudOperationsService: CrudOperationsService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {

    this.fetchShortlistedCandidates();

  }

  public headers: any = ["Candidate Id", "Candidate Name", "Email Id", "Joining Date", "BG Type", "Agent Name", "Remarks", "Status", "Action"]
  public candidetId: any;


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
      })
  }


  clear1() {
    this.emailId2 = "";
    this.candidetName2 = "";
    this.joiningDate2 = "";
    this.verficationAgent2 = "";
    this.verificationRemarks2 = "";
    this.verificationStatus2 = "";
  }




  editCandidateDetails(doc: any) {
    this.candidetId2 = doc.candidetId;
    this.emailId2 = doc.emailId;
    this.candidetName2 = doc.candidetName;
    this.joiningDate2 = doc.joiningDate;
    this.verficationAgent2 = doc.verficationAgent;
    this.verificationRemarks2 = doc.verificationRemarks;
    this.verificationStatus2 = doc.verificationStatus;
  }

  updateDocumentType() {

    let object = {
      'emailId': this.emailId2, 'candidetName': this.candidetName2, 'joiningDate': this.joiningDate2,
      'verficationAgent': this.verficationAgent2, 'verificationRemarks': this.verificationRemarks2, 'verificationStatus': this.verificationStatus2,
    }

    let api: any = 'referralrecruitment/' + this.candidetId2;
    this.crudOperationsService.update(object, api).subscribe((data: any) => {
      console.log(data);
      this.fetchShortlistedCandidates();
    })
    this.onchangeStatusMail(this.emailId2);

  }

  onchangeStatusMail(emailAddress: String) {


    let api: any = 'referralrecruitment/email_sent_by_status_bv/' + emailAddress;

    this.crudOperationsService.getList(api).subscribe((data: any) => {

    })



  }







}
