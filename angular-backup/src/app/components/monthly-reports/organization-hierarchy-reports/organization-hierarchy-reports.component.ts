import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';

@Component({
  selector: 'app-organization-hierarchy-reports',
  templateUrl: './organization-hierarchy-reports.component.html',
  styleUrls: ['./organization-hierarchy-reports.component.css']
})
export class OrganizationHierarchyReportsComponent implements OnInit {

  constructor(public crudOperationsService: CrudOperationsService, public fb: FormBuilder,
    private notification: NotifierService, private employeMasterService: EmployeeMastersService,
    private spinner: NgxSpinnerService) { }
  public orgCharts: any = [
    {
      name: "Organization Chart"
    },
    {
      name: "Branch Hierarchy",
      data: [{ key: 1, value: "Structural" }, { key: 2, value: "Employee Based" }]
    }
    // ,
    // {
    //   name: "Department Hierarchy",
    //   data: [{ key: 3, value: "Structural" }, { key: 4, value: "Employee Based" }]
    // }
  ];
  ds = {
    id: '1',
    name: 'Lao Lao',
    title: 'general manager',
    children: [
      { id: '2', name: 'Bo Miao', title: 'department manager' },
      {
        id: '3',
        name: 'Su Miao',
        title: 'department manager',
        children: [
          { id: '4', name: 'Tie Hua', title: 'senior engineer' },
          {
            id: '5',
            name: 'Hei Hei',
            title: 'senior engineer',
            children: [
              { id: '6', name: 'Dan Zai', title: 'engineer' },
              { id: '7', name: 'Dan Dan', title: 'engineer' },
              { id: '8', name: 'Xiang Xiang', title: 'engineer' },
              { id: '9', name: 'Ke Xin', title: 'engineer' },
              { id: '10', name: 'Xiao Dan', title: 'engineer' },
              { id: '11', name: 'Dan Dan Zai', title: 'engineer' }
            ]
          },
          { id: '12', name: 'Pang Pang', title: 'senior engineer' },
          { id: '13', name: 'Er Pang', title: 'senior engineer' },
          { id: '14', name: 'San Pang', title: 'senior engineer' },
          { id: '15', name: 'Si Pang', title: 'senior engineer' }
        ]
      },
      { id: '16', name: 'Hong Miao', title: 'department manager' },
      { id: '17', name: 'Chun Miao', title: 'department manager' },
      { id: '18', name: 'Yu Li', title: 'department manager' },
      { id: '19', name: 'Yu Jie', title: 'department manager' },
      { id: '20', name: 'Yu Wei', title: 'department manager' },
      { id: '21', name: 'Yu Tie', title: 'department manager' }
    ]
  };
  public form = this.fb.group({
    company: ["", Validators.required],
    branch: ["", Validators.required],
    department: ["", Validators.required]
  });

  get form_() { return this.form.controls; };
  public submitted: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public companyList: any = [];
  public branchList: any = [];
  public departmentList: any = [];
  public isFormValueInvalid: boolean = false;

  clear() {
    this.form_['company'].setValue('');
    this.form_['branch'].setValue('');
    this.form_['department'].setValue('');
  }
  fetchCompanyList() {
    this.spinner.show();
    let url = 'company/list?search=';
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      this.spinner.hide();
      this.companyList = data.data;
    },
      (error) => {
        this.spinner.hide();
        this.handleError();
      })
  }
  onClick() {
    this.clear();
  }
  changeBranch(event: any) {
    console.log(this.form.value.branch);
    const companyBranchDetailsId = event.target.value;
    this.fetchDepartmentsByBranch(companyBranchDetailsId);
  }
  fetchDepartmentsByBranch(companyBranchDetailsId: any) {
    let api: any = "department/dropdownList_departments/" + companyBranchDetailsId;
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.departmentList = data.data;
      },
        (error) => {
          this.handleError();
        })
  }
  submit() {
    this.submitted = true;
    if (this.chartValue !== '') {
      if (this.chartValue == 'Organization Chart') {
        this.resetChartValues();
        this.fetchOrgChartData();
      } else {
        if (this.childValue != '') {
          this.resetChartValues();
          this.fetchHierarchyChartData(this.chartValue, this.childValue);
        } else {
          this.isFormValueInvalid = true;
        }
      }
    }
  }
  resetChartValues() {
    this.showChart = true;
    this.chartReport = {};
    this.toggleLoader = false;
  }
  fetchHierarchyChartData(chartValue: any, childValue: string) {
    if (chartValue == 'Branch Hierarchy') {
      this.fetchChildStructure(childValue, 'Branch');
    }
    if (chartValue == 'Department Hierarchy') {
      this.fetchChildStructure(childValue, 'Department');
    }
  }
  fetchChildStructure(childValue: string, value: string) {
    if (childValue == '1' || childValue == '3') {
      this.fetchStuctureBasedReport(value);
    }
    if (childValue == '2' || childValue == '4') {
      this.fetchEmployeeBasedReport(value);
    }
  }

  fetchEmployeeBasedReport(value: string) {
    if (value == 'Branch') {
      let url = 'hierarchy-report/emp-based-chart-report?type=Branch&companyId=' +
        this.companyId + '&branchId=' + this.form.value.branch;
      this.crudOperationsService.getList(url).subscribe((data: any) => {
        this.handleResponse(data);
      },
        (error) => {
          this.handleError();
        })
    } else {
      let url = 'hierarchy-report/emp-based-chart-report?type=Department&companyId=' +
        this.companyId + '&branchId=' + this.form.value.branch + '&departmentId=' + this.form.value.department;
      this.crudOperationsService.getList(url).subscribe((data: any) => {
        this.handleResponse(data);
      },
        (error) => {
          this.handleError();
        })
    }
  }

  fetchStuctureBasedReport(value: string) {
    if (value == 'Branch') {
      let url = 'hierarchy-report/structure-chart-report?type=Branch&companyId=' +
        this.companyId + '&branchId=' + this.form.value.branch + '&departmentId=' + this.form.value.department;
      this.crudOperationsService.getList(url).subscribe((data: any) => {
        this.handleResponse(data);
      },
        (error) => {
          this.handleError();
        })
    } else {
      let url = 'hierarchy-report/structure-chart-report?type=Department&companyId=' +
        this.companyId + '&branchId=' + this.form.value.branch + '&departmentId=' + this.form.value.department;
      this.crudOperationsService.getList(url).subscribe((data: any) => {
        this.handleResponse(data);
      },
        (error) => {
          this.handleError();
        })
    }
  }
  selectNode(nodeData: any) {
    // if (nodeData.title == 'Department') {
    //   (<any>$('#show-dept')).modal('show');
    //   console.log(nodeData.id)
    //   this.fetchDepartmentChart(nodeData.id);
    // }
  }
  fetchDepartmentChart(id: any) {
    this.toggleInnerLoader = false;
    let url = 'hierarchy-report/dept-chart-report/' + id;
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      this.toggleInnerLoader = true;
      console.log(data);
      this.departmentChartReport = data.data;
    },
      (error) => {
        this.handleError();
      })
  }
  public childValue: string = '';
  public chartValue: any;
  public chartReport: any = {};
  public departmentChartReport: any = {};
  public toggleLoader = false;
  public toggleInnerLoader = false;
  public showPage = false;
  public showChart = false;

  handleOrgReport(name: any) {
    this.chartValue = name;
    this.childValue = '';
    this.setDefaultPageValue();
  }
  handleChild(child: any) {
    this.childValue = child;
    this.isFormValueInvalid = false;
    if (child == 1 || child == 2) {
      this.chartValue = 'Branch Hierarchy';
    }
    if (child == 3 || child == 4) {
      this.chartValue = 'Department Hierarchy';
    }
    this.setDefaultPageValue();
  }
  setDefaultPageValue() {
    this.submitted = false;
    this.showPage = true;
    this.showChart = false;
  }

  fetchOrgChartData() {
    let url = 'hierarchy-report/org-chart-report/' + this.companyId;
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      this.handleResponse(data);
    },
      (error) => {
        this.handleError();
      })
  }
  handleResponse(data: any) {
    this.toggleLoader = true;
    console.log(data);
    this.chartReport = data.data;
  }
  handleError() {
    this.toggleLoader = true;
    this.toggleInnerLoader = true;
    this.notification.notify('error', 'Something Went Worng');
  }
  changeCompany(event: any) {
    this.companyId = event.target.value;
    this.fetchBranchDetailsList(this.companyId);
  }
  fetchBranchDetailsList(id: any) {
    return this.employeMasterService.getBranchMaster(id)
      .subscribe((data: any) => {
        this.branchList = data.data.content;
      },
        (error) => {
          this.handleError();
        })
  }
  public companyId: any;
  public companyName: any;
  ngOnInit(): void {
    this.companyName = sessionStorage.getItem('companyName');
    this.companyId = Number(sessionStorage.getItem('companyId'));
    this.fetchCompanyList();
  }
  exportExcel() {
    let url = '';
    // switch (this.chartValue) {
    //   case "Investments":
    //     url = 'reports/employees_investment/EXCEL?employeeId=' + this.companyId +
    //       '&financialYearId=' + this.form.value.finYear + '&employeeId=' +this.employeeId;
    //     break;
    //   case "Monthly TDS":
    //     url = 'taxprojection/monthly_tds/EXCEL?companyId=' + this.companyId + '&month=' +
    //       this.form.value.month + '&financialYearId=' + this.form.value.finYear + '&employeeId=' +this.employeeId;
    //     break;
    //   case "Quarterly TDS":
    //     url = 'taxprojection/quarterly_tds/EXCEL?companyId=' + this.companyId + '&months=' +
    //       this.quarterMonths + '&financialYearId=' + this.form.value.finYear + '&employeeId=' +this.employeeId;
    //     break;
    //   case "Yearly TDS":
    //     url = 'taxprojection/yearly_tds/EXCEL?companyId=' + this.companyId + '&financialYearId=' + 
    //     this.form.value.finYear + '&employeeId=' +this.employeeId;
    //     break;
    // }
    // this.crudOperationsService.exportExcelReport(url, this.chartValue + 'Report.xls');
  }
  exportPDF() {
    let url = '';
    switch (this.chartValue) {
      // case "Investments":
      //   url = 'reports/employees_investment/PDF?employeeId=' + this.companyId +
      //     '&financialYearId=' + this.form.value.finYear + '&employeeId=' +this.employeeId;
      //   break;
      // case "Monthly TDS":
      //   url = 'taxprojection/monthly_tds/PDF?companyId=' + this.companyId + '&month=' +
      //     this.form.value.month + '&financialYearId=' + this.form.value.finYear + '&employeeId=' +this.employeeId;
      //   break;
      // case "Quarterly TDS":
      //   url = 'taxprojection/quarterly_tds/PDF?companyId=' + this.companyId + '&months=' +
      //     this.quarterMonths + '&financialYearId=' + this.form.value.finYear + '&employeeId=' +this.employeeId;
      //   break;
      // case "Yearly TDS":
      //   url = 'taxprojection/yearly_tds/PDF?companyId=' + this.companyId + '&financialYearId=' +
      //     this.form.value.finYear + '&employeeId=' +this.employeeId;
      //   break;
    }
    // this.crudOperationsService.exportPDF(url, this.chartValue + 'Report.pdf');
  }

}
