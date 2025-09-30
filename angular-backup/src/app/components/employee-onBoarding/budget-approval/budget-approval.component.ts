import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { data } from 'jquery';
import { NewResourceIndent } from 'src/app/models/NewResourceIndent.model';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-budget-approval',
  templateUrl: './budget-approval.component.html',
  styleUrls: ['./budget-approval.component.css']
})
export class BudgetApprovalComponent implements OnInit {

  constructor(private crudOperationsService: CrudOperationsService, private notification: NotifierService,public datePipe: DatePipe, private spinner: NgxSpinnerService) { }

  public headers: any = ["Request Submitted by", "Request Date", "Designation OR Resource Title", "For which Project",
    "By When", "JD ID", "Action to be taken", "Budget Approval", "Remarks"];
  public resourceList: any = [];
  public companyId: any;
  public userName: any;
  public employeeId: any;
  public api = 'resourceindentrequest';
  public newResourceIndent = new NewResourceIndent();
  public jobId: any;
  public btnDisabled: boolean = false;
  public highlightRow!: any;
  public toggleLoader: boolean = false;
  public submitProcessing: boolean = false;
  public tempByWhen: any="";
  public tempBudgetApprovalAction: any;
  public tempBudgetApprovalRemarks: any;
  public headers2: any =["S No" ,"Request Submitted by" ,"Request Date" ,"Designation OR Resource Title", "For which Project","By When","JD ID" ,"Action to be taken" ,"Budget Approval", "Remarks","Action"]
  

  ngOnInit(): void {
    this.toggleLoader = true;
    this.resourceList = [];
    this.userName = localStorage.getItem("userName");
    this.employeeId = sessionStorage.getItem("empId");
    this.companyId = sessionStorage.getItem("companyId");
    this.fetchResourceList();
  }
  fetchResourceList() {
    this.spinner.show();
    let listApi = this.api + '/budget-approval/list?companyId=' + this.companyId + '&employeeId=' + this.employeeId;
    this.crudOperationsService.getList(listApi)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.resourceList = data.data.content;
        this.toggleLoader = false;
      },
        (_error) => {
          this.spinner.hide();
          this.toggleLoader = false;
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  onHiringStartDateValueChange(event: any) {
    this.resourceList[this.highlightRow].hiringStartDate = this.datePipe.transform(new Date(event), 'dd-MM-yyyy');
  }
  viewJD(data: any) {
    this.newResourceIndent = data;
  }

  submit() {
    this.submitProcessing = true;
    let updateAPi = this.api + `/budget-approval/update/${this.jobId}`;
    this.crudOperationsService.update(this.resourceList[this.highlightRow], updateAPi).subscribe((res: any) => {
      this.notification.notify('success', res.message);
      this.btnDisabled = false;
      this.highlightRow = undefined;
      this.submitProcessing = false;
      this.ngOnInit();
    },
      (error) => {
        this.submitProcessing = false;
        this.notification.notify('error', 'Something went wrong!');
      })
  }
  downloadDocumentAttachment(filePath: string, fileName: string) {
    let downloadApi = this.api + '/jobresourcedownload?filePath=' + filePath;
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

  clickUpdate(index: Number, jobId: any, data: any) {
    this.highlightRow = index;
    this.jobId = jobId;
    this.btnDisabled = true;
    this.tempByWhen = data.hiringStartDate;
    this.tempBudgetApprovalAction = data.budgetApprovalAction;
    this.tempBudgetApprovalRemarks = data.budgetApprovalRemarks;
    if(data.hiringStartDate != null) {
      this.resourceList[this.highlightRow].hiringStartDate = new Date(data.hiringStartDate);
    } else {
      this.resourceList[this.highlightRow].hiringStartDate = new Date();
    }
  }
  cancel() {
    this.btnDisabled = false;
    this.highlightRow = undefined;
    this.resourceList[this.highlightRow].hiringStartDate = this.datePipe.transform(this.tempByWhen, 'dd-MM-yyyy');
    this.resourceList[this.highlightRow].budgetApprovalAction = this.tempBudgetApprovalAction;
    this.resourceList[this.highlightRow].budgetApprovalRemarks = this.tempBudgetApprovalRemarks;
  }
}
