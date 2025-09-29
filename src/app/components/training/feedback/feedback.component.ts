import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService,
    public crudOperationsService: CrudOperationsService, private notification: NotifierService,
    public datePipe: DatePipe) { }

  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public employeeId: any = Number(sessionStorage.getItem('empId'));
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public submitText = 'Submit';
  public api = 'training-feedback'
  public submitProcessing = false;
  public technologies: any = [];
  public traineesList: any = [];
  public ratingList: any = [1, 2, 3, 4, 5];
  public employeeDetails: any = {};
  public isFeedbackSubmitted: any = false;

  public feedbackForm = this.formBuilder.group({
    employee: ['', Validators.required],
    trainer: ['', Validators.required],
    training: [null, Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    rating: [null, Validators.required],
    comments: ['', Validators.required]
  })

  get form_() { return this.feedbackForm.controls; };

  get _form() { return this.feedbackForm.value };

  ngOnInit(): void {
    this.fetchTrainees();
    this.getEmpDetails();
  }

  getEmpDetails() {
    this.crudOperationsService.getList('employee/get_employee_by_id/' + this.employeeId)
      .subscribe((data: any) => {
        if (data.data) {
          this.employeeDetails = data.data;
          this.form_['employee'].patchValue(this.employeeDetails.firstName + ' ' + this.employeeDetails.lastName);
        }
      });
  }

  fetchTrainees() {
    this.spinner.show();
    let api = 'manage-training/getListByTraineesId?id=' + this.employeeId + '&companyId=' + this.companyId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.traineesList = data.data;
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }

  changeName() {
    this.isFeedbackSubmitted = false;
    let data = this.traineesList.find((e: any) => e.manageTrainingId == this._form.training);
    data.traineesIds.forEach((t: any) => {
      if(t.employeeId == this.employeeId && t.feedbackSent == true) {
        this.isFeedbackSubmitted = true;
      }
    });
    this.form_['trainer'].patchValue(data.trainerDetails.trainerId + '-' + data.trainerDetails.trainerName);
    this.form_['startDate'].patchValue(this.datePipe.transform(data.startDate, 'dd-MM-yyyy'));
    this.form_['endDate'].patchValue(this.datePipe.transform(data.endDate, 'dd-MM-yyyy'));
  }

  submit() {
    this.submitted = true;
    for (let el in this.form_) {
      if (this.form_[el].errors) {
        console.log(el)
      }
    }
    if (this.feedbackForm.valid) {
      this.save(this.getFormData(), this.api);
    }
  }
  save(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.create(formData, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        this.submitProcessing = false;
        this.ngOnInit();
        this.clear();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }
  getFormData(): any {

    let manageTrainingId = {
      'manageTrainingId': Number(this._form.training)
    }
    let object = {
      'rating': this._form.rating,
      'comments': this._form.comments,
      'employeeId': {
        'employeeId': this.employeeId
      },
      'manageTrainingId': manageTrainingId
    };
    return object;
  }

  clear() {
    this.submitted = false;
    this.feedbackForm.reset();
    this.form_['employee'].patchValue(this.employeeDetails.firstName + ' ' + this.employeeDetails.lastName);
    this.submitText = 'Create';
  }

}
