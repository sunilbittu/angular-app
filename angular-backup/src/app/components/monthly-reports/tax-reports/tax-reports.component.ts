import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tax-reports',
  templateUrl: './tax-reports.component.html',
  styleUrls: ['./tax-reports.component.css']
})
export class TaxReportsComponent implements OnInit {
  constructor(public crudOperationsService: CrudOperationsService, public fb: FormBuilder,
    private notification: NotifierService) { }
  public yearModel: string = '';
  public reports: any = [];
  public investmentYear: any = [];
  public companyId: any;
  public companyName: any;
  public baseurl = environment.BASE_URL;
  public financialYearList: any = [];
  public submitted: boolean = false;
  public toggleLoader: boolean = false;
  public quarterModel: string = '';
  public requiredErrorText = 'can\'t be blank';
  public taxValue: any;
  public submitInvalid = false;
  public employeeId: number = 0;
  public months: any = [{ key: "April", value: 12 }, { key: "May", value: 11 }, { key: "June", value: 10 },
  { key: "July", value: 9 }, { key: "August", value: 8 }, { key: "September", value: 7 },
  { key: "October", value: 6 }, { key: "November", value: 5 }, { key: "December", value: 4 },
  { key: "January", value: 3 }, { key: "February", value: 2 }, { key: "March", value: 1 }];

  public quarterList: any = ["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"];

  public taxReports: any = ["Investments", "Monthly TDS", "Quarterly TDS", "Yearly TDS"];

  public quarterMonths: any = [];
  public isFormValueInvalid: boolean = false;

  public form = this.fb.group({
    finYear: ["", Validators.required],
    month: ["", Validators.required],
    quarter: ["", Validators.required]
  });

  get form_() { return this.form.controls; };

  ngOnInit(): void {
    this.companyName = sessionStorage.getItem('companyName');
    this.companyId = Number(sessionStorage.getItem('companyId'));
    if (sessionStorage.getItem('role') == 'ROLE_DEPARTMENT_HEAD') {
      this.employeeId = Number(sessionStorage.getItem('empId'));
    }
    this.fetchFinancialYear();
  }
  isValue: string = '';

  toggle(num: any) { this.isValue = num; }

  handleTaxReport(tax: any) {
    this.isFormValueInvalid = false;
    this.taxValue = tax;
    this.clear();
    this.submitted = false;
    this.reports = [];
  }
  clear() {
    this.form_['finYear'].setValue('');
    this.form_['month'].setValue('');
    this.form_['quarter'].setValue('');
    this.submitted = false;
    this.isFormValueInvalid = false;
  }
  fetchFinancialYear() {
    let url = 'financialyear/list-by/' + this.companyId;
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      this.financialYearList = data.data.content;
    },
      (error) => {
        this.notification.notify('error', 'Something went wrong!');
      })
  }
  onClick() {
    this.clear();
  }
  submit() {
    this.submitted = true;
    if (this.taxValue !== '' && this.taxValue !== undefined) {
      switch (this.taxValue) {
        case "Investments":
          if (this.form.value.finYear != '') {
            this.getInvestmentsReports();
          }
          break;
        case "Monthly TDS":
          if (this.form.value.finYear != '' && this.form.value.month != '') {
            this.getMonthlyReports();
          }
          break;
        case "Quarterly TDS":
          if (this.form.value.finYear != '' && this.form.value.quarter != '') {
            this.getQuarterlyReports();
          }
          break;
        case "Yearly TDS":
          if (this.form.value.finYear != '') {
            this.getYearlyReports();
          }
          break;
      }
    } else {
      this.isFormValueInvalid = true;
    }
  }
  getYearlyReports() {
    this.reports = [];
    this.toggleLoader = true;
    let url = 'taxprojection/exportYearlyTdsReport?companyId=' + this.companyId + '&financialYearId=' + 
    this.form.value.finYear + '&employeeId=' +this.employeeId;
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      this.toggleLoader = false;
      console.log(data);
      this.reports = data.data;
      this.reports.map(function (obj: any) {
        obj.monthly = obj.balance;
      })
    })
  }
  getQuarterlyReports() {
    this.reports = [];
    this.toggleLoader = true;
    let url = 'taxprojection/exportQuarterlyTdsReport?companyId=' + this.companyId + '&months=' + 
    this.quarterMonths + '&financialYearId=' + this.form.value.finYear + '&employeeId=' +this.employeeId;
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      this.toggleLoader = false;
      console.log(data);
      this.reports = data.data;
    })
  }
  getInvestmentsReports() {
    this.reports = [];
    this.toggleLoader = true;
    let url = 'employeeinvestment/admin_investment_report_list?companyId=' + this.companyId
      + '&financialYearId=' + this.form.value.finYear;
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      this.toggleLoader = false;
      console.log(data);
      this.reports = data.data;
    })
  }
  getMonthlyReports() {
    this.reports = [];
    this.toggleLoader = true;
    let url = 'taxprojection/exportMonthlyTdsReport?companyId=' + this.companyId + '&month=' + 
    this.form.value.month + '&financialYearId=' + this.form.value.finYear + '&employeeId=' +this.employeeId;
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      this.toggleLoader = false;
      console.log(data);
      this.reports = data.data;
    })
  }
  public api: any;
  exportExcel() {
    let url = '';
    switch (this.taxValue) {
      case "Investments":
        url = 'reports/employees_investment/EXCEL?companyId=' + this.companyId +
          '&financialYearId=' + this.form.value.finYear + '&employeeId=' +this.employeeId;
        break;
      case "Monthly TDS":
        url = 'taxprojection/monthly_tds/EXCEL?companyId=' + this.companyId + '&month=' +
          this.form.value.month + '&financialYearId=' + this.form.value.finYear + '&employeeId=' +this.employeeId;
        break;
      case "Quarterly TDS":
        url = 'taxprojection/quarterly_tds/EXCEL?companyId=' + this.companyId + '&months=' +
          this.quarterMonths + '&financialYearId=' + this.form.value.finYear + '&employeeId=' +this.employeeId;
        break;
      case "Yearly TDS":
        url = 'taxprojection/yearly_tds/EXCEL?companyId=' + this.companyId + '&financialYearId=' + 
        this.form.value.finYear + '&employeeId=' +this.employeeId;
        break;
    }
    this.crudOperationsService.exportExcelReport(url, this.taxValue + 'Report.xls');
  }
  exportPDF() {
    let url = '';
    switch (this.taxValue) {
      case "Investments":
        url = 'reports/employees_investment/PDF?companyId=' + this.companyId +
          '&financialYearId=' + this.form.value.finYear + '&employeeId=' +this.employeeId;
        break;
      case "Monthly TDS":
        url = 'taxprojection/monthly_tds/PDF?companyId=' + this.companyId + '&month=' +
          this.form.value.month + '&financialYearId=' + this.form.value.finYear + '&employeeId=' +this.employeeId;
        break;
      case "Quarterly TDS":
        url = 'taxprojection/quarterly_tds/PDF?companyId=' + this.companyId + '&months=' +
          this.quarterMonths + '&financialYearId=' + this.form.value.finYear + '&employeeId=' +this.employeeId;
        break;
      case "Yearly TDS":
        url = 'taxprojection/yearly_tds/PDF?companyId=' + this.companyId + '&financialYearId=' +
          this.form.value.finYear + '&employeeId=' +this.employeeId;
        break;
    }
    this.crudOperationsService.exportPDF(url, this.taxValue + 'Report.pdf');
  }

  changeQuarter(quarter: any) {
    switch (quarter) {
      case "Quarter 1":
        this.quarterMonths.push('April', 'May', 'June');
        break;
      case "Quarter 2":
        this.quarterMonths.push('July', 'August', 'September');
        break;
      case "Quarter 3":
        this.quarterMonths.push('October', 'November', 'December');
        break;
      case "Quarter 4":
        this.quarterMonths.push('January', 'February', 'March');
        break;
    }
  }
}
