import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-salary-onhold',
  templateUrl: './salary-onhold.component.html',
  styleUrls: ['./salary-onhold.component.css']
})
export class SalaryOnholdComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    (<any>$('#myModal-filter')).modal('show');
  }

}
 