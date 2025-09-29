import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-training-exam-results-report',
  templateUrl: './training-exam-results-report.component.html',
  styleUrls: ['./training-exam-results-report.component.css']
})
export class TrainingExamResultsReportComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService,
    public crudOperationsService: CrudOperationsService, private notification: NotifierService) { }

  public headers: any = ['S.no','Name', 'Grade Points', 'Remarks'];
  public technologies: any = [];
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public employeeId: any = Number(sessionStorage.getItem('empId'));
  public trainersList: any = [];
  public type: any = '';
  public technologyModel: any;
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
  public technologyList: any = [];
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
    this.fetchManageTraining();
  }


  exportTable(type: string) {
    //spinner show
    this.spinner.show();
    var fileType = '';
    let fileName='training-exam-result-report'
    if (type == 'EXCEL') {
      fileName=fileName+'.xls';
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    else {
      fileName=fileName+'.pdf';
      fileType = 'application/pdf';
    }
    let api: any = "reports/trainees_results_report/" + type + "?batchName=" + this.technologyModel;
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

  fetchManageTraining() {
    this.spinner.show();
    let api:any="manage-training/batchList/"+this.companyId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.technologyList = data.data;
    },
    (error) => {
      this.notification.notify('error', 'Something Went Worng');
      //spinner hide
      this.spinner.hide();
    })
  }

  fetchEmployees() {
     let api:any="employeetrainingresultsassesment/employee_list2/"+this.technologyModel;
     this.crudOperationsService.getList(api).subscribe((data: any) => {
       this.trainersList = data.data;
     })
   }

   clearData(){
    this.technologyModel="";
  }
}
