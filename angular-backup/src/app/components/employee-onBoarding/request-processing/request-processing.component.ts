import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
@Component({
  selector: 'app-request-processing',
  templateUrl: './request-processing.component.html',
  styleUrls: ['./request-processing.component.css']
})
export class RequestProcessingComponent implements OnInit {
  public headers: any = ["S.NO", "Request Submitted By", "Request Date", "Designation/Resource Title", "Project Name", "From Date", "View JD", "Status",
    "Remarks", "Action"];
  public companyId: any;
  public budgetApprovedList: any;
  public resourceObject: any;
  public resourceForm: any;
  public resourceStatus: any;
  public resourceRemarks: any;
  public statusValue: any;
  public statusValue1: any;
  public jdIdData: any;
  newResourceIndent: any;
  public isStatusValid: boolean = false;
  public statusText = 'Status can\'t be blank';
  public index: any;
  constructor(private formBuilder: FormBuilder, private route: Router,
    private crudeService: CrudOperationsService, private notificationService: NotifierService, private spinner: NgxSpinnerService) { }
  ngOnInit(): void {
    this.resourceForm = this.formBuilder.group({
      status: ['', Validators.required],
      remarks: ['', Validators.required]
    })
    //get budeget approvedList
    this.fetchBudgetApprovedList();
    // this.fetchJobId();
  }
  //get budeget approvedList
  fetchBudgetApprovedList() {
    this.spinner.show();
    this.companyId = sessionStorage.getItem('companyId');
    let api: any = "resourceindentrequest/req-processing/list?companyId=" + this.companyId;
    this.crudeService.getList(api)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.budgetApprovedList = data.data.content;
        console.log(this.budgetApprovedList)
      },
        (error) => {
          this.spinner.hide();
          this.notificationService.notify('danger', 'Something Went Wrong');
        })
  }
  fetchJobId() {
    let api = "resourceindentrequest/list_hr_forwarding/" + sessionStorage.getItem("companyId");
    this.crudeService.getList(api).subscribe((data: any) => {
      this.jdIdData = data.data.content;
    })
  }
  viewJD(data: any) {
    let jobidRequired: any = data;
    (<any>$('#view-jd')).modal('show');
    console.log(data)
    this.newResourceIndent = this.budgetApprovedList.filter((value: any) => {
      return value.jobId == jobidRequired;
    })
  }
  downloadDocumentAttachment(filePath: string, fileName: string) {
    let downloadApi = 'resourceindentrequest/jobresourcedownload?filePath=' + filePath;
    this.crudeService.downloadDocument(downloadApi)
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
          this.notificationService.notify('error', 'Error while downloading the file');
        }
      )
  }
  //get form controls
  get form() {
    return this.resourceForm.controls;
  }
  getStatus($event: any) {
    this.statusValue = $event.target.options[$event.target.options.selectedIndex].value;
    this.isStatusValid = this.statusValue ? false : true;
  }
  public submitted: boolean = false;
  updateResourceRecrutmentProcessing(index: number, id: number) {
    this.index = index;
    const data = this.budgetApprovedList[index];
    this.resourceObject = {
      "hrManagerStatus": this.statusValue,
      "hrManagerRemarks": data.hrManagerRemarks
    }
    this.submitted = true;
    if (this.statusValue) {
      /** spinner starts on */
      this.spinner.show();
      let api: any = "resourceindentrequest/update_hr_forwarding/" + id;
      this.crudeService.update(this.resourceObject, api)
        .subscribe((data: any) => {
          this.notificationService.notify('success', data.message);
          if (this.statusValue == 'internal-Mapping') {
            setTimeout(() => {
              // this.route.navigateByUrl('HRMS/Employee-Onboarding/internal-jobMovement')
              this.spinner.hide();
            }, 1000)
          }
          //hide spinner
          this.spinner.hide();
          //get budeget approvedList
          this.fetchBudgetApprovedList();
        },
          (error) => {
            //hide spinner
            this.spinner.hide();
            this.notificationService.notify('error', 'Something Went Wrong');
          })
    } else {
      this.isStatusValid = true;
    }
  }
}
