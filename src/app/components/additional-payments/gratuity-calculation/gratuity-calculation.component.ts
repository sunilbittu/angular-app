import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gratuity-calculation',
  templateUrl: './gratuity-calculation.component.html',
  styleUrls: ['./gratuity-calculation.component.css']
})
export class GratuityCalculationComponent implements OnInit {

  constructor() { }

  public headers:any=["Employee Code","Name","DOJ", "No. of Years", "Last Salary","Calculated Salary", "Calculated Gratuity","Maximum Gratuity"];
  public employees:any=[

   ]

   public months:any=[]

  ngOnInit(): void {
  }

}
