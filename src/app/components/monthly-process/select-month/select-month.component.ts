import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-month',
  templateUrl: './select-month.component.html',
  styleUrls: ['./select-month.component.css']
})
export class SelectMonthComponent implements OnInit {

  constructor() { }
  public Headers:any=["Start Date","End Date","Total Days","Months","Year","Month Name","Lock","Pay Slip In ESS","Active Month","Paid Holidays","Weekly Off","Action"];
  public monthsData:any=[
    {startDate:'01/01/2020',endDate:'31/01/2020',totalDays:'30',months:'1',year:'2020',monthName:'Jan',lock:'No',essPaySlip:'yes',activeMonth:'No',paidHolidays:'1',weeklyOff:'10'},
    {startDate:'01/01/2021',endDate:'31/01/2021',totalDays:'30',months:'1',year:'2021',monthName:'Jan',lock:'No',essPaySlip:'yes',activeMonth:'No',paidHolidays:'1',weeklyOff:'10'}

  ]
  ngOnInit(): void {
  }

}
