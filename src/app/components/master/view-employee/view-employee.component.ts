import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { ShareDataService } from 'src/app/services/sharaData.service';
import { ConfigurationService } from '../../configuration/configuration.service';
import { AddEmployeeService } from '../addEmplyee.service';
import { AddEmployeeComponent } from '../employee-master/add-employee/add-employee.component';

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css']
})
export class ViewEmployeeComponent implements OnInit {

  
 
  constructor(private commonService: ConfigurationService,
    private datePipe: DatePipe, public employeeService: AddEmployeeService,
    private notificationService: NotifierService, private spinner: NgxSpinnerService,
    private addEmployeeService: AddEmployeeService,private sharedData: ShareDataService) { }
  

  ngOnInit(): void {

   //this.editEmployeeApiCall(26);
  }



   

  GetChildData(data:any){  
 }
 

}
