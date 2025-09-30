import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.css']
})
export class ViewProjectComponent implements OnInit {
  public headers: any = ["Project Code", "Project Name", "Live Employees"];
  public headersCount: any = ["Employee Code", "Employee Name", "Project Code", "Project Name"];
  public companyId!: number;
  public employeesProjectList: any;
  public employeesProjectCountList: any;
  p: number = 1;
  public newProjectId!: number;
  constructor(private crureService: CrudOperationsService, private notification: NotifierService,
    private spinner: NgxSpinnerService) { }
  ngOnInit(): void {
    //fetch employee list by branch
    this.fetchEmployeesListByProject();
  }
  onModelClose() {
    this.p = 1;
  }
  fetchEmployeesListByProject() {
    //spinner show
    this.spinner.show();
    //getting companyId from session-storage
    this.companyId = Number(sessionStorage.getItem('companyId'));
    let api: any = "employee/find_employee_master_projectList/" + this.companyId
    this.crureService.getList(api)
      .subscribe((data: any) => {
        this.employeesProjectList = data.data;
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
  fetchEmployeesCountListByProject(projectId: number) {
    this.p=1;
    //spinner show
    this.spinner.show();
    this.newProjectId = projectId;
    //clear array data
    this.employeesProjectCountList = [];
    //getting companyId from session-storage
    this.companyId = Number(sessionStorage.getItem('companyId'));
    let api: any = "employee/employee_master_employeeList_project/" + projectId + "/" + this.companyId;
    this.crureService.getList(api)
      .subscribe((data: any) => {
        this.employeesProjectCountList = data.data;
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
    let fileName='project-report';
    if (type == 'EXCEL') {
      fileName=fileName+'.xls';
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    else {
      fileName=fileName+'.pdf';
      fileType = 'application/pdf';
    }
    let api: any = "reports/live_employees_by_project/" + type + "?companyId=" + this.companyId;
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
  exportTable2(type: string) {
    this.companyId = Number(sessionStorage.getItem('companyId'));
    //spinner show
    var fileType = '';
    if (type == 'EXCEL') {
      fileType = 'Project Wise Employees.xls';
      let api: any = "reports/projectReport/exportExcel/" + this.newProjectId + "/" + this.companyId;
      this.crureService.exportExcelReport(api, fileType)
    }
    else {
      fileType = 'Project Wise Employees.pdf';
      let api: any = "reports/projectReport/exportPDF/" + this.newProjectId + "/" + this.companyId;
      this.crureService.exportPDF(api, fileType)
    }
  }
}
