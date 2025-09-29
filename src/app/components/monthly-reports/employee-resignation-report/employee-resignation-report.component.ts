import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';

@Component({
  selector: 'app-employee-resignation-report',
  templateUrl: './employee-resignation-report.component.html',
  styleUrls: ['./employee-resignation-report.component.css']
})
export class EmployeeResignationReportComponent implements OnInit {
  public companyId: any = Number(sessionStorage.getItem("companyId"));
  public resignationReportList: any = [];
  public branchDetailsList!: any[];
  public departmentsList: any;
  public branchModel: any = '';
  public departmentModel: any = '';
  public statusModel: any = '';
  public departmentId: any;
  public submitted: any = false;
  public formData: any = {};
  public resignationList: any = ['Resign', 'Relieve', 'Rejoin'];
  p: number = 1;
  public headers: any = ["S.No", "Employee Id", "Employee Name", "Project", "Department", "Resignation Date", "Last Working Date", "Rejoin Date", "Reason", "Status"];

  constructor(private crudOperationsService: CrudOperationsService, private employeMasterService: EmployeeMastersService
    , private notification: NotifierService, private spinner: NgxSpinnerService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.fetchBranchDetailsList();

  }

  fetchBranchDetailsList() {
    this.spinner.show();
    //getting companyId from session-storage
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
  //calling departmments based on branchId
  onchangeBranch(id: any) {
    this.fetchEmployeesDePartments(id);
  }
  //get Department List 
  fetchEmployeesDePartments(id: number) {
    //get companyId
    let api: any = "department/dropdownList_departments/" + id;
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.departmentsList = data.data;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
        })
  }
  exportTable(type: string) {
    var fileType = '';
    let fileName = 'Employee_Resignation_Report';
    if (type == 'EXCEL') {
      fileName = fileName + '.xls'
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    else {
      fileType = 'application/pdf';
      fileName = fileName + '.pdf'
    }
    this.spinner.show();
    let api: any = "reports/employeeResignationReport/" + this.companyId + "/" + type;
    this.crudOperationsService.downloadDocumentExpenseReport(api, this.formData)
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
    if (this.branchModel && this.departmentModel && this.statusModel) {
      this.spinner.show();
      let status = this.getStatus(this.statusModel);
      this.formData = { "branchId": this.branchModel, "departmentId": this.departmentModel, "status": status };
      let api = "employeeResignation/resignationReport/" + this.companyId;
      this.crudOperationsService.create(this.formData, api).subscribe((data: any) => {
        this.resignationReportList = data.data;
        this.spinner.hide();
        this.submitted = false;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
          //spinner hide
          this.spinner.hide();
        })
    }
  }
  public getStatus(status: any): string {
    if (status == 'Resign') {
      return "Active";
    } else if (status == 'Relieve') {
      return "Accept";
    } else {
      return "Rejoin";
    }
  }
  clear() {
    this.resignationReportList = [];
    this.branchModel = '';
    this.departmentModel = '';
    this.statusModel = '';
    this.submitted = false;
  }
}
