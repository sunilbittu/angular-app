import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { AddEmployeeService } from '../../master/addEmplyee.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';

@Component({
  selector: 'app-manage-training',
  templateUrl: './manage-training.component.html',
  styleUrls: ['./manage-training.component.css']
})
export class ManageTrainingComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService,
    public crudOperationsService: CrudOperationsService, private notification: NotifierService,
    public datePipe: DatePipe, private employeeService: AddEmployeeService, private employeMasterService: EmployeeMastersService) { }

  public headers: any = ['Technology', 'Trainer Name', 'Training Start Date', 'Training End Date', 'Training Start Time', 'Training End Time', 'Total training hours', 'Batch Name', 'Trainees', 'Actions'];
  public headers2: any = ['Technology', 'No Of Attendees', 'Status', 'Actions'];
  public technologies: any = [];
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public employeeId: any = Number(sessionStorage.getItem('empId'));
  public trainersList: any = [];
  public statusList: any = ['Open', 'Approved'];
  public trainingList: any = [];
  public trainingRequestList: any = [];
  public traineesList: any = [];
  public type: any = '';
  public id: any = '';
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public submitText = '';
  public api = 'manage-training'
  public submitProcessing = false;
  public employeeDetails: any = {};
  public popoverTitle = 'Training Cancel Confirmation';
  public popoverMessage = 'Are you sure you want Cancel training';
  public confirmClicked = false;
  public cancelClicked = false;
  public isForViewAndSubmitDisabled: boolean = false;
  public isForEdit: any = false;
  public minutesGap = 5;
  public durationHours: any;
  public durationMinutes: any;
  public finalTimeInMInutes: any;
  public finalDuration: any;
  public selectedStartDate: any;
  public selectedEndDate: any;
  public employeeList: any = [];
  public now = new Date();
  public toggleLoader: boolean = false;
  public weekOffDays: number = 0;

  public validationText: string = '';
  public branchDetailsList: any = [];
  public departmentMasterList: any = [];
  public gradeList: any = [];
  public designationList: any = [];
  public costCenterMasterList: any = [];
  public projectMasterList: any = [];
  public categoryMasterList: any = [];
  public bankMasterList: any = [];
  public selectedItems: any = [];
  public selectedItemsBranch: any = [];
  public selectedItemsGrade: any = [];
  public selectedItemsDepartment: any = [];
  public selectedItemsDesignation: any = [];
  public selectedItemsCostCenter: any = [];
  public selectedItemsProject: any = [];
  public selectedItemsCategory: any = [];
  public selectedItemsBank: any = [];
  public searchValue: any = '';
  public isBatchNameDuplicate: boolean = false;
  public tempBatchName = '';

  //pagination
  public p1: number = 1;
  public itemsPerPage1: any = 10;
  public totalItems1: any;
  public currentPage1: any;
  public totalElements1: number = 0;
  public showingFrom1: number = 0;
  public showingTo1: number = 0;
  public pageNumber1: Number = 0;

  //pagination
  public p2: number = 1;
  public itemsPerPage2: any = 10;
  public totalItems2: any;
  public currentPage2: any;
  public totalElements2: number = 0;
  public showingFrom2: number = 0;
  public showingTo2: number = 0;
  public pageNumber2: Number = 0;

  public dropdownSettingsBranch = {
    singleSelection: false,
    idField: 'companyBranchDetailsId',
    textField: 'branchName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: false,
  };

  public dropdownSettingsGrade = {
    singleSelection: false,
    idField: 'gradeId',
    textField: 'gradeName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: false,
  };
  public dropdownSettingsDepartment = {
    singleSelection: false,
    idField: 'departmentId',
    textField: 'departmentName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: false,
  };
  public dropdownSettingsDesignation = {
    singleSelection: false,
    idField: 'designationId',
    textField: 'designationName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: false,
  };
  public dropdownSettingsCostCenter = {
    singleSelection: false,
    idField: 'costCenterId',
    textField: 'costCenterName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: false,
  };
  public dropdownSettingsProject = {
    singleSelection: false,
    idField: 'projectId',
    textField: 'projectName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: false,
  };
  public dropdownSettingsCategory = {
    singleSelection: false,
    idField: 'categoryId',
    textField: 'categoryName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: false,
  };
  public dropdownSettingsBank = {
    singleSelection: false,
    idField: 'bankId',
    textField: 'bankName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: false,
  };

  public trainingsForm = this.formBuilder.group({
    trainer: [null, Validators.required],
    technology: [null, Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    startTime: ['', Validators.required],
    endTime: ['', Validators.required],
    totalTrainingHours: [''],
    batchName: ['', Validators.required]
  })

  public trainingsRequestForm = this.formBuilder.group({

    technology: [null, Validators.required],
    requestStatus: [null],
    noOfAttendees: ['']
  })

  get form_() { return this.trainingsForm.controls; };

  get _form() { return this.trainingsForm.value };

  get rform_() { return this.trainingsRequestForm.controls; };

  get _rform() { return this.trainingsRequestForm.value };

  ngOnInit(): void {
    this.getRequests();
    this.getTrainingList();
    this.getWeekOffDays();
  }
  getWeekOffDays() {
    let api = this.api + '/getWeekOffDays?companyId=' + this.companyId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.weekOffDays = data.data;
    },
      (error) => {
        console.log(error);
      })
  }

  getTrainingList() {
    this.spinner.show();
    let api = this.api + '/list/' + this.companyId + '?page=' + this.pageNumber2 + '&size=10';;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.trainingList = data.data.content;
      //pagination call
      this.handlePagination2(data);
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }

  handlePagination2(data: any) {
    this.totalElements2 = data.data.totalElements;
    this.itemsPerPage2 = 10;
    this.currentPage2 = data.data.pageable.pageNumber + 1;
    this.totalItems2 = (data.data.totalPages) * this.itemsPerPage2;
    this.showingFrom2 = (data.data.pageable.pageNumber * this.itemsPerPage2) + 1;
    const to2 = (data.data.pageable.pageNumber + 1) * this.itemsPerPage2;
    if (this.totalElements2 >= to2) {
      this.showingTo2 = to2;
    } else {
      this.showingTo2 = this.totalElements2;
    }
  }
  pageChanged2(event: any) {
    this.pageNumber2 = event - 1;
    this.getTrainingList();
  }

  getRequests() {
    let api1 = this.api + '/getTrainingRequests/' + this.companyId + '?page=' + this.pageNumber1 + '&size=10';
    this.crudOperationsService.getList(api1).subscribe((data: any) => {
      this.spinner.hide();
      this.trainingRequestList = data.data.content;
      //pagination call
      this.handlePagination1(data);
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }
  handlePagination1(data: any) {
    this.totalElements1 = data.data.totalElements;
    this.itemsPerPage1 = 10;
    this.currentPage1 = data.data.pageable.pageNumber + 1;
    this.totalItems1 = (data.data.totalPages) * this.itemsPerPage1;
    this.showingFrom1 = (data.data.pageable.pageNumber * this.itemsPerPage1) + 1;
    const to1 = (data.data.pageable.pageNumber + 1) * this.itemsPerPage1;
    if (this.totalElements1 >= to1) {
      this.showingTo1 = to1;
    } else {
      this.showingTo1 = this.totalElements1;
    }
  }
  pageChanged1(event: any) {
    this.pageNumber1 = event - 1;
    this.getRequests();
  }

  ngAfterViewInit(): void {
    this.getAllEmployees();
    this.getAllTechnologies();
    this.fetchBranchDetailsList();
    this.fetchGradeList();
    this.fetchDepartmentList();
    this.fetchDesignationList();
    this.fetchCostCenterList();
    this.fetchProjectList();
    this.fetchCategoryList();
    this.fetchBankList();
    this.applyFilter();
  }
  fetchBranchDetailsList() {
    return this.employeMasterService.getBranchMaster(this.companyId)
      .subscribe((data: any) => {
        this.branchDetailsList = data.data.content;
        console.log(this.branchDetailsList);
      })
  }

  fetchGradeList() {
    this.employeMasterService.getGradeMasterList(this.companyId)
      .subscribe((data: any) => {
        this.gradeList = data.data.content;
        console.log(this.gradeList);
      })
  }

  fetchDepartmentList() {
    return this.employeMasterService.getDepartmentList(this.companyId)
      .subscribe((data: any) => {
        this.departmentMasterList = data.data.content;
      })
  }

  fetchDesignationList() {
    this.employeMasterService.getDesignationList(this.companyId)
      .subscribe((data: any) => {
        this.designationList = data.data.content;
      })
  }

  fetchCostCenterList() {
    this.employeMasterService.getCostCenterMasterList(this.companyId)
      .subscribe((data: any) => {
        this.costCenterMasterList = data.data.content;
      })
  }

  fetchProjectList() {
    this.employeMasterService.getProjectMasterList(this.companyId)
      .subscribe((data: any) => {
        this.projectMasterList = data.data.content;
      })
  }

  fetchCategoryList() {
    this.employeMasterService.getCategoryMasterList(this.companyId)
      .subscribe((data: any) => {
        this.categoryMasterList = data.data.content;
      })
  }

  fetchBankList() {
    this.employeMasterService.getBankMasterList(this.companyId)
      .subscribe((data: any) => {
        this.bankMasterList = data.data.content;
      })
  }

  onItemSelectBranch(data: any) { }
  onItemSelectGrade(data: any) { }
  onItemSelectDepartment(data: any) { }
  onItemSelectDesignation(data: any) { }
  onItemSelectCostCenter(data: any) { }
  onItemSelectProject(data: any) { }
  onItemSelectCategory(data: any) { }
  onItemSelectBank(data: any) { }

  onSelectAllBranch(event: any) { }
  onSelectAllGrade(event: any) { }
  onSelectAllDepartment(event: any) { }
  onSelectAllDesignation(event: any) { }
  onSelectAllCostCenter(event: any) { }
  onSelectAllProject(event: any) { }
  onSelectAllCategory(event: any) { }
  onSelectAllBank(event: any) { }

  applyFilter() {
    var filterJson = {
      'selectedItemsBranch': this.selectedItemsBranch,
      'selectedItemsGrade': this.selectedItemsGrade,
      'selectedItemsDepartment': this.selectedItemsDepartment,
      'selectedItemsDesignation': this.selectedItemsDesignation,
      'selectedItemsCostCenter': this.selectedItemsCostCenter,
      'selectedItemsProject': this.selectedItemsProject,
      'selectedItemsCategory': this.selectedItemsCategory,
      'selectedItemsBank': this.selectedItemsBank,
      'companyId': Number(sessionStorage.getItem('companyId')),
      'search': this.searchValue
    }
    this.employeeService.getEmployeesByFilter(filterJson)
      .subscribe((data: any) => {
        this.employeeList = data.data;
        this.employeeList.map(function (obj: any) {
          obj.selected = false;
        })
        console.log(this.employeeList);
      })
  }

  resetFilter() {
    this.selectedItemsBranch = [];
    this.selectedItemsGrade = [];
    this.selectedItemsDepartment = [];
    this.selectedItemsDesignation = [];
    this.selectedItemsCostCenter = [];
    this.selectedItemsProject = [];
    this.selectedItemsCategory = [];
    this.selectedItemsBank = [];
    this.searchValue = '';
    this.validationText = '';
    this.applyFilter();
  }

  getAllTechnologies() {
    let listApi = 'technologymaster/dropdownList?companyId=' + this.companyId;
    this.crudOperationsService.getList(listApi)
      .subscribe((data: any) => {
        this.technologies = data.data;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
        })

  }

  getAllEmployees() {
    let listApi = `employee/emp_list_company/${this.companyId}`;
    this.crudOperationsService.getList(listApi)
      .subscribe((data: any) => {
        this.employeeList = data.data.content;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
        })
  }

  getTrainersList(id: any) {
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

  fetchTrainees(ids: any) {
    this.spinner.show();
    let filteredIds = [];
    for (let i = 0; i < ids.length; i++) {
      filteredIds.push(ids[i].employeeId);
    }
    let api = this.api + '/getEmployeesByIds?ids=' + filteredIds;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.traineesList = data.data;
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }

  modelShow() {
    this.isForEdit = false;
    this.clearRequest();
  }

  modelShowView(data: any) {
    this.loadFormData(data, true);
  }
  modelShowRequestView(data: any) {
    this.loadRequestFormData(data, true);
    this.loadRequestFormData(data, true);
  }

  loadRequestFormData(data: any, isForView: boolean) {
    this.trainingsRequestForm.reset();
    this.rform_['technology'].patchValue(data.techId);
    this.rform_['requestStatus'].patchValue(data.requestStatus);
    this.rform_['noOfAttendees'].patchValue(data.noOfAttendees);

    (<any>$('#addRequestPopup')).modal('show');
  }

  loadFormData(data: any, isForView: boolean) {
    this.trainingsForm.reset();
    this.form_['technology'].patchValue(data.techId);
    // this.form_['requestStatus'].patchValue(data.requestStatus);
    // this.form_['noOfAttendees'].patchValue(data.noOfAttendees);

    this.form_['startDate'].patchValue(new Date(data.startDate));
    this.form_['endDate'].patchValue(new Date(data.endDate));
    this.form_['startTime'].patchValue(data.startTime);
    this.form_['endTime'].patchValue(data.endTime);
    this.form_['totalTrainingHours'].patchValue(data.totalTrainingHours);
    this.form_['batchName'].patchValue(data.batchName);
    this.selectedStartDate = new Date(data.startDate);
    this.selectedEndDate = new Date(data.endDate);
    let api = 'manage-trainers/dropdownList?id=' + data.techId;
    this.crudOperationsService.getList(api).subscribe((res: any) => {
      this.trainersList = res.data;
      this.form_['trainer'].patchValue(data.trainId);
    })
    if (isForView) {
      this.isForViewAndSubmitDisabled = true;
    } else {
      this.isForViewAndSubmitDisabled = false;
      if (data.traineesIds != null) {
        for (let i = 0; i < data.traineesIds.length; i++) {
          let result = this.employeeList.find((e: any) => e.employeeId == data.traineesIds[i].employeeId);
          if (result) {
            result.selected = true;
          }
        }
      }
    }
    (<any>$('#addPopup')).modal('show');
  }

  modelShowSchedule(data: any) {
    this.submitted = false;
    this.submitText = 'Update';
    this.id = data.manageTrainingId;
    this.trainingsForm.reset();
    this.form_['technology'].patchValue(data.techId);
    this.isForEdit = true;
    this.getTrainersList(data.techId);
    (<any>$('#addPopup')).modal('show');
  }

  modelShowEdit(data: any) {
    this.submitted = false;
    this.submitText = 'Update';
    this.id = data.manageTrainingId;
    this.loadFormData(data, false);
    this.isForEdit = true;
    // this.loadFormData(data, false);
  }

  modelShowRequestEdit(data: any) {
    this.submitted = false;
    this.submitText = 'Update';
    this.id = data.manageTrainingId;
    this.loadRequestFormData(data, false);
    this.isForEdit = true;
    this.loadRequestFormData(data, false);
  }

  submit() {
    this.submitted = true;
    for (let el in this.form_) {
      if (this.form_[el].errors) {
        console.log(el)
      }
    }
    let employeeIdList: any = [];
    const eItems = this.employeeList.filter((item: any) => item.selected === true);
    if (eItems.length > 0 && !this.isBatchNameDuplicate) {
      for (let i = 0; i < this.employeeList.length; i++) {
        if (this.employeeList[i].selected) {
          let obj = { 'employeeId': this.employeeList[i].employeeId, 'isFeedbackSent': false };
          employeeIdList.push(obj);
        }
      }

      if (this.trainingsForm.valid) {
        let formData = this.getFormData(employeeIdList);
        if (this.submitText !== 'Update') {
          this.save(formData, this.api);
        } else {
          this.update(formData, this.api + `/${this.id}`);
        }
      }
    } else {
      this.validationText = 'Please select atlease 1 employee(s).';
    }
  }

  submitRequest() {
    this.submitted = true;

    // if (this.trainingsForm.valid) {
    let formData = this.getRequestFormData();
    if (this.submitText !== 'Update') {
      this.save(formData, this.api);
    } else {
      this.update(formData, this.api + '/updateRequest' + `/${this.id}`);
    }
    // }

  }

  update(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.update(formData, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        (<any>$('#addPopup')).modal('hide');
        (<any>$('#addRequestPopup')).modal('hide');
        this.submitProcessing = false;
        this.ngOnInit();
        this.clear();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }
  save(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.create(formData, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        (<any>$('#addPopup')).modal('hide');
        (<any>$('#addRequestPopup')).modal('hide');
        this.submitProcessing = false;
        this.ngOnInit();
        this.clear();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }
  getFormData(employeeIdList: any): any {

    let technologyId = {
      'technologyId': Number(this._form.technology)
    }
    let trainerId = {
      'trainerId': Number(this._form.trainer)
    }
    let trainees = {
      'employeeIds': employeeIdList
    }
    let object = {
      "startDate": this.selectedStartDate,
      "endDate": this.selectedEndDate,
      'startTime': this._form.startTime,
      'endTime': this._form.endTime,
      'requestStatus': this._form.requestStatus,
      'noOfAttendees': this._form.noOfAttendees,
      'totalTrainingHours': this._form.totalTrainingHours,
      'company': {
        'companyId': this.companyId
      },
      'technologyId': technologyId,
      'trainerId': trainerId,
      'traineesIds': employeeIdList,
      'batchName': this._form.batchName
    };
    return object;
  }

  getRequestFormData(): any {

    let technologyId = {
      'technologyId': Number(this._rform.technology)
    }
    // let trainerId = {
    //   'trainerId': ''
    // }

    let object = {

      'requestStatus': this._rform.requestStatus,
      'noOfAttendees': this._rform.noOfAttendees,

      'company': {
        'companyId': this.companyId
      },
      'technologyId': technologyId
      //'trainerId': trainerId,

    };
    return object;
  }

  clear() {
    this.submitted = false;
    this.isForViewAndSubmitDisabled = false;
    this.trainingsForm.reset();
    this.tempBatchName = '';
    this.id = undefined;
    this.submitText = 'Create';
    this.finalDuration = 0;
    this.employeeList.forEach((item: any) => item.selected = false);
    this.resetFilter();
  }

  clearRequest() {
    this.submitted = false;
    this.trainingsRequestForm.reset();
    this.id = undefined;
    this.submitText = 'Create';
  }

  delete(id: number) {
    this.crudOperationsService.delete(this.api + `/${id}`).subscribe((data: any) => {
      this.notification.notify('success', data.message);
      this.ngOnInit();
    }, (error) => { this.notification.notify('error', 'something went wrong') })
  }

  startTimeChange(event: any) {
    if (this._form.endTime != null) {
      this.calculateHours(event, this._form.endTime);
    }
  }

  endTimeChange(event: any) {
    if (this._form.startTime != null) {
      this.calculateHours(this._form.startTime, event);
    }
  }

  public totalWorkingDays: any;
  onStartDateValueChange(event: any) {
    if (event) {
      this.selectedStartDate = new Date(event);
      if (this.selectedStartDate && this.selectedEndDate) {
        this.totalWorkingDays = this.getBusinessDatesCount(this.selectedStartDate, this.selectedEndDate)
        console.log(this.totalWorkingDays)
        if (this._form.startTime && this._form.endTime)
          this.calculateHours(this._form.startTime, this._form.endTime);
      }
    }
  }

  onEndDateValueChange(event: any) {
    if (event) {
      this.selectedEndDate = new Date(event);
      if (this.selectedStartDate && this.selectedEndDate) {
        this.totalWorkingDays = this.getBusinessDatesCount(this.selectedStartDate, this.selectedEndDate)
        console.log(this.totalWorkingDays)
        if (this._form.startTime && this._form.endTime)
          this.calculateHours(this._form.startTime, this._form.endTime);
      }
    }
  }
  calculateHours(startTime: any, endTime: any) {
    let startTimeHourAndMinutes = startTime.split(' ')[0];
    let startTimeFormat = startTime.split(' ')[1];
    let endTimeHourAndMinutes = endTime.split(' ')[0];
    let endTimeFormat = endTime.split(' ')[1];

    let startTimeHour = Number(startTimeHourAndMinutes.split(':')[0]);
    let startTimeMinutes = Number(startTimeHourAndMinutes.split(':')[1]);
    let endTimeHour = Number(endTimeHourAndMinutes.split(':')[0]);
    let endTimeMinutes = Number(endTimeHourAndMinutes.split(':')[1]);

    if (startTimeHour != 12 && startTimeFormat == 'PM') {
      startTimeHour = startTimeHour + 12;
    }
    if (endTimeHour != 12 && endTimeFormat == 'PM') {
      endTimeHour = endTimeHour + 12;
    }
    if (endTimeHour == 12 && endTimeFormat == 'AM') {
      endTimeHour = 0;
    }
    if (endTimeHour != 12 && endTimeFormat == 'AM') {
      endTimeHour = endTimeHour;
    }

    let durationHours = 0;
    if (endTimeHour > startTimeHour) {
      durationHours = endTimeHour - startTimeHour;
    } else if ((startTimeFormat == endTimeFormat) && ((endTimeHour < startTimeHour) || endTime == 12)) {
      durationHours = Number((24 - startTimeHour) + endTimeHour);
    } else if ((startTimeFormat == endTimeFormat) && endTimeHour < startTimeHour) {
      durationHours = startTimeHour - endTimeHour;
    } else {
      durationHours = Number((24 - startTimeHour) + endTimeHour);
    }

    durationHours = durationHours == 24 ? 0 : durationHours;
    let durationMinutes = Number((60 - startTimeMinutes) + (endTimeMinutes)) % 60;
    let totalHours = durationHours * this.totalWorkingDays;
    let totalMinutes = durationMinutes * this.totalWorkingDays;

    let hour = Math.floor(totalMinutes / 60); //return hour
    let minutes = totalMinutes - (hour * 60); //return minutes

    let additionalValue = '';
    if (minutes > 0) {
      additionalValue = '.' + minutes;
    }
    this.finalDuration = (totalHours + hour) + additionalValue;
    this.form_['totalTrainingHours'].patchValue(this.finalDuration);
  }

  onClickCheckBox(id: any) {
    this.validationText = '';
    const i = this.employeeList.findIndex((obj: any) => obj.employeeId == id);
    this.employeeList[i].selected = !this.employeeList[i].selected;
  }

  selectAll(event: any) {
    const checked = event.target.checked;
    this.validationText = '';
    this.employeeList.forEach((item: any) => item.selected = checked);
  }

  public getBusinessDatesCount = (startDate: any, endDate: any) => {
    let count = 0;
    let curDate = +startDate;
    while (curDate <= +endDate) {
      const dayOfWeek = new Date(curDate).getDay();
      const isWeekend = (this.checkWeekDays(dayOfWeek));
      if (!isWeekend) {
        count++;
      }
      curDate = curDate + 24 * 60 * 60 * 1000
    }
    return count;
  }

  checkWeekDays(dayOfWeek: number): boolean {
    if (this.weekOffDays == 1) {
      return dayOfWeek === 0;
    } else if (this.weekOffDays == 2) {
      return dayOfWeek === 6 || dayOfWeek === 0;
    } else if (this.weekOffDays == 3) {
      return dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0;
    } else {
      return dayOfWeek === 4 || dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0;
    }
  }

  public checkBatchName(): void {
    if (this.isForEdit && this.tempBatchName != this._form.batchName) {
      this.checkDuplicateBatchName();
    }
    if (!this.isForEdit) {
      this.checkDuplicateBatchName();
    }
  }
  public checkDuplicateBatchName(): void {
    this.isBatchNameDuplicate = false;
    let api = this.api + '/validate?batchName=' + this._form.batchName;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      if (data.data > 0) {
        this.isBatchNameDuplicate = true;
      } else {
        this.isBatchNameDuplicate = false;
      }
    },
      (error) => {
        console.log(error);
      })
  }

}
