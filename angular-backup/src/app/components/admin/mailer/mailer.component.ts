import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mailer',
  templateUrl: './mailer.component.html',
  styleUrls: ['./mailer.component.css']
})
export class MailerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }



  public headers:any=["Code","Name","Branch","Department","Designation","Grade","Mail Status"];
  public employees:any=[
                      {Code:'101',Name:'Sourabh Hedaoo',Branch:'Ahmedabad',Department:'HR Department',Designation:'HR MANAGER',Grade:'A',MailStatus:''},
                      {Code:'101',Name:'Sourabh Hedaoo',Branch:'Ahmedabad',Department:'HR Department',Designation:'HR MANAGER',Grade:'A',MailStatus:''},
                      {Code:'101',Name:'Sourabh Hedaoo',Branch:'Ahmedabad',Department:'HR Department',Designation:'HR MANAGER',Grade:'A',MailStatus:''},
 ]

}
