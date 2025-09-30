import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
@Component({
  selector: 'app-branch-view',
  templateUrl: './branch-view.component.html',
  styleUrls: ['./branch-view.component.css']
})

export class BranchViewComponent implements OnInit {
  public headers: any = ["Branch Code", "Branch Name", "Live Employees", "Address"];
  public headersCount: any = ["Employee Code", "Employee Name", "Branch Code", "Branch Name"];
  public companyId!: number;
  public employeesBranchList: any;
  public employeesBranchCountList: any;
  p: number = 1;
  public branchId: any = '';
  constructor(private crureService: CrudOperationsService, private notification: NotifierService,
    private spinner: NgxSpinnerService) { }
  ngOnInit(): void {
    //fetch employee list by branch
    this.fetchEmployeesListByBranch();
  }
  
  onModelClose() {
    this.p = 1;
  }
  fetchEmployeesListByBranch() {
    //spinner show
    this.spinner.show();
    //getting companyId from session-storage
    this.companyId = Number(sessionStorage.getItem('companyId'));
    let api: any = "employee/find_employee_master_branchList/" + this.companyId
    this.crureService.getList(api)
      .subscribe((data: any) => {
        this.employeesBranchList = data.data;
        //spinner hide
        this.spinner.hide();
      }
        ,
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
          //spinner hide
          this.spinner.hide();
        })
  }
  fetchEmployeesCountListByBranch(branchId: number) {
    this.branchId = branchId;
    //spinner show
    this.spinner.show();
    //clear array data
    this.employeesBranchCountList = [];
    //getting companyId from session-storage
    this.companyId = Number(sessionStorage.getItem('companyId'));
    let api: any = "employee/employee_master_branch_employeeList/" + branchId + "/" + this.companyId
    this.crureService.getList(api)
      .subscribe((data: any) => {
        this.employeesBranchCountList = data.data;
        //spinner hide
        this.spinner.hide();
      }
        ,
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
          //spinner hide
          this.spinner.hide();
        })
  }
  exportInnerTable(type: string) {
    //spinner show
    this.spinner.show();
    var fileType = '';
    let fileName = 'Employee_Branch_Report';
    if (type == 'EXCEL') {
      fileName = fileName + '.xls'
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    else {
      fileType = 'application/pdf';
      fileName = fileName + '.pdf'
    }
    let api: any = "reports/live_employees_by_branch_id/" + type + "?companyId=" + this.companyId + "&branchId=" + this.branchId;
    this.crureService.downloadDocument(api)
      .subscribe((response: any) => {
        //spinner hide
        this.spinner.hide();
        let blob: any = new Blob([response], { type: fileType });
        const url = window.URL.createObjectURL(blob);
        if (type != 'EXCEL') {
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
          this.spinner.hide();
        }
      )
  }

  exportTable(type: string) {
    //spinner show
    this.spinner.show();
    let fileName='Branches_report';
    var fileType = '';
    if (type == 'EXCEL') {
      fileName = fileName + '.xls'
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    else {
      fileType = 'application/pdf';
      fileName = fileName + '.pdf'
    }
    let api: any = "reports/live_employees_by_branch/" + type + "?companyId=" + this.companyId;
    this.crureService.downloadDocument(api)
      .subscribe((response: any) => {
        //spinner hide
        this.spinner.hide();
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
          this.spinner.hide();
        }
      )
  }
}
