import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-rewards-recognition',
  templateUrl: './rewards-recognition.component.html',
  styleUrls: ['./rewards-recognition.component.css']
})
export class RewardsRecognitionComponent implements OnInit {
  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';

  public headers: any = ['Reward Name', 'Budget', 'Action'];
  public headers2: any = ['Recognition Name', 'Type', 'Action'];
  public requiredErrorText = 'can\'t be blank';
  public submitted: boolean = false;
  public rewardForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    budget: ['', Validators.required]
  });
  public recognitionForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    recognisationType: ['', Validators.required]
  });
  public rewardList!: any[];
  public recognitionList!: any[];
  public currencyObject!: any;
  public rewardRecognitionId!: any;
  public cancelClicked = false;
  public isForSaveReward: boolean = false;
  public isForSaveRecognition: boolean = false;
  public submitProcessing = false;
  public id: any;
  public isNameExist: boolean = false;

  public companyId: number = Number(sessionStorage.getItem('companyId'));

  constructor(private formBuilder: FormBuilder, private notification: NotifierService,
    private crudOperationsService: CrudOperationsService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.fetchRewardList();
    this.fetchRecognitionList();
  }
  get form_() { return this.rewardForm.controls; };
  get form2_() { return this.recognitionForm.controls; };
  //paginationrewards
  public p: number = 1;
  itemsPerPage: any=10;
  totalItems: any;
  currentPage: any;
  totalElements: number = 0;
  showingFrom: number = 0;
  showingTo: number = 0;
  public pageNumber: Number = 0;
  public pageSize: number = 10;
  public handlePagination(data: any) {
    this.totalElements = data.data.totalElements;
    this.itemsPerPage = 10;
    this.currentPage = data.data.pageable.pageNumber + 1;
    this.totalItems = (data.data.totalPages) * this.itemsPerPage;
    this.showingFrom = (data.data.pageable.pageNumber * this.itemsPerPage) + 1;
    const to = (data.data.pageable.pageNumber + 1) * this.itemsPerPage;
    if (this.totalElements >= to) {
      this.showingTo = to;
    } else {
      this.showingTo = this.totalElements;
    }
  }
   
  public pageChanged(event: any): void {
    this.pageNumber = event - 1;
    this.fetchRewardList();
  } 

    // Existing properties...

    // Pagination variables for Recognition List
    public pRecognition: number = 1;
    itemsPerPageRecognition: any = 10;
    totalItemsRecognition: any;
    currentPageRecognition: any;
    totalElementsRecognition: number = 0;
    showingFromRecognition: number = 0;
    showingToRecognition: number = 0;

    // Existing methods...

    public pageChangedRecognition(event: any): void {
        this.pRecognition = event-1;
        this.fetchRecognitionList();
    }

    // Update the handlePagination method to handle recognition pagination as well
    public handlePaginationRecognition(data: any) {
        this.totalElementsRecognition = data.data.totalElements;
        this.itemsPerPageRecognition = 10;
        this.currentPageRecognition = data.data.pageable.pageNumber + 1;
        this.totalItemsRecognition = (data.data.totalPages) * this.itemsPerPageRecognition;
        this.showingFromRecognition = (data.data.pageable.pageNumber * this.itemsPerPageRecognition) + 1;
        const to = (data.data.pageable.pageNumber + 1) * this.itemsPerPageRecognition;
        if (this.totalElementsRecognition >= to) {
            this.showingToRecognition = to;
        } else {
            this.showingToRecognition = this.totalElementsRecognition;
        }
    }



  //clear form values
  clickAddReward() {
    this.clearReward();
  }
  clickAddRecognition() {
    this.clearRecognition();
  }

  clearReward() {
    this.submitted = false;
    this.isForSaveReward = true;
    this.isNameExist = false;
    this.rewardForm.reset();
  }

  clearRecognition() {
    this.submitted = false;
    this.isForSaveRecognition = true;
    this.isNameExist = false;
    this.rewardForm.reset();
  }

  checkName(type: any) {
    this.isNameExist = false;
    let result = undefined;
    if (type === 'Reward') {
      result = this.rewardList.find((e: any) => e.name.toLowerCase() == this.rewardForm.value.name.toLowerCase());
    } else {
      result = this.recognitionList.find((e: any) => e.name.toLowerCase() == this.recognitionForm.value.name.toLowerCase());
    }
    if (result) {
      this.isNameExist = true;
    }
  }

  public searchModel='';
  public searchModel1='';

  fetchRewardList() {
    this.spinner.show();
    let api = 'rewards_recognition/dropdownList_other/' + this.companyId + '?type=Reward&search='+this.searchModel+'&page='+this.pageNumber+'&size=10';
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.rewardList = data.data.content;
        this.handlePagination(data);
      },
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Worng');
        })
  }

  fetchRecognitionList() {
    this.spinner.show();
    let api2 = 'rewards_recognition/dropdownList_other/' + this.companyId + '?type=Recognition&search='+this.searchModel1+'&page=&size=10';
    this.crudOperationsService.getList(api2)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.recognitionList = data.data.content;
        this.handlePaginationRecognition(data);
      },
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Worng');
        })
  }

  editReward(data: any) {
    //show edit button
    this.isForSaveReward = false;
    this.rewardRecognitionId = data.rewardRecognitionId;
    this.rewardForm = this.formBuilder.group({
      name: [data.name, Validators.required],
      budget: [data.budget, Validators.required]
    });
  }

  editRecognition(data: any) {
    //show edit button
    this.isForSaveRecognition = false;
    this.rewardRecognitionId = data.rewardRecognitionId;
    this.recognitionForm = this.formBuilder.group({
      name: [data.name, Validators.required],
      recognisationType: [data.recognisationType, Validators.required]
    });
  }

  public getRewFormValue(type: any, name: any, budget: any): any {
    return { 'type': type, 'name': name, 'budget': budget, 'company': { 'companyId': this.companyId } };
  }

  //save reward form data
  saveReward() {
    this.submitted = true;
    if (this.rewardForm.valid && !this.isNameExist) {
      this.submitProcessing = true;
      let obj = this.getRewFormValue('Reward', this.rewardForm.value.name, this.rewardForm.value.budget);
      let api = 'rewards_recognition';
      this.crudOperationsService.create(obj, api)
        .subscribe((data: any) => {
          $('#rewardModal').modal('hide');
          this.notification.notify('success', data.message);
          this.submitted = false;
          this.submitProcessing = false;
          this.fetchRewardList();
        }, (error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong');
        })
    }
  }

  //save reward form data
  updateReward() {
    this.submitted = true;
    if (this.rewardForm.valid) {
      this.submitProcessing = true;
      let obj = this.getRewFormValue('Reward', this.rewardForm.value.name, this.rewardForm.value.budget);
      let api = 'rewards_recognition/' + this.rewardRecognitionId;
      this.crudOperationsService.update(obj, api)
        .subscribe((data: any) => {
          $('#rewardModal').modal('hide');
          this.notification.notify('success', data.message);
          this.submitted = false;
          this.submitProcessing = false;
          this.fetchRewardList();
        }, (error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong');
        })
    }
  }

  public getRecFormValue(type: any, name: any, recognisationType: any): any {
    return { 'type': type, 'name': name, 'recognisationType': recognisationType, 'company': { 'companyId': this.companyId } };
  }

  //save Recognition form data
  saveRecognition() {
    this.submitted = true;
    if (this.recognitionForm.valid && !this.isNameExist) {
      this.submitProcessing = true;
      let obj = this.getRecFormValue('Recognition', this.recognitionForm.value.name, this.recognitionForm.value.recognisationType);
      let api = 'rewards_recognition';
      this.crudOperationsService.create(obj, api)
        .subscribe((data: any) => {
          $('#recognitionModal').modal('hide');
          this.notification.notify('success', data.message);
          this.submitted = false;
          this.submitProcessing = false;
          this.fetchRecognitionList();
        }, (error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong');
        })
    }
  }

  //Update Recognition form data
  updateRecognition() {
    this.submitted = true;
    if (this.recognitionForm.valid) {
      this.submitProcessing = true;
      let obj = this.getRecFormValue('Recognition', this.recognitionForm.value.name, this.recognitionForm.value.recognisationType);
      let api = 'rewards_recognition/' + this.rewardRecognitionId;
      this.crudOperationsService.update(obj, api)
        .subscribe((data: any) => {
          $('#recognitionModal').modal('hide');
          this.notification.notify('success', data.message);
          this.submitted = false;
          this.submitProcessing = false;
          this.fetchRecognitionList();
        }, (error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong');
        })
    }
  }

  deleteRewardById(id: number) {
    let api = 'rewards_recognition/';
    this.spinner.show();
    this.crudOperationsService.delete2(id, api)
      .subscribe((data: any) => {
        this.spinner.hide();
        if (data.status == 'success') {
          this.notification.notify('success', data.message);
        }
        this.fetchRewardList();
      },
        (error) => {
          this.spinner.hide();
          if (error.error.error == 'Conflict') {
            this.notification.notify('error', error.error.message);
          } else {
            this.notification.notify('error', 'Something Went Worng');
          }
        })
  }

  deleteRecognitionById(id: number) {
    this.spinner.show();
    let api = 'rewards_recognition/';
    this.crudOperationsService.delete2(id, api)
      .subscribe((data: any) => {
        this.spinner.hide();
        if (data.status == 'success') {
          this.notification.notify('success', data.message);
        }
        this.fetchRecognitionList();
      },
        (error) => {
          this.spinner.hide();
          if (error.error.error == 'Conflict') {
            this.notification.notify('error', error.error.message);
          } else {
            this.notification.notify('error', 'Something Went Worng');
          }
        })
  }

}
