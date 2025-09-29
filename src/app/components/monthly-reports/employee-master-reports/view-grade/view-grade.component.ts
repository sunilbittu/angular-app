import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
@Component({
  selector: 'app-view-grade',
  templateUrl: './view-grade.component.html',
  styleUrls: ['./view-grade.component.css']
})
export class ViewGradeComponent implements OnInit {
  public headers: any = ["Grade Code", "Grade Name", "Live Employees"];
  public headersCount: any = ["Employee Code", "Employee Name", "Grade Code", "Grade Name"];
  public companyId!: number;
  public employeesGradeList: any;
  public employeesGradeCountList: any;
  p: number = 1;
  public gradeId: any = '';
  constructor(private crureService: CrudOperationsService, private notification: NotifierService,
    private spinner: NgxSpinnerService) { }
  ngOnInit(): void {
    //fetch employee list by branch
    this.fetchEmployeesListByGrade();
  }
  onModelClose() {
    this.p = 1;
  }
  fetchEmployeesListByGrade() {
    //spinner show
    this.spinner.show();
    //getting companyId from session-storage
    this.companyId = Number(sessionStorage.getItem('companyId'));
    let api: any = "employee/find_employee_master_gradeList/" + this.companyId
    this.crureService.getList(api)
      .subscribe((data: any) => {
        this.employeesGradeList = data.data;
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
  fetchEmployeesCountListByGrade(gradeId: number) {
    this.gradeId = gradeId;
    //spinner show
    this.spinner.show();
    //clear array data
    this.employeesGradeCountList = [];
    //getting companyId from session-storage
    this.companyId = Number(sessionStorage.getItem('companyId'));
    let api: any = "employee/employee_master_grade_employeeList/" + gradeId + "/" + this.companyId
    this.crureService.getList(api)
      .subscribe((data: any) => {
        this.employeesGradeCountList = data.data;
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
    let fileName='grade-report';
    if (type == 'EXCEL') {
      fileName=fileName+'.xls';
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    else {
      fileName=fileName+'.pdf';
      fileType = 'application/pdf';
    }
    let api: any = "reports/live_employees_by_grade/" + type + "?companyId=" + this.companyId;
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

  exportInnerTable(type: string) {
    //spinner show
    this.spinner.show();
    var fileType = '';
    let fileName = 'Employee_Grade_Report';
    if (type == 'EXCEL') {
      fileName = fileName + '.xls'
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    else {
      fileType = 'application/pdf';
      fileName = fileName + '.pdf'
    }
    let api: any = "reports/live_employees_by_grade_id/" + type + "?companyId=" + this.companyId + "&gradeId=" + this.gradeId;
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
