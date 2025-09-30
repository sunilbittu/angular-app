import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.css']
})
export class FeedbackListComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService,
    public crudOperationsService: CrudOperationsService, private notification: NotifierService,
    public datePipe: DatePipe) { }

  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public employeeId: any = Number(sessionStorage.getItem('empId'));
  public headers: any = ['Training Id', 'Technology', 'Employee Id', 'Employee Name', 'Trainer Name', 'Rating', 'Comments'];
  public feedbackList: any = [];
  public trainersList: any = [];
  public trainingList: any = [];
  public traineesList: any = [];
  public technologies: any = [];
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public submitText = '';
  public api = 'training-feedback'
  public submitProcessing = false;
  public totalRating: number = 0;

  // pagination
  public p: number = 1;
  public itemsPerPage: any;
  public totalItems: any;
  public currentPage: any;
  public totalElements: number = 0;
  public showingFrom: number = 0;
  public showingTo: number = 0;
  public pageNumber: Number = 0;
  public pageSize: number = 20;

  public feedbackForm = this.formBuilder.group({
    trainer: [null, Validators.required],
    technology: [null, Validators.required],
    trainingId: [null, Validators.required]
  })

  get form_() { return this.feedbackForm.controls; };

  get _form() { return this.feedbackForm.value };


  ngOnInit(): void {
    this.getAllTechnologies();
  }

  getAllTechnologies() {
    this.spinner.show();
    let listApi = 'technologymaster/dropdownList?companyId=' + this.companyId;
    this.crudOperationsService.getList(listApi)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.technologies = data.data;
      },
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Wrong');
        })

  }

  getTrainersList(id: any) {
    this.trainersList = [];
    this.form_['trainer'].patchValue(null);
    this.spinner.show();
    let api = 'manage-trainers/dropdownList?id=' + id;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.trainersList = data.data;
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }

  changeName() {
    this.getTrainersList(this._form.technology);
  }

  handleTrainer() {
    this.getTrainingList(this._form.trainer);
  }
  getTrainingList(id: any) {
    this.trainingList = [];
    this.form_['trainingId'].patchValue(null);
    this.spinner.show();
    let api = 'manage-training/getTrainingListByTrainerId?id=' + id;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.trainingList = data.data;
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }

  public search(): void {
    this.submitted = true;
    if (this.feedbackForm.valid) {
      this.feedbackList = [];
      this.spinner.show();
      let api = this.api + '/filtered-list?id=' + this._form.trainingId + '&page=' + this.pageNumber + '&size=' + this.pageSize;
      this.crudOperationsService.getList(api).subscribe((data: any) => {
        this.spinner.hide();
        this.feedbackList = data.data.content;
        //pagination call
        this.handlePagination(data);
        if (this.feedbackList && this.feedbackList.length > 0) {
          this.feedbackList.forEach((feed: any) => {
            this.totalRating = this.totalRating + Number(feed.rating);
          });
          this.totalRating = this.totalRating / this.feedbackList.length;
        }
      },
        (error) => {
          this.spinner.hide();
          console.log(error);
        })
    }
  }

  public handlePagination(data: any): void {
    this.totalElements = data.data.totalElements;
    this.currentPage = data.data.pageable.pageNumber + 1;
    this.totalItems = (data.data.totalPages) * this.pageSize;
    this.showingFrom = (data.data.pageable.pageNumber * this.pageSize) + 1;
    const to = (data.data.pageable.pageNumber + 1) * this.pageSize;
    if (this.totalElements >= to) {
      this.showingTo = to;
    } else {
      this.showingTo = this.totalElements;
    }
  }
  public pageChanged(event: any): void {
    this.pageNumber = event - 1;
    this.search();
  }

  public clear(): void {
    this.submitted = false;
    this.feedbackForm.reset();
  }
}
