import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { AddEmployeeService } from '../../master/addEmplyee.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';

@Component({
  selector: 'app-manage-attandence',
  templateUrl: './manage-attandence.component.html',
  styleUrls: ['./manage-attandence.component.css']
})
export class ManageAttandenceComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService,
    public crudOperationsService: CrudOperationsService, private notification: NotifierService,
    public datePipe: DatePipe, private employeeService: AddEmployeeService, private employeMasterService: EmployeeMastersService) { }

  public headers: any = ['Technology', 'Trainer Name', 'Training Start Date', 'Training End Date', 'Training Start Time', 'Training End Time', 'Total training hours', 'Take Attandence', 'Actions'];
  public technologies: any = [];
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public employeeId: any = Number(sessionStorage.getItem('empId'));
  public trainersList: any = [];
  public attandenceList: any = [];
  public statusList: any = ['Open','Approved','Scheduled'];
  public trainingList: any = [];
  public traineesList: any = [];
  public dates: any = [];
  public type: any = '';
  public id: any = '';
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public submitText = '';
  public api = 'manage-training'
  public submitProcessing = false;
  public employeeDetails: any = {};
  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
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
    totalTrainingHours: ['']
  })

  get form_() { return this.trainingsForm.controls; };

  get _form() { return this.trainingsForm.value };

  ngOnInit(): void {
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
    this.crudOperationsService.getList(this.api + '/list/' + this.companyId).subscribe((data: any) => {
      this.spinner.hide();
      this.trainingList = data.data.content;
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })
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

  fetchTrainees(ids: any,startDate: any,endDate: any,manageTrainingId:any,data:any) {
    console.log("data i ============",data);
    this.attandenceList = data.attandence;
    this.id = manageTrainingId;
    this.dates =[];
   // this.loadFormData(data, true);

      this.submitText = 'Update';
    
    this.spinner.show();
    let filteredIds = [];
    for (let i = 0; i < ids.length; i++) {
      filteredIds.push(ids[i].employeeId);
    }
    let api = this.api + '/getEmployeesByIds?ids=' + filteredIds;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.traineesList = data.data;
      this.employeeList = data.data;
    },
      (error) => {
        this.spinner.hide();
        console.log(error);
      })

      // const date = new Date(new Date(startDate).getTime());
     // console.log("startdate is===== ",date);
     // console.log("startdate is===== ",new Date(endDate));
      // while (date <= new Date(endDate)) {
      //   this.dates.push(new Date(date.setDate(date.getDate() + 1)));
      //   date.setDate(date.getDate() + 1);
      // }
      //console.log("dates is =========== ",this.dates);  

      this.getBusinessDates(new Date(startDate), new Date(endDate));
  }

  modelShow() {
    this.isForEdit = false;
    this.clear();
  }

  modelShowView(data: any) {
    this.loadFormData(data, true);
    this.loadFormData(data, true);
  }
  loadFormData(data: any, isForView: boolean) {
    this.trainingsForm.reset();
    this.trainingsForm.enable();
    this.form_['technology'].patchValue(data.techId);
    this.form_['startDate'].patchValue(new Date(data.startDate));
    this.form_['endDate'].patchValue(new Date(data.endDate));
    this.form_['startTime'].patchValue(data.startTime);
    this.form_['endTime'].patchValue(data.endTime);
    this.form_['totalTrainingHours'].patchValue(data.totalTrainingHours);
    let api = 'manage-trainers/dropdownList?id=' + data.techId;
    this.crudOperationsService.getList(api).subscribe((res: any) => {
      this.trainersList = res.data;
      this.form_['trainer'].patchValue(data.trainId);
    })
    for (let i = 0; i < data.traineesIds.length; i++) {
      let result = this.employeeList.find((e: any) => e.employeeId == data.traineesIds[i]);
      if (result) {
        result.selected = true;
      }
    }
    if (isForView) {
      this.isForViewAndSubmitDisabled = true;
      this.trainingsForm.disable();
    } else {
      this.isForViewAndSubmitDisabled = false;
    }
    (<any>$('#addPopup')).modal('show');
  }

  modelShowEdit(data: any) {
    this.submitted = false;
    this.submitText = 'Update';
    this.id = data.manageTrainingId;
    this.loadFormData(data, false);
    this.isForEdit = true;
    this.loadFormData(data, false);
  }

  submit() {
    this.submitted = true;
    for (let el in this.form_) {
      if (this.form_[el].errors) {
        console.log(el)
      }
    }
    let employeeIdList: any = [];
    let attandenceList: any = [];
    const eItems = this.employeeList.filter((item: any) => item.selected === true);
    if (eItems.length > 0) {
     
      for (let i = 0; i < this.employeeList.length; i++) {
        console.log("employee details ======== ",this.employeeList[i]);
        if (this.employeeList[i].selected) {
          for(let k=0; k <= this.dates.length; k++){
            let obj1 = { 'employeeId': this.employeeList[i].employeeId, 'date': this.dates[k], 'selected': true };
            attandenceList.push(obj1);
          }
        }
      }

      // if (this.trainingsForm.valid) {
        let formData = this.getFormData(employeeIdList,attandenceList);
        if (this.submitText !== 'Update') {
          this.save(formData, this.api);
        } else {
          this.update(formData, this.api+'/updateAttandence' + `/${this.id}`);
        }
     // }
    } else {
      
      this.validationText = 'Please select atlease 1 employee(s).';
    }
  }
  update(formData: any, api: string) {
    this.submitProcessing = true;
    this.crudOperationsService.update(formData, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        (<any>$('#show_trainees')).modal('hide');
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
        this.submitProcessing = false;
        this.ngOnInit();
        this.clear();
      },
        (_error) => {
          this.submitProcessing = false;
          this.notification.notify('error', 'Something Went Wrong')
        })
  }
  getFormData(employeeIdList: any,attandenceList: any): any {
    
    let object = {
      'attandence': attandenceList
    };
    return object;
  }

  clear() {
    this.submitted = false;
    this.isForViewAndSubmitDisabled = false;
    this.trainingsForm.reset();
    this.id = undefined;
    this.submitText = 'Create';
    this.finalDuration = 0;
    this.employeeList.forEach((item: any) => item.selected = false);
    this.resetFilter();
  }

  delete(id: number) {
    this.crudOperationsService.delete(this.api + `/${id}`).subscribe((data: any) => {
      this.notification.notify('success', data.message);
      this.ngOnInit();
    }, (error) => { this.notification.notify('error', 'something went wrong') })
  }

  timeChange1(event: any) {
    if (this._form.endTime != null) {
      let time2 = this._form.endTime;
      let endTImeHours = Number(time2.slice(0, time2.lastIndexOf(':')));
      let endTImeminutes = Number(time2.slice(time2.lastIndexOf(':') + 1, time2.lastIndexOf(':') + 3))
      let endTImeformat = time2.slice(time2.lastIndexOf('M') - 1, time2.lastIndexOf('M') + 1)
      if (endTImeformat == 'PM') {
        endTImeHours += 12;
      }

      let time1 = event;
      let startTImeHours = Number(time1.slice(0, time1.lastIndexOf(':')));
      let startTImeminutes = Number(time1.slice(time1.lastIndexOf(':') + 1, time1.lastIndexOf(':') + 3))
      let startTImeformat = time1.slice(time1.lastIndexOf('M') - 1, time1.lastIndexOf('M') + 1);
      if (startTImeformat == 'PM') {
        startTImeHours += 12;
      }
      if (endTImeHours > startTImeHours) {
        this.durationHours = endTImeHours - startTImeHours;
      } else {
        this.durationHours = Number(24 - startTImeHours + endTImeHours);
      }
      this.durationMinutes = Number((60 - startTImeminutes) + (endTImeminutes));
      if (this.durationHours > 1) {
        this.durationMinutes = (Number((60 - startTImeminutes) + (endTImeminutes)) % 60);
        if (this.durationMinutes < 10) {
          if (this.durationHours < 10) {
            this._form.totalTrainingHours = '0' + String(this.durationHours) + ':0' + String(this.durationMinutes);
          } else {
            this._form.totalTrainingHours = String(this.durationHours) + ':0' + String(this.durationMinutes);
          }
        } else {
          if (this.durationHours < 10) {
            this._form.totalTrainingHours = '0' + String(this.durationHours) + ':' + String(this.durationMinutes);
          } else {
            this._form.totalTrainingHours = String(this.durationHours) + ':' + String(this.durationMinutes);
          }
        }
      } else {
        if (this.durationMinutes > 60) {
          this.durationMinutes = Number(((60 - startTImeminutes) + (endTImeminutes)) % 60);
          if (this.durationMinutes < 10) {
            this._form.totalTrainingHours = '01:0' + String(this.durationMinutes);
          } else {
            this._form.totalTrainingHours = '01:' + String(this.durationMinutes);
          }
        } else if (this.durationMinutes = 60) {

          this._form.totalTrainingHours = '01:00';
        } else {
          if (this.durationMinutes < 10) {
            this._form.totalTrainingHours = '00:' + String(this.durationMinutes);
          } else {
            this._form.totalTrainingHours = '00:' + String(this.durationMinutes);
          }
        }
      }
      this.setTotalTrainingHours();
    }
  }

  setTotalTrainingHours() {
    let finalDuration = this._form.totalTrainingHours;
    let lhs = finalDuration.split(":")[0];
    if (lhs == 24) {
      lhs = 0;
    }
    let rhs = finalDuration.split(":")[1];
    let result = rhs * this.totalWorkingDays;
    var hour = Math.floor(result / 60); //1h
    var minutes = result - (hour * 60); //30m
    lhs = Math.abs(lhs);
    let additionalValue = '';
    if (minutes > 0) {
      additionalValue = '.' + minutes;
    }
    this.finalDuration = ((Number(lhs) * this.totalWorkingDays) + hour) + additionalValue;
    this.form_['totalTrainingHours'].patchValue(this.finalDuration);
  }

  timeChange2(event: any) {
    if (this._form.startTime != null) {
      let time2 = this._form.startTime;
      let startTImeHours = Number(time2.slice(0, time2.lastIndexOf(':')));
      let startTImeminutes = Number(time2.slice(time2.lastIndexOf(':') + 1, time2.lastIndexOf(':') + 3))
      let startTImeformat = time2.slice(time2.lastIndexOf('M') - 1, time2.lastIndexOf('M') + 1)
      if (startTImeformat == 'PM') {
        startTImeHours += 12;
      }

      let time1 = event;
      let endTImeHours = Number(time1.slice(0, time1.lastIndexOf(':')));
      let endTImeminutes = Number(time1.slice(time1.lastIndexOf(':') + 1, time1.lastIndexOf(':') + 3))
      let endTImeformat = time1.slice(time1.lastIndexOf('M') - 1, time1.lastIndexOf('M') + 1);
      if (endTImeformat == 'PM') {
        endTImeHours += 12;
      }
      if (endTImeHours > startTImeHours) {
        this.durationHours = endTImeHours - startTImeHours;
      } else {
        this.durationHours = Number(24 - startTImeHours + endTImeHours);
      }
      this.durationMinutes = Number((60 - startTImeminutes) + (endTImeminutes));
      if (this.durationHours > 1) {
        this.durationMinutes = (Number((60 - startTImeminutes) + (endTImeminutes)) % 60);
        if (this.durationMinutes < 10) {
          if (this.durationHours < 10) {
            this._form.totalTrainingHours = '0' + String(this.durationHours) + ':0' + String(this.durationMinutes);
          } else {
            this._form.totalTrainingHours = String(this.durationHours) + ':0' + String(this.durationMinutes);
          }
        } else {
          if (this.durationHours < 10) {
            this._form.totalTrainingHours = '0' + String(this.durationHours) + ':' + String(this.durationMinutes);
          } else {
            this._form.totalTrainingHours = String(this.durationHours) + ':' + String(this.durationMinutes);
          }
        }
      } else {
        if (this.durationMinutes > 60) {
          this.durationMinutes = Number(((60 - startTImeminutes) + (endTImeminutes)) % 60);
          if (this.durationMinutes < 10) {
            this._form.totalTrainingHours = '01:0' + String(this.durationMinutes);
          } else {
            this._form.totalTrainingHours = '01:' + String(this.durationMinutes);
          }
        } else if (this.durationMinutes = 60) {
          this._form.totalTrainingHours = '01:00';
        } else {
          if (this.durationMinutes < 10) {
            this._form.totalTrainingHours = '00:' + String(this.durationMinutes);
          } else {
            this._form.totalTrainingHours = '00:' + String(this.durationMinutes);
          }
        }
      }
      this.setTotalTrainingHours();
    }
  }

  public totalWorkingDays: any;
  onStartDateValueChange(event: any) {
    this.selectedStartDate = new Date(event);
    if (this.selectedStartDate && this.selectedEndDate) {
      this.totalWorkingDays = this.getBusinessDates(this.selectedStartDate, this.selectedEndDate)
      console.log(this.totalWorkingDays)
      if (this._form.startTime && this._form.endTime)
        this.timeChange3();
    }
  }

  onEndDateValueChange(event: any) {
    this.selectedEndDate = new Date(event);
    if (this.selectedStartDate && this.selectedEndDate) {
      this.totalWorkingDays = this.getBusinessDates(this.selectedStartDate, this.selectedEndDate)
      console.log(this.totalWorkingDays)
      if (this._form.startTime && this._form.endTime)
        this.timeChange3();
    }
  }

  timeChange3() {
    let time2 = this._form.endTime;
    let endTImeHours = Number(time2.slice(0, time2.lastIndexOf(':')));
    let endTImeminutes = Number(time2.slice(time2.lastIndexOf(':') + 1, time2.lastIndexOf(':') + 3))
    let endTImeformat = time2.slice(time2.lastIndexOf('M') - 1, time2.lastIndexOf('M') + 1)
    if (endTImeformat == 'PM') {
      endTImeHours += 12;
    }

    let time1 = this._form.startTime;
    let startTImeHours = Number(time1.slice(0, time1.lastIndexOf(':')));
    let startTImeminutes = Number(time1.slice(time1.lastIndexOf(':') + 1, time1.lastIndexOf(':') + 3))
    let startTImeformat = time1.slice(time1.lastIndexOf('M') - 1, time1.lastIndexOf('M') + 1);
    if (startTImeformat == 'PM') {
      startTImeHours += 12;
    }
    if (endTImeHours > startTImeHours) {
      this.durationHours = endTImeHours - startTImeHours;
    } else {
      this.durationHours = Number(24 - startTImeHours + endTImeHours);
    }
    this.durationMinutes = Number((60 - startTImeminutes) + (endTImeminutes));
    if (this.durationHours > 1) {
      this.durationMinutes = (Number((60 - startTImeminutes) + (endTImeminutes)) % 60);
      if (this.durationMinutes < 10) {
        if (this.durationHours < 10) {
          this._form.totalTrainingHours = '0' + String(this.durationHours) + ':0' + String(this.durationMinutes);
        } else {
          this._form.totalTrainingHours = String(this.durationHours) + ':0' + String(this.durationMinutes);
        }
      } else {
        if (this.durationHours < 10) {
          this._form.totalTrainingHours = '0' + String(this.durationHours) + ':' + String(this.durationMinutes);
        } else {
          this._form.totalTrainingHours = String(this.durationHours) + ':' + String(this.durationMinutes);
        }
      }
    } else {
      if (this.durationMinutes > 60) {
        this.durationMinutes = Number(((60 - startTImeminutes) + (endTImeminutes)) % 60);
        if (this.durationMinutes < 10) {
          this._form.totalTrainingHours = '01:0' + String(this.durationMinutes);
        } else {
          this._form.totalTrainingHours = '01:' + String(this.durationMinutes);
        }
      } else if (this.durationMinutes = 60) {

        this._form.totalTrainingHours = '01:00';
      } else {
        if (this.durationMinutes < 10) {
          this._form.totalTrainingHours = '00:' + String(this.durationMinutes);
        } else {
          this._form.totalTrainingHours = '00:' + String(this.durationMinutes);
        }
      }
    }
    this.setTotalTrainingHours();
  }

  onClickCheckBox(id: any, date: any) {
    this.validationText = '';
    const i = this.employeeList.findIndex((obj: any) => obj.employeeId == id);
    this.employeeList[i].selected = !this.employeeList[i].selected;
  }

  selectAll(event: any) {
    const checked = event.target.checked;
    this.validationText = '';
    this.employeeList.forEach((item: any) => item.selected = checked);
  }

  public getBusinessDates(startDate: any, endDate: any) {
    let curDate = +startDate;
    while (curDate <= +endDate) {
      const dayOfWeek = new Date(curDate).getDay();
      const isWeekend = (this.checkWeekDays(dayOfWeek));
      if (!isWeekend) {
        this.dates.push(new Date(curDate));
      }
      curDate = curDate + 24 * 60 * 60 * 1000
      console.log("dates is =========== ", this.dates);
    }
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

}
