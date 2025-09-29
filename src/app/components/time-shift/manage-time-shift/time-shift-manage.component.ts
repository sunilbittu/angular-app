import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';

@Component({
  selector: 'app-time-shift-manage',
  templateUrl: './time-shift-manage.component.html',
  styleUrls: ['./time-shift-manage.component.css']
})
export class TimeShiftManageComponent implements OnInit {
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public branchList: any = [];
  public searchEmployeeList: any = [];
  public shiftList: any = [];
  public departmentList: any = [];
  public departmentListDestination: any = [];
  public projectList!: any[];
  public employeeList: any = [];
  public toggleStatus: boolean = true;
  public hideStatus: any = undefined;
  public searchModel: String = '';
  public searchItem: any;
  public statusModel: any = "";
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public searchInput: string = '';
  public toggleLoader: boolean = false;
  public shiftEditValue: boolean = false;
  public toggleLoaderDestination: boolean = false;
  public companyBranchDetailsId: string = '';
  public departmentId: string = '';
  public projectId: string = '';
  public branchName: string = '';
  public departmentName: string = '';
  public projectName: string = '';
  public companyBranchDetailsIdDestination: string = '';
  public shiftId: string = '';
  public shiftName: any;
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
  public selectedItems: any = [];
  public isFormValuesSame: boolean = false;

  public employeeObjForExport: any;

  public sourceBranch: any = '';
  public destinationBranch: any = [];

  public sourceDept: any = '';
  public destinationDept: any = '';
  public sourceProject: any = '';
  public destinationProject: any = '';

  p = 1;
  public numberOfEntitesToShow: number = 20;

  public headers: any = ["Employee Id", "Employee Name", "Time shift", "Date Of Shift", "Actions"];

  public form = this.fb.group({
    branch: ['', Validators.required],
    department: ['', Validators.required],
    project: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required]
  });

  get form_() { return this.form.controls; };

  public dropdownSettings = {
    singleSelection: false,
    idField: 'shiftId',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 4,
    allowSearchFilter: false,
  };

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
    let api: any = 'shiftMaster/shiftMaster_search_list/1?search=&page=0&size=20';
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.shiftList = data.data.content;
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

  onItemSelect(data: any) {
    this.selectedItems.push(data);
  }
  OnItemDeSelect(item: any) {
    for (let i = 0; i < this.selectedItems.length; i++) {
      if (this.selectedItems[i].shiftId == item.shiftId) {
        this.selectedItems.splice(i, 1);
      }
    }
  }
  onSelectAll(event: any) {
    // this.destinationBranch=event;
    this.selectedItems = event;
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

  clear() {
    this.form_['project'].setValue('');
    this.form_['branch'].setValue('');
    this.form_['department'].setValue('');
    this.form_['endDate'].setValue('');
    this.form_['startDate'].setValue('');
    this.selectedItems = [];
  }
  onClick() {
    this.isFormValuesSame = false;
    this.submitted = false;
    this.clear();
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
  }
  onClickCheckBox(id: any) {
    const i = this.employeeList.findIndex((obj: any) => obj.employeeId == id);
    this.employeeList[i].selected = !this.employeeList[i].selected;
  }

  selectAll(event: any) {
    const checked = event.target.checked;
    this.employeeList.forEach((item: any) => item.selected = checked);
  }

  shiftEdit() {
    this.shiftEditValue = true;
  }
  changeStatus(i: any) {
    this.toggleStatus = true;
    this.hideStatus = i;
  }
  updateShift(employeeShiftId: any) {
    this.spinner.show();
    this.toggleStatus = false;
    this.hideStatus = undefined;
    var updateJson = {
      "employeeShiftId": employeeShiftId,
      "shiftId": this.shiftName.shiftId,
      "shiftName": this.shiftName.name,

    }
    let api = 'employeeShiftService/employee_shift_update';
    this.crudOperationsService.create(updateJson, api)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.searchTimeShiftEmployees();
      }, (error) => {
        this.spinner.hide();
        this.notification.notify('error', 'Something Went Worng');
      });
  }

  searchTimeShiftEmployees() {
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
    if (employeeIdList.length > 0 || destinationEmployeeIdList.length > 0) {

      this.spinner.show();
      var filterJson = {
        "employeeIds": employeeIdList,
        "shiftId": this.selectedItems,
        "startDate": this.form.value.startDate,
        "endDate": this.form.value.endDate
      }

      this.employeeObjForExport = this.setFormObj(employeeIdList);
      let api = 'employeeShiftService/get_employee_shift';
      this.crudOperationsService.create(filterJson, api)
        .subscribe((data: any) => {
          this.spinner.hide();
          this.searchEmployeeList = data.data;
        },
          (error) => {
            this.spinner.hide();
          })
    }
  }
  setFormObj(employeeIdList: any) {
    let obj = {
      "employeeIds": employeeIdList,
      "shiftId": this.selectedItems,
      "startDate": this.form.value.startDate,
      "endDate": this.form.value.endDate,
      "branch": this.form.value.branch.branchName,
      "department": this.form.value.department.departmentName,
      "project": this.form.value.project.projectName
    }
    return obj;
  }

  getSearchByEmployees() {
    this.submitted = true;
    this.searchEmployeeList = [];
    var n = Number(this.searchModel);
    let employeeIdList = [];
    employeeIdList.push(n);

    if (employeeIdList.length > 0) {

      this.spinner.show();
      var filterJson = {
        "employeeIds": employeeIdList,
        "shiftId": this.selectedItems,
        "startDate": this.form.value.startDate,
        "endDate": this.form.value.endDate
      }
      let api = 'employeeShiftService/get_employee_shift';
      this.crudOperationsService.create(filterJson, api)
        .subscribe((data: any) => {
          this.spinner.hide();
          this.searchEmployeeList = data.data;
        },
          (error) => {
            this.spinner.hide();
          })
    } else {
      this.searchTimeShiftEmployees();
    }
  }

  exportTable(type: string) {
    //spinner show
    this.spinner.show();
    let fileName='time-shift-report';
    var fileType = '';
    if (type == 'EXCEL') {
      fileName=fileName+'.xls';
      fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    else {
      fileName=fileName+'.pdf';
      fileType = 'application/pdf';
    }
    let api: any = "reports/time_shift_report/" + type;
    this.crudOperationsService.downloadDocumentExpenseReport(api, this.employeeObjForExport)
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

        anchor.click();
        //window.location.href = response.url;
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
