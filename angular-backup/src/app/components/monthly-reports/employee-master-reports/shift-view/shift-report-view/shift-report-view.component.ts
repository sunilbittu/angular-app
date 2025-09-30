import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-shift-report-view',
  templateUrl: './shift-report-view.component.html',
  styleUrls: ['./shift-report-view.component.css']
})
export class ShiftReportViewComponent implements OnInit {

  public headers: any = ["Shift Name", "Description", "Start Time", "End Time", "Duration(Hrs)" ," Employee Count"];
  public headersCount: any = ["Employee Code", "Employee Name", "Branch Name", "Department Name" ,"Grade Name"];
  public companyId!: number;
  public shiftId!: number;
  public employeesBranchList: any;
  public employeesBranchCountList: any;

  p: number = 1;

  constructor(private crureService: CrudOperationsService, private notification: NotifierService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {

    //fetch employee list by branch
    this.fetchEmployeesListByBranch();
  }

onModelClose(){
  this.p = 1;
}

  fetchEmployeesListByBranch() {


    //getting companyId from session-storage
    this.companyId = Number(sessionStorage.getItem('companyId'));

    let api: any = 'shiftMaster/shiftMaster_report/' + this.companyId ;

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


  fetchEmployeesCountListByBranch(shiftId: number) {

    //spinner show
    this.spinner.show();
    this.shiftId = shiftId;

    //clear array data
    this.employeesBranchCountList = [];

    //getting companyId from session-storage
    this.companyId = Number(sessionStorage.getItem('companyId'));

    let api: any = 'shiftMaster/shiftMaster_report2/' + this.companyId+ "/" +shiftId;
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



  exportTable(type: string) {

    //spinner show
    var fileType = '';
    if (type == 'EXCEL') {
      fileType = 'Shift Report.xls';
      let api: any = "reports/shiftReport/exportExcel/"+this.companyId;
      this.crureService.exportExcelReport(api,fileType)
    }
    else {
      fileType = 'Shift Report.pdf';
      let api: any = "reports/shiftReport/exportPDF/"+this.companyId;
      this.crureService.exportPDF(api,fileType)
    }
  }

  exportInnerTable(type: string) {
    //spinner show
    this.spinner.show();
    var fileType = '';
    let fileName = 'Employee_Timeshift_Report';
    if (type == 'EXCEL') {
      fileName = fileName + '.xls'
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    else {
      fileType = 'application/pdf';
      fileName = fileName + '.pdf'
    }
    let api: any = "shiftMaster/live_employees_by_shift_id/" + type + "?companyId=" + this.companyId+ "&shiftId=" + this.shiftId;
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
