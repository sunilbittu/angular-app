import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-visit-application-report',
  templateUrl: './visit-application-report.component.html',
  styleUrls: ['./visit-application-report.component.css']
})
export class VisitApplicationReportComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  public status: any = ["Final Approved", "Approved", "Cancelled", "Rejected" ];
}
