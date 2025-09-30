import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { data } from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { AddEmployeeService } from '../../addEmplyee.service';
declare var $: any;

@Component({
  selector: 'app-qualification',
  templateUrl: './qualification.component.html',
  styleUrls: ['./qualification.component.css']
})
export class QualificationComponent implements OnInit {

  public qualificationForm!: FormGroup;
  public qualificationFormObject!: any;
  public qualificationsData!: any[];
  public employeeQualificationDetails!: any[];
  public companyId!: number;
  public employeeId!: number;
  public qualificationById!: any;
  public qualificationId!: number;
  public cancelClicked: any;

  public enableUpdateButton!: any;
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';

  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  constructor(private formBuilder: FormBuilder, private employeeService: AddEmployeeService, private crudOperationsService: CrudOperationsService,
    private notificationService: NotifierService, private datePipe: DatePipe, private spinner: NgxSpinnerService) { }
  public headers: any = ['Qualification', 'Institute', 'Board', 'Main Subject', 'Division', 'Marks %', 'Passing Year', 'Weightage'];
  ngOnInit(): void {

    this.qualificationForm = this.formBuilder.group({

      qualification: ['', Validators.required],
      institute: ['', Validators.required],
      board: [''],
      mainSubject: [''],
      division: [''],
      marks: ['', Validators.required],
      passingYear: ['', Validators.required],
      weightage: ['']

    })
    //get all qualifications
    this.getAllEmployeeQualifications();

    //get qualificationDetails
    this.getQualificationDetailsList()
  }
  get form_() { return this.qualificationForm.controls; };
  //get all qualifications
  getAllEmployeeQualifications() {
    this.companyId = Number(sessionStorage.getItem('companyId'));
    this.employeeId = Number(sessionStorage.getItem('Edit-employeeId'));
    return this.employeeService.getEmployeeQualifications(this.companyId)
      .subscribe((data: any) => {
        this.qualificationsData = data.data.content;
      },
        (error) => {
          console.log(error);
        })
  }
  //get qualificationDetails
  getQualificationDetailsList() {
    this.employeeService.getQualificationDetails(this.employeeId)
      .subscribe((data: any) => {
        this.employeeQualificationDetails = data.data;
      },
        (error) => {
          console.log(error);
        })
  }
  editEmployeeQualifications(id: number) {

    //spinner show
    this.spinner.show();

    //get Id
    this.qualificationId = id
    this.employeeService.getEmployeeQualificationById(id)
      .subscribe((data: any) => {

        this.qualificationById = data.data;

        //enable update button
        this.enableUpdateButton = true;
        //spinner hide
        this.spinner.hide();

        this.qualificationForm.patchValue({

          qualification: this.qualificationById.qualificationMaster.qualificationId,
          institute: this.qualificationById.institute,
          board: this.qualificationById.board,
          mainSubject: this.qualificationById.mainSubject,
          division: this.qualificationById.division,
          marks: this.qualificationById.marks,
          passingYear: this.qualificationById.passingYear,
          weightage: this.qualificationById.weightage

        })
      },
        (error) => {
          console.log(error);
          //spinner hide
          this.spinner.hide();
        })
  }
  updateEmployeeQualification(id: number) {
    this.submitted = true;

    if (this.qualificationForm.valid == true) {

      //spinner show
      this.spinner.show();

      this.qualificationFormObject =
      {

        "qualificationDetailsId": this.qualificationId,
        "board": this.qualificationForm.value.board,
        "division": this.qualificationForm.value.division,
        "institute": this.qualificationForm.value.institute,
        "mainSubject": this.qualificationForm.value.mainSubject,
        "marks": this.qualificationForm.value.marks,
        "passingYear": this.qualificationForm.value.passingYear,
        "weightage": this.qualificationForm.value.weightage,
        "createdBy": this.qualificationById.createdBy,
        "createdDate": this.qualificationById.createdDate,
        "isDeleted": this.qualificationById.isDeleted,
        "employee": {
          "employeeId": this.employeeId
        },
        "qualificationMaster":
        {
          "qualificationId": this.qualificationForm.value.qualification

        }
      }

      //update qualificationObject
      this.employeeService.updateEmployeeQualificationsDetails(this.qualificationId, this.qualificationFormObject)
        .subscribe((data: any) => {
          this.submitted = false;

          this.notificationService.notify('success', data.message);

          $('#employeeModelPopup').modal('hide');
          this.qualificationForm.reset();
          //spinner hide
          this.spinner.hide();

          //get qualificationDetails
          this.getQualificationDetailsList()

        },
          (error) => {
            this.notificationService.notify('error', 'Something Went Wrong');
            //spinner hide
            this.spinner.hide();
            console.log(error);
          })

    }
  }
  deleteEmployeeQualificationsById(id: number) {

    //spinner show
    this.spinner.show();

    this.employeeService.deleteEmployeeQualificationById(id)
      .subscribe((data: any) => {

        this.notificationService.notify('success', data.message);
        //spinner hide
        this.spinner.hide();

        //get qualificationDetails
        this.getQualificationDetailsList()

      },
        (error) => {
          this.notificationService.notify('error', 'Something Went Wrong');
          //spinner hide
          this.spinner.hide();
          console.log(error);
        })

  }
  onSubmit() {
    this.submitted = true;
    if (this.qualificationForm.valid) {
      //spinner show
      this.spinner.show();

      let url = 'employeequalificationdetail/validate?qualificationId=' +
        this.qualificationForm.value.qualification + '&institute=' + this.qualificationForm.value.institute;
      this.crudOperationsService.getList(url).subscribe((res: any) => {
        if (res.data) {
          this.spinner.hide();
          let result = this.qualificationsData.find((e: any) => e.qualificationId == this.qualificationForm.value.qualification);
          this.notificationService.notify('error', 'Qualification Details is already exist in DB with ' +
            result.qualificationName + ' and ' + this.qualificationForm.value.institute + ' Please check once!!!');
        } else {
          this.saveQualification();
        }
      })
    }

  }
  saveQualification() {
    this.qualificationFormObject = {
      "board": this.qualificationForm.value.board,
      "division": this.qualificationForm.value.division,
      "institute": this.qualificationForm.value.institute,
      "mainSubject": this.qualificationForm.value.mainSubject,
      "marks": this.qualificationForm.value.marks,
      "passingYear": this.qualificationForm.value.passingYear,
      "weightage": this.qualificationForm.value.weightage,
      "employee": {
        "employeeId": this.employeeId
      },
      "qualificationMaster": {
        "qualificationId": this.qualificationForm.value.qualification
      }
    }
    this.employeeService.postEmployeeQualificationsDetails(this.qualificationFormObject)
      .subscribe((data: any) => {
        this.submitted = false;
        this.notificationService.notify('success', data.message);
        this.qualificationForm.reset();
        //spinner hide
        this.spinner.hide();
        //get qualificationDetails
        this.getQualificationDetailsList()
      },
        (error) => {
          this.notificationService.notify('error', 'Something Went Wrong');
          //spinner hide
          this.spinner.hide();
        })
  }

  clear() {
    this.submitted = false;
    this.qualificationForm.patchValue({
      qualification: '',
      institute: '',
      board: '',
      mainSubject: '',
      division: '',
      marks: '',
      passingYear: '',
      weightage: ''
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
      obj.companyId = this.companyId;
      obj.employeeId = this.employeeId;
      form.append('data', JSON.stringify(obj));
      form.append('excel', this.importFileData);
      let url = 'employeequalificationdetail/importExcel';
      this.crudOperationsService.importFile(form, url).subscribe((data: any) => {
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
          this.getQualificationDetailsList();
        }
      });
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
