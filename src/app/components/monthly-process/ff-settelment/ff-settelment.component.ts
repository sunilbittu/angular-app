import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ff-settelment',
  templateUrl: './ff-settelment.component.html',
  styleUrls: ['./ff-settelment.component.css']
})
export class FfSettelmentComponent implements OnInit {

  constructor() { }

  public headers:any=["Code","Name","Settlement Date","Show Month","Branch","Department","Status","F&F Note","Action"];
  public employees:any=[ ]
  ngOnInit(): void {
  }

} 
