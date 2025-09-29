import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';

@Component({
  selector: 'app-performance-reports',
  templateUrl: './performance-reports.component.html',
  styleUrls: ['./performance-reports.component.css']
})
export class PerformanceReportsComponent implements OnInit {
  public companyId: any = Number(sessionStorage.getItem("companyId"));
  tenureReportList: any;
  public branchDetailsList!: any[];
  public departmentsList: any;
  public departmentModel: any;
  public departmentId: any;
  p:number=1;
  constructor(private crudOperationsService: CrudOperationsService, private employeMasterService: EmployeeMastersService
    , private notification: NotifierService, private crureService: CrudOperationsService) { }
  ngOnInit(): void {
    this.fetchBranchDetailsList();
  }
  public headers: any = ["S.No", "Employee Code", "Employee Name", "Date of Joining", "Years", "Months", "Branch Name", "Dept Name"];
  fetchTenureReport(id: number) {
    let api = "employee/tenurereport/" + this.companyId + "/" + this.departmentModel;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      console.log(data, "===data");
      this.tenureReportList = data.data;
    })
  }
  fetchBranchDetailsList() {
    //getting companyId from session-storage
    this.companyId = Number(sessionStorage.getItem('companyId'));
    return this.employeMasterService.getBranchMaster(this.companyId)
      .subscribe((data: any) => {
        this.branchDetailsList = data.data.content;
      }
        ,
        (error) => {
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
  onDepartmentChange() {
    this.fetchTenureReport(this.departmentModel);
  }
  exportTable(type: string) {
    var fileType = '';
    let fileName='performance-report';
    if (type == 'EXCEL') {
      fileName=fileName+'.xls';
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    else {
      fileName=fileName+'.pdf';
      fileType = 'application/pdf';
    }
    let api: any = "reports/employee_tenure_report/" + type + "?companyId=" + this.companyId + '&' + "departmentId=" + this.departmentModel;
    this.crureService.downloadDocument(api)
      .subscribe((response: any) => {
        let blob: any = new Blob([response], { type: fileType });
        const url = window.URL.createObjectURL(blob);
        if(type!='EXCEL'){
          window.open(url);
        }
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
        }
      )
  }
}
