import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ConfigurationService } from '../configuration.service';
import { ShareDataService } from 'src/app/services/sharaData.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  constructor(private router: Router, public comapnyShareService: ShareDataService,
    public configurationService: ConfigurationService) { }
  public Subscription: any;
  public companyData: any;
  public headers: any = ["Code", "Name", "Email", "Website", "Contact No", "Action"];
  public companyList: any = [];
  public searchModel = '';

  ngOnInit(): void {
    this.fetchCompanies();
    this.Subscription = this.comapnyShareService.currentMessage.subscribe(message => this.companyData = message)
  }

  fetchCompanies() {
    this.configurationService.fetchCompanies(this.searchModel).subscribe((res: any) => {
      this.companyList = res.data;
    })
  }
  addCompany() {
    this.comapnyShareService.changeMessage('Add');
    this.router.navigateByUrl('HRMS/Configuration/add-edit-company');
  }
  editCompany(data: any) {
    this.comapnyShareService.changeMessage(data);
    this.router.navigateByUrl('HRMS/Configuration/add-edit-company');
  }
  ngOnDestroy() {
    this.Subscription.unsubscribe();
  }
}