import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-training-report',
  templateUrl: './training-report.component.html',
  styleUrls: ['./training-report.component.css']
})
export class TrainingReportComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService, private notification: NotifierService,
    public crudOperationsService: CrudOperationsService) { }

  public headers: any = ['Technology', 'Trainer Name', 'Training Start Date', 'Training End Date', 'Total training hours', 'Batch Name', 'Status'];
  public trainingList: any = [];
  public status: string = '';
  public statuses: any = ['Scheduled', 'On-going', 'Completed'];
  public p: number = 1;

  ngOnInit(): void { 
    this.spinner.show();
    this.spinner.hide();
  }

  public getTrainingList(): void {
    this.trainingList = [];
    this.spinner.show();
    let api = 'manage-training/report-list?status=' + this.status;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.trainingList = data.data;
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }

  public changeStatus(): void {
    this.getTrainingList();
  }

  exportTable(type: string) {
    //spinner show
    this.spinner.show();
    var fileType = '';
    let fileName='training-report';
    if (type == 'EXCEL') {
      fileName=fileName+'.xls'
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    else {
      fileName=fileName+'.pdf';
      fileType = 'application/pdf';
    }

    let api: any = "reports/training_report/" + type + "?status=" + this.status;
    this.crudOperationsService.downloadDocument(api)
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
