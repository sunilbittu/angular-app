import { Component, OnInit } from '@angular/core';
import { ShareDataService } from 'src/app/services/sharaData.service';

@Component({
  selector: 'app-check-investment',
  templateUrl: './check-investment.component.html',
  styleUrls: ['./check-investment.component.css']
})
export class CheckInvestmentComponent implements OnInit {

  constructor(public shareDataService:ShareDataService) { }
  public Subscription:any;
  public empData:any;
  public employeeId=Number(sessionStorage.getItem("empId"));

  ngOnInit(): void {
    // this.shareDataService.
    this.Subscription = this.shareDataService.currentMessage.subscribe((message) => {
      this.empData = message
     console.log('this.empData',this.empData);

    })
  }
}
