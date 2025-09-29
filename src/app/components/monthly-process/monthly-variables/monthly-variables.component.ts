import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-monthly-variables',
  templateUrl: './monthly-variables.component.html',
  styleUrls: ['./monthly-variables.component.css']
})
export class MonthlyVariablesComponent implements OnInit {

  constructor() { }
  public Headers:any=["Emp Code","Emp Name","TDS","Without Helmet","Other Deduction","Labour Welfare Fund","Trasport ded","Canteen Deduction","Security Deposit Days","Gatepasss","Hold_Salary","Remarks","Action"];
  public variablesData:any=[];
  ngOnInit(): void {
  }

}
