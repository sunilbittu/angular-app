import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';

@Component({
  selector: 'app-arrears-payment-report',
  templateUrl: './arrears-payment-report.component.html',
  styleUrls: ['./arrears-payment-report.component.css']
})
export class ArrearsPaymentReportComponent implements OnInit {
  public companyId: any = Number(sessionStorage.getItem("companyId"));
  public arrearsList: any = [];
  public branchDetailsList!: any[];
  public departmentsList: any;
  public branchModel: any = '';
  public departmentModel: any = '';
  public departmentId: any;
  public employeeDetails: any = [];
  public submitted: any = false;
  public totalAmount = 0;
  public resignationList: any = ['Open', 'In Progress', 'Resolved', 'Rejected'];
  p: number = 1;
  public arrearHeaders: any = ["Employee Code", "Employee Name", "Branch", "Department", "Arrears Amount"];

  constructor(private crudOperationsService: CrudOperationsService, private employeMasterService: EmployeeMastersService
    , private notification: NotifierService, private spinner: NgxSpinnerService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.fetchBranchDetailsList();
  }

  fetchBranchDetailsList() {
    this.spinner.show();
    this.companyId = Number(sessionStorage.getItem('companyId'));
    return this.employeMasterService.getBranchMaster(this.companyId)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.branchDetailsList = data.data.content;
      }
        ,
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  onchangeBranch(id: any) {
    this.fetchEmployeesDePartments(id);
  }
  fetchEmployeesDePartments(id: number) {
    let api: any = "department/dropdownList_departments/" + id;
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.departmentsList = data.data;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
        })
  }

  getDepartmentheadsDetails() {
    this.crudOperationsService.getList('employee/departmentheads/' + this.departmentModel)
      .subscribe((data: any) => {
        this.employeeDetails = data.data;
      });
  }

  exportTable(type: string) {
    //spinner show
    this.spinner.show();
    var fileType = '';
    if (type == 'EXCEL') {
      fileType = 'Arrears_Payment_Report.xls';
      let api: any = "reports/arrearsPaymnet/exportExcel/" + this.departmentModel;
      this.crudOperationsService.exportExcelReport(api, fileType);
      this.spinner.hide();
    }
    else {
      fileType = 'Arrears_Payment_Report.pdf';
      let api: any = "reports/arrearsPaymentReport/exportPDF/" + this.departmentModel;
      this.crudOperationsService.exportPDF(api, fileType);
      this.spinner.hide();
    }
  }
  submit() {
    this.submitted = true;
    if (this.departmentModel && this.branchModel) {
      this.spinner.show();
      let api = "arrears-payment/arrearsListBydepartments/" + this.departmentModel;
      this.crudOperationsService.getList(api).subscribe((data: any) => {
        this.totalAmount = 0;
        this.arrearsList = data.data;
        this.arrearsList.forEach((a: any) => {
          this.totalAmount = this.totalAmount + a.arrearsAmount;
        });
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
    this.arrearsList = [];
    this.branchModel = '';
    this.departmentModel = '';
    this.submitted = false;
  }
}
