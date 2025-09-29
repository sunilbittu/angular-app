import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmployeeMastersService } from '../../master/employee.masters.service';
import { UtilitiesService } from '../utilities.service';

@Component({
  selector: 'app-salary-mapping',
  templateUrl: './salary-mapping.component.html',
  styleUrls: ['./salary-mapping.component.css']
})
export class SalaryMappingComponent implements OnInit {

  public companyId: any;
  public salaryComponentList: any;
  public salaryCompHeaders: any = ["CTC Component Name", "Branch Name", "Department(s)", "Action"];
  selectedItems: any = [];
  dropdownSettings: any = {};
  public ctcComponentModel = "";
  public branchComponentModel = '';
  public ctcComponentList: any = [];
  public departmentMasterList: any = [];
  salaryMappingList: any;
  branchDetailsList: any;
  public companyBranchDetailsId: number = 0;
  public ctcComponentId: number = 0;
  public submitText = '';
  public salaryMappingId: number = 0;
  public submitted = false;

  // ctcDropdownSettings: any = {};
  // ctcSelectedItems: any = [];

  constructor(private employeMasterService: EmployeeMastersService, private notification: NotifierService,
    public utilitiesService: UtilitiesService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.companyId = sessionStorage.getItem("companyId");
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'departmentId',
      textField: 'departmentName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.fetchSalaryMapping();
    this.fetchCtcComponent();
  }
  ngAfterViewInit(): void {
    this.fetchBranchDetailsList();
  }
  onItemSelect(data: any) {
    console.log('data', data);
  }
  onSelectAll(event: any) {
    console.log('data', event);
  }
  onDeSelectAll(event: any) {
    console.log('data', event);
  }
  onItemDeSelect(data: any) {
    console.log('data', data);
  }
  changeCtcComponent(event: any) {
    console.log(this.ctcComponentModel);
    this.ctcComponentId = event.target.value;
  }
  
  fetchCtcComponent() {
    this.utilitiesService.fetchCtcComponent(Number(this.companyId)).subscribe((res: any) => {
      this.ctcComponentList = res.data;
    })
  }
  submit() {
    this.submitted = true;
    if (this.ctcComponentId != 0 && this.selectedItems.length > 0 && this.companyBranchDetailsId != 0) {
      this.spinner.show();
      const companyObj = { 'companyId': this.companyId };
      const branchObj = { 'companyBranchDetailsId': this.companyBranchDetailsId };
      const ctcComponentObj = { 'ctcComponentId': this.ctcComponentId };

      const formObj = { 'ctcComponent': ctcComponentObj, 'department': this.selectedItems, 'company': companyObj, 'branchDetail': branchObj};
      if(this.submitText == 'Save') {
        this.utilitiesService.saveSalaryMapping(formObj).subscribe((res: any) => {
          if (res.status == "success") {
            this.submitted = false;
            window.scroll(0, 0);
            (<any>$('#add')).modal('hide');
            this.fetchSalaryMapping();
            this.spinner.hide();
            this.notification.notify('success', 'Record Created Successfully!');
          }
        },
        (error) => {
          (<any>$('#add')).modal('hide');
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Worng');
        })
      } else {
        this.utilitiesService.updateSalaryMapping(formObj, this.salaryMappingId).subscribe((res: any) => {
          if (res.data.isMatchFound) {
            this.spinner.hide();
            this.notification.notify('error', 'Department(s) already mapped [' + res.data.mappedDepts + ']');
          } else {
            this.submitted = false;
            window.scroll(0, 0);
            (<any>$('#add')).modal('hide');
            this.fetchSalaryMapping();
            this.spinner.hide();
            this.notification.notify('success', 'Record Updated Successfully!');
          }
        },
        (error) => {
          (<any>$('#add')).modal('hide');
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Worng');
        })
      }
    }
  }
  fetchSalaryMapping() {
    this.spinner.show();
    this.utilitiesService.fetchSalaryMapping(Number(this.companyId)).subscribe((res: any) => {
      this.spinner.hide();
      this.salaryMappingList = res.data;
    },
    (error) => {
      this.spinner.hide();

      this.notification.notify('error', 'Something Went Worng');
    })
  }
  changeBranchComponent(event: any) {
    console.log(event.target.value);
    this.companyBranchDetailsId = event.target.value;
    this.selectedItems = [];
    this.fetchDepartmentsByBranch(this.companyBranchDetailsId);
  }
  fetchDepartmentsByBranch(companyBranchDetailsId: any) {
    this.utilitiesService.fetchDepartmentsByBranch(companyBranchDetailsId).subscribe((res: any) => {
      this.departmentMasterList = [] = res.data;
    })
  }
  fetchBranchDetailsList() {
    return this.employeMasterService.getBranchMaster(this.companyId)
      .subscribe((data: any) => {
        this.branchDetailsList = data.data.content;
      },
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  edit(data: any) {
    this.reset();
    this.submitText = 'Update';
    this.fetchDepartmentsByBranch(data.companyBranchDetailsId);
    this.branchComponentModel = data.companyBranchDetailsId;
    this.companyBranchDetailsId = data.companyBranchDetailsId;
    this.selectedItems = data.department;
    this.ctcComponentModel = data.ctcComponentId;
    this.ctcComponentId = data.ctcComponentId;
    this.salaryMappingId = data.salaryMappingId;
  }
  reset() {
    this.submitText = 'Save';
    this.branchComponentModel = '';
    this.selectedItems = [];
    this.ctcComponentModel = '';
    this.submitted = false;
  }
}
