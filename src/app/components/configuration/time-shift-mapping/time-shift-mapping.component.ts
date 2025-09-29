import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';

@Component({
  selector: 'app-time-shift-mapping',
  templateUrl: './time-shift-mapping.component.html',
  styleUrls: ['./time-shift-mapping.component.css']
})
export class TimeShiftMappingComponent implements OnInit {
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public branchList: any = [];
  public shiftList: any = [];
  public departmentList: any = [];
  public departmentListDestination: any = [];
  public projectList!: any[];
  public employeeList: any = [];
  public searchItem: any;
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public searchInput: string = '';
  public toggleLoader: boolean = false;
  public toggleLoaderDestination: boolean = false;
  public companyBranchDetailsId: string = '';
  public departmentId: string = '';
  public projectId: string = '';
  public branchName: string = '';
  public departmentName: string = '';
  public projectName: string = '';
  public companyBranchDetailsIdDestination: string = '';
  public departmentIdDestination: string = '';
  public projectIdDestination: string = '';
  public branchNameDestination: string = '';
  public departmentNameDestination: string = '';
  public projectNameDestination: string = '';
  public sourceEmployeeListFromDB: any = [];
  public destinationEmployeeListFromDB: any = [];
  public destinationEmployeeList: any = [];
  public tempDestinationEmployeeList: any = [];
  public tempSourceEmployeeList: any = [];
  public isFormValuesSame: boolean = false;

  public sourceBranch: any = '';
  public destinationBranch: any = '';
  public sourceDept: any = '';
  public destinationDept: any = '';
  public sourceProject: any = '';
  public destinationProject: any = '';

  public form = this.fb.group({
    branch: ['', Validators.required],
    department: ['', Validators.required],
    project: ['', Validators.required]
  });
  public form1 = this.fb.group({
    branch1: ['', Validators.required],
    department1: ['', Validators.required],
    project1: ['', Validators.required]
  });

  get form_() { return this.form.controls; };
  get form_1() { return this.form1.controls; };

  constructor(private crudOperationsService: CrudOperationsService, public fb: FormBuilder, private spinner: NgxSpinnerService
    , private notification: NotifierService, private employeMasterService: EmployeeMastersService) { }

  ngOnInit(): void {
    this.fetchBranchDetailsList();
    this.fetchShiftListByCompanyId();
    this.fetchProjectList();
  }

  fetchProjectList() {
    this.employeMasterService.getProjectMasterList(this.companyId)
      .subscribe((data: any) => {
        this.projectList = data.data.content;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  fetchBranchDetailsList() {
    this.spinner.show();
    this.employeMasterService.getBranchMaster(this.companyId)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.branchList = data.data.content;
      },
        (_error: any) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Worng');
        })
  }
   //get kpalist
   fetchShiftListByCompanyId() {
   // this.spinner.show();
    let api: any = 'shiftMaster/shiftMaster_search_list/1?search=&page=0&size=20';
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.shiftList = data.data.content;
       // this.spinner.hide();
        //pagination call
       // this.handlePagination(data);
      },
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Wrong');
        })
  }
  changeBranch(model: any) {
    this.companyBranchDetailsId = model.companyBranchDetailsId;
    this.branchName = model.branchName;
    console.log(model.companyBranchDetailsId, 'event.target.value : ' + model.branchName);
    this.fetchDepartmentsByBranch();
  }
  changeDepartment(model: any) {
    this.departmentId = model.departmentId;
    this.departmentName = model.departmentName;
    this.validateFormValues();
  }
  validateFormValues() {
    if (!this.isFormValuesAreSame()) {
      this.isFormValuesSame = false;
      this.search();
    } else {
      this.isFormValuesSame = true;
      this.sourceEmployeeListFromDB.forEach((element: any) => {
        let index = this.employeeList.findIndex(function (emp: any) {
          return emp.employeeId == element.employeeId;
        })
        if (index != -1) {
          this.employeeList.splice(index, 1);
        }
      });
    }
  }
  isFormValuesAreSame() {
    return this.companyBranchDetailsId === this.companyBranchDetailsIdDestination &&
      this.departmentId === this.departmentIdDestination &&
      this.projectId === this.projectIdDestination;
  }
  changeProject(model: any) {
    this.projectId = model.projectId;
    this.projectName = model.projectName;
    this.validateFormValues();
  }
  fetchDepartmentsByBranch() {
    let api: any = 'department/dropdownList_departments/' + this.companyBranchDetailsId;
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.departmentList = data.data;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  search() {
    this.employeeList = [];
    // this.submitted = true;
    this.toggleLoader = true;
    let api: any = 'employee/employee_bench_mapping_list?companyBranchDetailsId=' + this.companyBranchDetailsId
      + '&departmentId=' + this.departmentId + '&projectId=' + this.projectId + '&companyId=' + this.companyId;
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.sourceEmployeeListFromDB = data.data;
        this.toggleLoader = false;
        this.sourceEmployeeListFromDB.map(function (obj: any) {
          obj.selected = false;
        })
        this.tempSourceEmployeeList.forEach((element: any) => {
          this.employeeList.push(element);
        });
        this.sourceEmployeeListFromDB.forEach((element: any) => {
          this.employeeList.push(element);
        });
        console.log('before : ', this.employeeList)
        this.tempDestinationEmployeeList.forEach((element: any) => {
          let index = this.employeeList.findIndex(function (emp: any) {
            return emp.employeeId == element.employeeId;
          })
          if (index != -1) {
            this.employeeList.splice(index, 1);
          }
        });
        console.log('after : ', this.employeeList)
      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
          this.toggleLoader = false;
        })
  }

  addRight() {
    const eItems = this.employeeList.filter((item: any) => item.selected === true);
    if (eItems.length > 0) {
      eItems.forEach((element: any) => {
        this.destinationEmployeeList.push(element);
        this.tempDestinationEmployeeList.push(element);
        if (this.employeeList.indexOf(element) != -1) {
          this.employeeList.splice(this.employeeList.indexOf(element), 1);
          this.destinationEmployeeList.map(function (obj: any) {
            obj.selected = false;
          })
        }
      });
      console.log(this.destinationEmployeeList)
    }

  }

  addLeft() {
    const eItems = this.destinationEmployeeList.filter((item: any) => item.selected === true);
    if (eItems.length > 0) {
      eItems.forEach((element: any) => {
        this.employeeList.push(element);
        this.tempSourceEmployeeList.push(element);
        if (this.destinationEmployeeList.indexOf(element) != -1) {
          this.destinationEmployeeList.splice(this.destinationEmployeeList.indexOf(element), 1);
          this.employeeList.map(function (obj: any) {
            obj.selected = false;
          })
        }
      });
      console.log(this.employeeList)
    }
  }
  clear() {
    this.form_['project'].setValue('');
    this.form_['branch'].setValue('');
    this.form_['department'].setValue('');
  }
  clearDestination() {
    this.form_1['project1'].setValue('');
    this.form_1['branch1'].setValue('');
    this.form_1['department1'].setValue('');
  }
  onClick() {
    this.isFormValuesSame = false;
    this.submitted = false;
    this.clear();
    this.clearDestination();
    this.companyBranchDetailsId = '';
    this.departmentId = '';
    this.projectId = '';
    this.companyBranchDetailsIdDestination = '';
    this.departmentIdDestination = '';
    this.projectIdDestination = '';
    this.departmentList = [];
    this.departmentListDestination = [];
    this.projectList = [];
    this.employeeList = [];
    this.sourceEmployeeListFromDB = [];
    this.destinationEmployeeListFromDB = [];
    this.destinationEmployeeList = [];
    this.tempDestinationEmployeeList = [];
    this.tempSourceEmployeeList = [];
    this.search();
    this.searchDestination();
  }
  onClickCheckBox(id: any) {
    const i = this.employeeList.findIndex((obj: any) => obj.employeeId == id);
    this.employeeList[i].selected = !this.employeeList[i].selected;
  }

  selectAll(event: any) {
    const checked = event.target.checked;
    this.employeeList.forEach((item: any) => item.selected = checked);
  }

  onClickCheckBoxDestination(id: any) {
    const i = this.destinationEmployeeList.findIndex((obj: any) => obj.employeeId == id);
    this.destinationEmployeeList[i].selected = !this.destinationEmployeeList[i].selected;
  }

  selectAllDestination(event: any) {
    const checked = event.target.checked;
    this.destinationEmployeeList.forEach((item: any) => item.selected = checked);
  }

  changeBranchDestination(model: any) {
    this.companyBranchDetailsIdDestination = model.shiftId;
    this.branchNameDestination = model.name;
    //this.fetchDepartmentsByBranchDestination();
  }
  fetchDepartmentsByBranchDestination() {
    let api: any = 'department/dropdownList_departments/' + this.companyBranchDetailsIdDestination;
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.departmentListDestination = data.data;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  changeDepartmentDestination(model: any) {
    //this.departmentIdDestination = model;
    this.departmentNameDestination = model;
    //this.validateFormValuesDestination();
  }
  changeProjectDestination(model: any) {
    this.projectIdDestination = model.projectId;
    this.projectNameDestination = model.projectName;
    this.validateFormValuesDestination();
  }
  validateFormValuesDestination() {
    if (!this.isFormValuesAreSame()) {
      this.isFormValuesSame = false;
      this.searchDestination();
    } else {
      this.isFormValuesSame = true;
      this.destinationEmployeeListFromDB.forEach((element: any) => {
        let index = this.destinationEmployeeList.findIndex(function (emp: any) {
          return emp.employeeId == element.employeeId;
        })
        if (index != -1) {
          this.destinationEmployeeList.splice(index, 1);
        }
      });
    }
  }
  searchDestination() {
    this.destinationEmployeeList = [];
    this.toggleLoaderDestination = true;
    let api: any = 'employee/employee_bench_mapping_list?companyBranchDetailsId=' + this.companyBranchDetailsIdDestination
      + '&departmentId=' + this.departmentIdDestination + '&projectId=' + this.projectIdDestination + '&companyId=' + this.companyId;
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.destinationEmployeeListFromDB = data.data;
        this.toggleLoaderDestination = false;
        this.destinationEmployeeListFromDB.map(function (obj: any) {
          obj.selected = false;
        })
        this.tempDestinationEmployeeList.forEach((element: any) => {
          this.destinationEmployeeList.push(element);
        });
        this.destinationEmployeeListFromDB.forEach((element: any) => {
          this.destinationEmployeeList.push(element);
        });
        console.log('before : ', this.destinationEmployeeList)
        this.tempSourceEmployeeList.forEach((element: any) => {
          let index = this.destinationEmployeeList.findIndex(function (emp: any) {
            return emp.employeeId == element.employeeId;
          })
          if (index != -1) {
            this.destinationEmployeeList.splice(index, 1);
          }
        });
        console.log('after : ', this.destinationEmployeeList)
      },
        (error) => {
          this.toggleLoaderDestination = false;
          this.notification.notify('error', 'Something Went Worng');
        })

  }
  update() {
    this.submitted = true;
    let employeeIdList = [];
    if (this.employeeList.length > 0) {
      for (let i = 0; i < this.employeeList.length; i++) {
        employeeIdList.push(this.employeeList[i].employeeId);
      }
    }
    let destinationEmployeeIdList = [];
    if (this.destinationEmployeeList.length > 0) {
      for (let i = 0; i < this.destinationEmployeeList.length; i++) {
        destinationEmployeeIdList.push(this.destinationEmployeeList[i].employeeId);
      }
    }
    if(employeeIdList.length > 0 ||  destinationEmployeeIdList.length > 0) {
      
      this.spinner.show();
      var filterJson = {
        "employeeIds": destinationEmployeeIdList,
        "shiftId": this.companyBranchDetailsIdDestination,
        "shiftName": this.branchNameDestination,
        "startDate": this.form1.value.department1,
        "endDate": this.form1.value.project1,
        "companyId": sessionStorage.getItem("companyId")
      }
      let api = 'employeeShiftService/employee_shift_mapping_update';
      this.crudOperationsService.create(filterJson, api)
        .subscribe((data: any) => {
          this.spinner.hide();
          this.ngOnInit();
          this.onClick();
          this.notification.notify('success', 'Resource Mapped Successfully!');
        },
          (error) => {
           // console.log("error is ============= ",error);
            this.spinner.hide();
            this.notification.notify('error', error.error.message);
          })
    }
    
  }
}
