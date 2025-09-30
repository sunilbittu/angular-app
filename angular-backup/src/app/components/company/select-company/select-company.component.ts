import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from '../company.service';

@Component({
  selector: 'app-select-company',
  templateUrl: './select-company.component.html',
  styleUrls: ['./select-company.component.css']
})
export class SelectCompanyComponent implements OnInit {
  public companyList: any;
  public countryData: any;

  constructor(private route: Router, public companyService: CompanyService) { }

  ngOnInit(): void {
    this.countryData = {};
    this.fetchCompanies();
  }

  onClick(value: any) {
    console.log(value);
    sessionStorage.setItem("companyId", value.companyId);
    sessionStorage.setItem("companyName", value.companyName);
    //this.route.navigateByUrl('/HRMS/Company/edit-company');
    this.route.navigateByUrl('/HRMS/dashboard');
  }

  logout() {
    this.route.navigateByUrl('/login');
  }

  fetchCompanies() {
    this.companyService.fetchCompanies('').subscribe((res: any) => {
      this.companyList = res.data;
    })
  }
}
