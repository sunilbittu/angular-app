import { Component, OnInit } from '@angular/core';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { AddEmployeeService } from 'src/app/components/master/addEmplyee.service';

@Component({
  selector: 'app-yearly-leave-balance',
  templateUrl: './yearly-leave-balance.component.html',
  styleUrls: ['./yearly-leave-balance.component.css']
})
export class YearlyLeaveBalanceComponent implements OnInit {

  public LeaveTypesObject:any=[];
  public epmloyeeList:any=[];
  public monthList:any=["Jan","Feb","Mar","Apr"];
  public companyId:any;
  public companyName:any;
  public selectedYear:any;

  constructor(public crudOperationsService:CrudOperationsService,
    private employeeService:AddEmployeeService) { }

  ngOnInit(): void {
    this.companyName = sessionStorage.getItem("companyName");
    this.selectedYear = sessionStorage.getItem("selectedYear");
    this.crudOperationsService.getList('leavetype/dropdownList?id='+sessionStorage.getItem("companyId")).subscribe((data:any)=> {
      this.LeaveTypesObject=data.data;
    })

    this.crudOperationsService.getList('leavemasterindividual/leavemasterindividualall?companyId='+sessionStorage.getItem("companyId")).subscribe((data:any)=> {
       this.epmloyeeList=data.data;
      
     });
    // this.companyId = sessionStorage.getItem("companyId");
    // this.employeeService.getAllEmployees(this.companyId)
    // .subscribe((data: any)=>{
    //   this.epmloyeeList = data.data.content
    //   console.log(this.epmloyeeList);
    // });
  }

}
