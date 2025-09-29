import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-investment-report',
  templateUrl: './investment-report.component.html',
  styleUrls: ['./investment-report.component.css']
})
export class InvestmentReportComponent implements OnInit {

  constructor(public crudOperationsService: CrudOperationsService, private spinner: NgxSpinnerService) { }
  public yearModel: any = 0;
  public reports: any = [];
  public investmentYear: any = [];
  public companyName: any = sessionStorage.getItem("companyName");
  public companyId: any = Number(sessionStorage.getItem("companyId"));
  public baseurl = environment.BASE_URL;
  public submitted: boolean = false;
  ngOnInit(): void {
    this.spinner.show();
    let companyId = sessionStorage.getItem("companyId")
    let url = "financialyear/list-by/" + companyId;
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      this.spinner.hide();
      this.investmentYear = data.data.content;
    },
      (error) => {
        this.spinner.hide();
      })
  }
  public api: any;
  exportExcel() {
    this.submitted = true;
    if (this.yearModel != 0) {
      let url = 'reports/employees_investment2/EXCEL?employeeId=' + this.companyId +
        '&financialYearId=' + Number(this.yearModel);
      this.api = this.baseurl + url;
      this.crudOperationsService.getList(url)
        .subscribe((data: any) => {
          console.log(data);
        })
    }
  }
  getreports() {
    this.submitted = true;
    if (this.yearModel != 0) {
      let url = 'employeeinvestment/admin_investment_report_list?companyId=' + this.companyId
        + '&financialYearId=' + Number(this.yearModel);
      this.crudOperationsService.getList(url).subscribe((data: any) => {
        console.log(data);
        this.reports = data.data;
        this.submitted = false;
      })
    }
  }
}
