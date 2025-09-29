import { Component, OnInit } from '@angular/core';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-investment-reports',
  templateUrl: './investment-reports.component.html',
  styleUrls: ['./investment-reports.component.css']
})
export class InvestmentReportsComponent implements OnInit {
  constructor(public crudOperationsService: CrudOperationsService) { }
  public yearModel: string = '';
  public reports: any = [];
  public investmentYear: any = [];
  public companyName: any = sessionStorage.getItem('companyName');
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public baseurl = environment.BASE_URL;

  ngOnInit(): void {
    let companyId = sessionStorage.getItem('companyId')
    let url = 'financialyear/list-by/' + companyId;
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      console.log(data);
      this.investmentYear = data.data.content;
    })
  }
  public api: any;
  exportExcel() {
    let url = 'reports/employees_investment/EXCEL?employeeId=' + this.companyId + '&financialYearId=' + Number(this.yearModel);
    this.api = this.baseurl + url;
    this.crudOperationsService.getList(url)
      .subscribe((data: any) => {
        console.log(data);
      })
  }
  getreports() {
    let url = 'employeeinvestment/employee_investment_report_list/' + this.companyId + '?financialYearId=' + Number(this.yearModel);
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      console.log(data);
      this.reports = data.data;
    })
  }
}
