import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-reward-recognization-filter-report',
  templateUrl: './reward-recognization-filter-report.component.html',
  styleUrls: ['./reward-recognization-filter-report.component.css']
})
export class RewardRecognizationFilterReportComponent implements OnInit {

  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public rrList: any = [];
  public departmentsList: any;
  public departmentModel: any = '';
  public statusModel: any = '';
  public departmentId: any;
  public employeeDetails: any = [];
  public submitted: any = false;
  public formData: any = {};
  public status: any = ['Approve', 'Reject'];
  p: number = 1;
  public headers: any = ['Employee Id', 'Employee Name', 'Department', 'Reward/Recognition', 'Amount'];

  constructor(private crudOperationsService: CrudOperationsService, private notification: NotifierService, 
    private spinner: NgxSpinnerService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getDepartmentList();
  }

  getDepartmentList() {
    this.spinner.show();
    let api: any = 'department/getDepartmentList';
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.departmentsList = data.data;
    },
    (error) => {
      this.notification.notify('error', 'Something Went Worng');
      //spinner hide
      this.spinner.hide();
    });
  }

  exportTable(type: string) {
    var fileType = '';
    let fileName = 'RR_Report';
    if (type == 'EXCEL') {
      fileName = fileName + '.xls'
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    else {
      fileType = 'application/pdf';
      fileName = fileName + '.pdf'
    }
    this.spinner.show();
    let api: any = 'reports/reward_recognition_report/' + type + '?companyId=' + this.companyId +
      '&departmentId=' + this.departmentModel + '&status=' + this.statusModel;
    this.crudOperationsService.downloadDocument(api)
      .subscribe((response: any) => {
        this.spinner.hide();
        let blob: any = new Blob([response], { type: fileType });
        let url = window.URL.createObjectURL(blob);
        this.sanitizer.bypassSecurityTrustUrl(url);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = fileName;

        anchor.click();
        //window.location.href = response.url;
        //this._FileSaverService.save(blob,'Employee_Branch_Report');
      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
          //spinner hide
          this.spinner.hide();
        }
      )
  }

  submit() {
    this.submitted = true;
    if (this.departmentModel && this.statusModel) {
      this.spinner.show();
      let api = 'manage-rewards-recognization/report-list?companyId=' + this.companyId +
        '&departmentId=' + this.departmentModel + '&status=' + this.statusModel;
      this.crudOperationsService.getList(api).subscribe((data: any) => {
        this.rrList = data.data;
        this.spinner.hide();
        this.submitted = false;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
          //spinner hide
          this.spinner.hide();
        });
    }
  }

  clear() {
    this.rrList = [];
    this.departmentModel = '';
    this.statusModel = '';
    this.submitted = false;
  }
}
