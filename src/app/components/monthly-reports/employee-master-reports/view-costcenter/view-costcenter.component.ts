import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
@Component({
  selector: 'app-view-costcenter',
  templateUrl: './view-costcenter.component.html',
  styleUrls: ['./view-costcenter.component.css']
})
export class ViewCostcenterComponent implements OnInit {
  public headers: any = ["CostCenter Code", "CostCenter Name", "Live Employees"];
  public headersCount: any = ["Employee Code", "Employee Name", "CostCenter Code", "CostCenter Name"];
  public companyId!: number;
  public employeesCostCenterList: any;
  public employeesCostCenterCountList: any;
  p: number = 1;
  public costcenterId: any = '';
  constructor(private crureService: CrudOperationsService, private notification: NotifierService,
    private spinner: NgxSpinnerService) { }
  ngOnInit(): void {
    //fetch employee list by branch
    this.fetchEmployeesListByCostCenter();
  }
  onModelClose() {
    this.p = 1;
  }
  fetchEmployeesListByCostCenter() {
    //spinner show
    this.spinner.show();
    //getting companyId from session-storage
    this.companyId = Number(sessionStorage.getItem('companyId'));
    let api: any = "employee/find_employee_master_costCenterList/" + this.companyId
    this.crureService.getList(api)
      .subscribe((data: any) => {
        this.employeesCostCenterList = data.data;
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
  fetchEmployeesCountListByCostcenter(costCenterId: number) {
    this.costcenterId = costCenterId;
    //spinner show
    this.spinner.show();
    //clear array data
    this.employeesCostCenterCountList = [];
    //getting companyId from session-storage
    this.companyId = Number(sessionStorage.getItem('companyId'));
    let api: any = "employee/employee_master_project_employeeList/" + costCenterId + "/" + this.companyId;
    this.crureService.getList(api)
      .subscribe((data: any) => {
        this.employeesCostCenterCountList = data.data;
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
  exportTable(type: string) {
    //spinner show
    this.spinner.show();
    var fileType = '';
    let fileName='costcenter report';
    if (type == 'EXCEL') {
      fileName=fileName+'.xls';
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    else {
      fileName=fileName+'.pdf';
      fileType = 'application/pdf';
    }
    let api: any = "reports/live_employees_by_costcenter/" + type + "?companyId=" + this.companyId;
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

        anchor.click();        //window.location.href = response.url;
        //this._FileSaverService.save(blob,'Employee_Branch_Report');
      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
          //spinner hide
          this.spinner.hide();
        }
      )
  }

  exportInnerTable(type: string) {
    //spinner show
    this.spinner.show();
    var fileType = '';
    let fileName = 'Employee_CostCenter_Report';
    if (type == 'EXCEL') {
      fileName = fileName + '.xls'
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    else {
      fileType = 'application/pdf';
      fileName = fileName + '.pdf'
    }
    let api: any = "reports/live_employees_by_costcenter_id/" + type + "?companyId=" + this.companyId + "&costcenterId=" + this.costcenterId;
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
}
