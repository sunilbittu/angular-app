import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-process-leave-balance',
  templateUrl: './process-leave-balance.component.html',
  styleUrls: ['./process-leave-balance.component.css']
})
export class ProcessLeaveBalanceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    (<any>$('#myModal-filter')).modal('show');
  }

}
