import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bonus-calculation',
  templateUrl: './bonus-calculation.component.html', 
  styleUrls: ['./bonus-calculation.component.css']
})
export class BonusCalculationComponent implements OnInit {

  constructor() { }

  public headers:any=["Date","Type","Bonus From","Bonus To","Rate","Action"];
  public bonus:any=[
  
  ]
  
  ngOnInit(): void {
  }

}
