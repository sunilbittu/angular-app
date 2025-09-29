import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-division-master',
  templateUrl: './division-master.component.html',
  styleUrls: ['./division-master.component.css']
})
export class DivisionMasterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  public headers:any=["Division Code","Division Name","Days","Action"];
  public employees:any=[
                      {divisionCode:'123',designationName:'Teacher',days:'1'},
                      {designationCode:'123',designationName:'Teacher',days:'1'}
                     ]
}
