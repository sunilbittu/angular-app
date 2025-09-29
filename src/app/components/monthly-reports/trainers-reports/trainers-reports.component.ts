import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-trainers-reports',
  templateUrl: './trainers-reports.component.html',
  styleUrls: ['./trainers-reports.component.css']
})
export class TrainersReportsComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService,
    public crudOperationsService: CrudOperationsService, private notification: NotifierService,
    public datePipe: DatePipe) { }

  public headers: any = ['Trainer Name','Technology', 'Contact Number', 'Email', 'Company'];
  public technologies: any = [];
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public employeeId: any = Number(sessionStorage.getItem('empId'));
  public trainersList: any = [];
  public type: any = '';
  public id: any = '';
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public submitText = '';
  public api = 'manage-trainers'
  public submitProcessing = false;
  public employeeDetails: any = {};
  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public confirmClicked = false;
  public cancelClicked = false;
  public isForViewAndSubmitDisabled: boolean = false;
  public submitErrorText: any = '';
  public showExternal: boolean = true;
  public employeeList!: any[];
  public isForEdit: any = false;
  public trainersForm = this.formBuilder.group({
    employee: [''],
    trainerId: ['', Validators.required],
    trainerName: ['', Validators.required],
    contactNo: ['', Validators.required],
    email: ['', Validators.required],
    technology: ['', Validators.required],
    experience: ['', Validators.required],
    company: ['', Validators.required],
  })

  get form_() { return this.trainersForm.controls; };

  get _form() { return this.trainersForm.value };

  ngOnInit(): void {
    this.getTrainersList();
  }

  getTrainersList() {
    this.spinner.show();
    let api = this.api + '/list2/' + this.companyId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.trainersList = data.data;
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }

  exportTable(type: string) {
    //spinner show
    this.spinner.show();
    var fileType = '';
    let fileName='trainers-report';
    if (type == 'EXCEL') {
      fileName=fileName+'.xls';
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    else {
      fileName=fileName+'.pdf';
      fileType = 'application/pdf';
    }
    let api: any = "reports/trainers_report/" + type + "?companyId=" + this.companyId;
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
