import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-yearly-salaryregister',
  templateUrl: './yearly-salaryregister.component.html',
  styleUrls: ['./yearly-salaryregister.component.css']
})
export class YearlySalaryregisterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    (<any>$('#myModal-filter')).modal('show');
  }

}
