import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-work-experiance',
  templateUrl: './work-experiance.component.html',
  styleUrls: ['./work-experiance.component.css']
})
export class WorkExperianceComponent implements OnInit {

  public headers: any = ['Employer Name', 'Place', 'From', 'To', 'Basic Salary', 'Total Salary', 'Reason for Leaving', 'Desg. Scope', 'Supervisor Deatils', 'Currency', 'Total'];

  public workExperienceForm!: FormGroup;
  public workExperienceObjeect!: any;
  public workExperienceList!: any[];
  public employeeId!: number;
  public workExperienceById!: any;
  public enableButton!: boolean;
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public cancelClicked: boolean = false;

  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe, private crudeOperationService: CrudOperationsService,
    private notificationService: NotifierService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.workExperienceForm = this.formBuilder.group({
      employerDetails: ['', Validators.required],
      place: ['', Validators.required],
      from: ['', Validators.required],
      to: ['', Validators.required],
      basicSalary: [''],
      totalSalary: [''],
      reasonnForLeaving: [''],
      desigScope: [''],
      supervisorDetails: [''],
      currency: [''],
      totalExperience: ['', Validators.required]
    })

    //fetchWorkExperienceListByEmployeeId
    this.fetchWorkExperienceListByEmployeeId();
  }
  get form_() { return this.workExperienceForm.controls; };
  //fetchWorkExperienceListByEmployeeId
  fetchWorkExperienceListByEmployeeId() {
    this.employeeId = Number(sessionStorage.getItem('Edit-employeeId'));
    let api: any = 'employeeworkexperiencedetail/list_by_employee/' + this.employeeId;
    this.crudeOperationService.getList(api)
      .subscribe((data: any) => {
        this.workExperienceList = data.data.content

      },
        (error) => {
          this.notificationService.notify('error', 'Something Went Wrong');
        })
  }
  //edit function
  editWorkExperience(id: number) {

    //spinner show
    this.spinner.show();

    let api: any = 'employeeworkexperiencedetail/' + id;
    this.crudeOperationService.getList(api)
      .subscribe((data: any) => {
        this.workExperienceById = data.data;
        this.enableButton = true;

        //spinner hide
        this.spinner.hide();

        let expFromDate = new Date(this.workExperienceById.fromDate);
        let expToDate = new Date(this.workExperienceById.toDate);
        //set to formControls
        this.workExperienceForm.patchValue({
          employerDetails: this.workExperienceById.employerDetails,
          place: this.workExperienceById.place,
          from: expFromDate,
          //from:  new Date(),
          to: expToDate,
          basicSalary: this.workExperienceById.basicSalary,
          totalSalary: this.workExperienceById.totalSalary,
          reasonnForLeaving: this.workExperienceById.reasonForLeaving,
          desigScope: this.workExperienceById.desigScope,
          supervisorDetails: this.workExperienceById.supervisorDetails,
          currency: this.workExperienceById.currency,
          totalExperience: this.workExperienceById.totalExperience
        })

      },
        (error) => {
          this.notificationService.notify('error', 'Something Went Wrong');
          //spinner hide
          this.spinner.hide();
        })
  }
  updateWorkExperience() {
    this.submitted = true;

    if (this.workExperienceForm.valid == true) {
      //spinner show
      this.spinner.show();

      let expFromDate = this.datePipe.transform(this.workExperienceForm.value.from, 'dd-MM-yyyy');
      let expToDate = this.datePipe.transform(this.workExperienceForm.value.to, 'dd-MM-yyyy');
      this.workExperienceObjeect =
      {

        "workExperienceId": this.workExperienceById.workExperienceId,
        "basicSalary": this.workExperienceForm.value.basicSalary,
        "currency": this.workExperienceForm.value.currency,
        "fromDate": expFromDate,
        //"fromDate": this.workExperienceForm.value.from,
        "desigScope": this.workExperienceForm.value.desigScope,
        "employerDetails": this.workExperienceForm.value.employerDetails,
        "place": this.workExperienceForm.value.place,
        "reasonForLeaving": this.workExperienceForm.value.reasonnForLeaving,
        "supervisorDetails": this.workExperienceForm.value.supervisorDetails,
        "toDate": expToDate,
        //"toDate": this.workExperienceForm.value.to,
        "totalExperience": this.workExperienceForm.value.totalExperience,
        "totalSalary": this.workExperienceForm.value.totalSalary,
        "createdBy": this.workExperienceById.createdBy,
        "createdDate": this.workExperienceById.createdDate,
        "isDeleted": this.workExperienceById.isDeleted,
        "employee": {
          "employeeId": this.employeeId
        }

      }
      let api: any = 'employeeworkexperiencedetail/' + this.workExperienceById.workExperienceId;
      this.crudeOperationService.update(this.workExperienceObjeect, api)
        .subscribe((data: any) => {
          this.notificationService.notify('success', data.message);
          this.submitted = false;
          //spinner hide
          this.spinner.hide();
          //fetchWorkExperienceListByEmployeeId
          this.fetchWorkExperienceListByEmployeeId();
          this.workExperienceForm.reset();
          //reset button
          this.enableButton = false;
        },
          (error) => {
            this.notificationService.notify('error', 'Something Went Wrong');
            //spinner hide
            this.spinner.hide();
          })
    }

  }

  //delete workexperiance records
  deleteWorkExperiance(id: number) {

    //spinner show
    this.spinner.show();

    let api: any = "employeeworkexperiencedetail/" + id;
    this.crudeOperationService.delete(api)
      .subscribe((data: any) => {
        this.notificationService.notify('success', data.message);

        //spinner hide
        this.spinner.hide();

        //fetchWorkExperienceListByEmployeeId
        this.fetchWorkExperienceListByEmployeeId();
      },
        (error) => {
          this.notificationService.notify('error', 'Something Went Wrong');
          //spinner hide
          this.spinner.hide();
        })
  }
  onSubmit() {
    this.submitted = true;

    if (this.workExperienceForm.valid == true) {
      //spinner show
      this.spinner.show();
      let expFromDate = this.datePipe.transform(this.workExperienceForm.value.from, 'dd-MM-yyyy');
      let expToDate = this.datePipe.transform(this.workExperienceForm.value.to, 'dd-MM-yyyy');
      let url = 'employeeworkexperiencedetail/validate?employerName=' +
        this.workExperienceForm.value.employerDetails + '&place=' + this.workExperienceForm.value.place +
        '&from=' + expFromDate + '&to=' + expToDate;
      this.crudeOperationService.getList(url).subscribe((res: any) => {
        if (res.data) {
          this.spinner.hide();
          this.notificationService.notify('error', 'Qualification Details is already exist in DB with ' +
            this.workExperienceForm.value.employerDetails + ', ' + this.workExperienceForm.value.place +
            ', ' + expFromDate + ' and ' + expToDate +
            ' Please check once!!!');
        } else {
          this.saveWorkExp();
        }
      })
    }
  }

  clear() {
    this.submitted = false;
    this.workExperienceForm.patchValue({
      employerDetails: '',
      place: '',
      from: '',
      to: '',
      basicSalary: '',
      totalSalary: '',
      reasonnForLeaving: '',
      desigScope: '',
      supervisorDetails: '',
      currency: '',
      totalExperience: ''
    })
  }
  saveWorkExp() {
    let expFromDate = this.datePipe.transform(this.workExperienceForm.value.from, 'dd-MM-yyyy');
    let expToDate = this.datePipe.transform(this.workExperienceForm.value.to, 'dd-MM-yyyy');
    this.workExperienceObjeect =
    {
      "basicSalary": this.workExperienceForm.value.basicSalary,
      "currency": this.workExperienceForm.value.currency,
      "fromDate": expFromDate,
      "desigScope": this.workExperienceForm.value.desigScope,
      "employerDetails": this.workExperienceForm.value.employerDetails,
      "place": this.workExperienceForm.value.place,
      "reasonForLeaving": this.workExperienceForm.value.reasonnForLeaving,
      "supervisorDetails": this.workExperienceForm.value.supervisorDetails,
      "toDate": expToDate,
      "totalExperience": this.workExperienceForm.value.totalExperience,
      "totalSalary": this.workExperienceForm.value.totalSalary,
      "employee": {
        "employeeId": this.employeeId
      }

    }

    let api: any = 'employeeworkexperiencedetail';
    this.crudeOperationService.create(this.workExperienceObjeect, api)
      .subscribe((data: any) => {
        this.notificationService.notify('success', data.message);
        //spinner hide
        this.submitted = false;
        this.spinner.hide();
        //fetchWorkExperienceListByEmployeeId
        this.fetchWorkExperienceListByEmployeeId();
        this.workExperienceForm.reset();
      },
        (error) => {
          this.notificationService.notify('error', 'Something Went Wrong');
          //spinner hide
          this.spinner.hide();
        })
  }

  submit() {
    if (this.importFileData != null) {
      this.spinner.show();
      this.toggleLoader = true;
      this.importResult = [];
      this.disableImport = true;
      this.importText = 'Please Wait.!!';
      console.log(this.importFileData);
      const form = new FormData();
      let obj: any = {};
      obj.employeeId = this.employeeId;
      form.append('data', JSON.stringify(obj));
      form.append('excel', this.importFileData);
      let url = 'employeeworkexperiencedetail/importExcel';
      this.crudeOperationService.importFile(form, url).subscribe((data: any) => {
        this.spinner.hide();
        this.successCount = 0;
        this.errorCount = 0;
        this.importResult = data.data;
        this.toggleLoader = false;
        this.disableImport = false;
        this.importText = 'Import';
        for (let i = 0; i < this.importResult.length; i++) {
          if (this.importResult[i].errors.length > 0) {
            this.errorCount = this.errorCount + 1;
          } else {
            this.successCount = this.successCount + 1;
          }
        }
        this.showSuccessMsg = this.successCount > 0;
        this.showErrorMsg = this.errorCount > 0;
        if (this.showSuccessMsg) {
          this.fetchWorkExperienceListByEmployeeId();
        }
      },
        (error) => {
          this.notificationService.notify('error', 'Something Went Wrong');
          //spinner hide
          this.spinner.hide();
        })
    }
  }

  clickImport() {
    this.importResult = [];
    this.importText = 'Import';
    this.showSuccessMsg = false;
    this.showErrorMsg = false;
    this.importFileModel = '';
    this.importFileData = null;
    this.toggleLoader = false;
  }

  public importFileData: any = File;
  public importText = 'Import';
  public listOfErrors: any[] = [];
  public importResult: any[] = [];
  public showSuccessMsg = false;
  public showErrorMsg = false;
  public successCount = 0;
  public errorCount = 0;
  public errors: any;
  public disableImport: boolean = false;
  public toggleLoader: boolean = false;
  public importEmpty: boolean = false;
  public importFileModel: any;
  importFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      console.log(event.target.files[0].type);
      if (event.target.files[0].type === 'application/vnd.ms-excel' || event.target.files[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        this.importFileData = event.target.files[0];
      }
    }
  }
}
