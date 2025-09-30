import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-employee-birthday-report',
  templateUrl: './employee-birthday-report.component.html',
  styleUrls: ['./employee-birthday-report.component.css']
})
export class EmployeeBirthdayReportComponent implements OnInit {

  public headers: any = ["Employee Code", "Employee Name", "Birth Date", "Days To Go", "Branch Name", "Department Name"];
  public companyId!: number;
  public employeesBirthdayList: any;
 
  p: number = 1;

  tomarrowBirthdayStyle : any =  {

  
    'color': '#fff',
    'background-color' : 'rgb(113,195,97)',
    'font-weight': '300'
    
  }


  fewDaysToGoBirthdayStyle : any =  {
    'background-color' : 'rgb(255, 255, 255)',
    //'font-weight': '300'
    
  }


  public hasError = false;

   constructor(private crureService: CrudOperationsService, private notification: NotifierService,
    private spinner: NgxSpinnerService) { }


  ngOnInit(): void {

    this.fetchEmployeesBirthdayReport();
  }

onModelClose(){
    this.p = 1;
  }


  fetchEmployeesBirthdayReport() {

    //spinner show
    this.spinner.show();

    //getting companyId from session-storage
    this.companyId = Number(sessionStorage.getItem('companyId'));

    let api: any = "employee/employee_birthday_report/" + this.companyId

    this.crureService.getList(api)
      .subscribe((data: any) => {
        this.employeesBirthdayList = data.data;
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
    let fileName='employee-birthday-report';
    if (type == 'EXCEL') {
      fileName=fileName+'.xls';
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    else {
      fileName=fileName+'.pdf';
      fileType = 'application/pdf';
    }
    let api: any = "reports/employees_birthday_report/" + type + "?companyId=" + this.companyId;
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


  exportTableExcel() {

    //spinner show
    this.spinner.show();


    var fileType = '';
    let fileName='employee-birthday-report';
      fileName=fileName+'.xls';
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';   
    let api: any = "reports/employees_birthday_report_excel?companyId=" + this.companyId;
    this.crureService.downloadDocument(api)
      .subscribe((response: any) => {
        //spinner hide
        this.spinner.hide();

        let blob: any = new Blob([response], { type: fileType });
        const url = window.URL.createObjectURL(blob);
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
