import { Component, Input, OnInit } from '@angular/core';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { AddEmployeeService } from 'src/app/components/master/addEmplyee.service';

@Component({
  selector: 'app-yearly-summary',
  templateUrl: './yearly-summary.component.html',
  styleUrls: ['./yearly-summary.component.css']
})
export class YearlySummaryComponent implements OnInit {

  public LeaveTypesObject: any = [];
  public epmloyeeList: any = [];
  public monthList: any = ["Jan", "Feb", "Mar", "Apr"];
  public companyId: any;
  public companyName: any;
  public selectedYear: any;

  @Input() link: any;

  constructor(public crudOperationsService: CrudOperationsService,
    private employeeService: AddEmployeeService) { }

  ngOnInit(): void {
    console.log('input : ', this.link);
    this.companyId = sessionStorage.getItem("companyId");
    this.companyName = sessionStorage.getItem("companyName");
    this.selectedYear = sessionStorage.getItem("selectedYear");
    this.crudOperationsService.getList('leavetype/dropdownList?id=' + sessionStorage.getItem("companyId")).subscribe((data: any) => {
      this.LeaveTypesObject = data.data;
    })

    this.crudOperationsService.getList('leavemasterindividual/leave-master-ind?companyId=' +
      this.companyId + '&year=' + this.selectedYear).subscribe((data: any) => {
        this.epmloyeeList = data.data;
      });
    // this.companyId = sessionStorage.getItem("companyId");
    // this.employeeService.getAllEmployees(this.companyId)
    // .subscribe((data: any)=>{
    //   this.epmloyeeList = data.data.content
    //   console.log(this.epmloyeeList);
    // });
  }

}
