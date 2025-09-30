import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tds-deducted',
  templateUrl: './tds-deducted.component.html',
  styleUrls: ['./tds-deducted.component.css']
})
export class TdsDeductedComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    (<any>$('#myModal-filter')).modal('show');
  }

}
