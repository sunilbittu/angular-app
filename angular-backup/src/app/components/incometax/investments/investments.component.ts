import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { ShareDataService } from 'src/app/services/sharaData.service';
import { AddEmployeeService } from '../../master/addEmplyee.service';

@Component({
  selector: 'app-investments',
  templateUrl: './investments.component.html',
  styleUrls: ['./investments.component.css']
})
export class InvestmentsComponent implements OnInit {

  constructor(private employeeService: AddEmployeeService, public router: Router,
    private shareDataService: ShareDataService, public crudOperationsService: CrudOperationsService,
    private spinner: NgxSpinnerService) { }
  public companyId!: number;
  public employeeList!: any[];
  public Subscription: any;
  public emnpdata: any;
  public toggleButton: boolean = false;
  highlightRow!: any;
  public headers: any = ["Code", "Name", "Branch", "Department", "Designation", "Division", "Grade", "Category", "Project"];
  public employees: any = [
    { code: '123', name: 'bharath', branch: 'HYD', department: 'IT', designation: 'Developer', division: 'A1', grade: 'A', category: 'Staff', project: 'HRMS' },
    { code: '111', name: 'bhargav', branch: 'HYD', department: 'IT', designation: 'Developer', division: 'A1', grade: 'A', category: 'Staff', project: 'CMS' }
  ]
  ngOnInit(): void {
    this.spinner.show();
    this.companyId = Number(sessionStorage.getItem('companyId'));
    let comapnyId = sessionStorage.getItem('companyId');
    let url = "employee/list_for_employee_investment_list/" + comapnyId;
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      this.spinner.hide();
      console.log(data);
      this.employeeList = data.data.content;
    },
      (error) => {
        this.spinner.hide();
      })
  }
  public employeeDetails: any;
  employeeClick(index: Number, employee: any) {
    if (this.highlightRow === index) {
      this.highlightRow = undefined;
    }
    else {
      this.highlightRow = index;
    }
    // (<any>$('#InvestmentDetails')).modal('show'); 
    console.log('aaaa', employee);
    this.employeeDetails = employee;
    this.toggleButton = true;
  }
  checkInvestment() {
    this.shareDataService.changeMessage(this.employeeDetails);
    this.router.navigateByUrl('HRMS/Income-tax/check-investments/investments-table');
  }


}
