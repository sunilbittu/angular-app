import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-master',
  templateUrl: './event-master.component.html',
  styleUrls: ['./event-master.component.css']
})
export class EventMasterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  public headers:any=["Title","Description","Date","Start Time","End Time","Status","Action"];
  public employees:any=[
                      {Title:'Birthday Celebration',Description:'All fellows are request to gether in hall to celebrate director birthday. Branch',
                      Date:'25-07-2019',StartTime:'16:00',EndTime:'17:00',Status:'No'},
                      {Title:'Birthday Celebration',Description:'All fellows are request to gether in hall to celebrate director birthday. Branch',
                      Date:'25-07-2019',StartTime:'16:00',EndTime:'17:00',Status:'No'},
]

}
