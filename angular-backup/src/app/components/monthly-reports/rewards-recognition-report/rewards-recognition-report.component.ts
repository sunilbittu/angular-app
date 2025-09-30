import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-rewards-recognition-report',
  templateUrl: './rewards-recognition-report.component.html',
  styleUrls: ['./rewards-recognition-report.component.css']
})
export class RewardsRecognitionReportComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService, private notification: NotifierService,
    public crudOperationsService: CrudOperationsService) { }

  public headers: any = ['Id', 'Reward Name', 'Budeget'];
  public headers2: any = ['Id', 'Recognition Name', 'Type'];
  public trainingList: any = [];
  public status: string = '';
  public statuses: any = ['Reward', 'Recognition'];
  public p: number = 1;
  public companyId: any = Number(sessionStorage.getItem("companyId"));


  ngOnInit(): void {
    this.spinner.show();
    this.spinner.hide();
  }

  public getTrainingList(): void {
    this.trainingList = [];
    this.spinner.show();
    let api = 'rewards_recognition/report-list2/'+this.companyId+'?status=' + this.status;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.trainingList = data.data.content;
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
    let fileName='rewards-recognition-report';
    if (type == 'EXCEL') {
      fileName=fileName+'.xls';
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    else {
      fileName=fileName+'.pdf';
      fileType = 'application/pdf';
    }

    let api: any = "reports/reward_report/"+this.companyId +"/" + type + "?status=" + this.status;
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

}
