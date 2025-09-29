import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { ConfigurationService } from '../configuration.service';
@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {
  public headers: any = ["Id", "Country", "Action"];
  public countries: any = [];
  public countryObject: any = "";
  public countryName: any = "";
  public countryId: any = "";
  public countryName1: any = "";
  public isDeleted: any = "false";
  public isCountryNameBlank: any = '';
  isCountryExist: any;
    //pagination
  public p: number = 1;
  itemsPerPage: any=10;
  totalItems: any;
  currentPage: any;
  totalElements: number = 0;
  showingFrom: number = 0;
  showingTo: number = 0;
  public pageNumber: Number = 0;
  public pageSize: number = 10;
  constructor(private configurationService: ConfigurationService, private crudOperationsService: CrudOperationsService,
    private notification: NotifierService, private spinner: NgxSpinnerService) { }
  ngOnInit(): void {
    this.fetchCountries();
  }
  public handlePagination(data: any) {
    this.totalElements = data.data.totalElements;
    this.itemsPerPage = 10;
    this.currentPage = data.data.pageable.pageNumber + 1;
    this.totalItems = (data.data.totalPages) * this.itemsPerPage;
    this.showingFrom = (data.data.pageable.pageNumber * this.itemsPerPage) + 1;
    const to = (data.data.pageable.pageNumber + 1) * this.itemsPerPage;
    if (this.totalElements >= to) {
      this.showingTo = to;
    } else {
      this.showingTo = this.totalElements;
    }
  }
  public pageChanged(event: any): void {
    this.pageNumber = event - 1;
    this.fetchCountries();
  }
  createCountry() {
    if (!this.isCountryExist && this.countryName != '') {
      let object: any = { 'countryName': this.countryName }
      this.configurationService.createCountry(object).subscribe((data: any) => {
        window.scroll(0, 0);
        (<any>$('#myModal-add')).modal('hide');
        this.notification.notify('success', 'Country created successfully!');
        this.fetchCountries();
        this.countryName = "";
      })
    }
    else {
      if (this.countryName == '') {
        this.isCountryNameBlank = 'Country Name can\'t be blank';
      }
    }
  }
  public searchModel = '';
  fetchCountries() {
    //show spinner
    this.spinner.show();
    let api: any = 'country/list?search=' + this.searchModel+"&page=" + this.pageNumber + "&size=10";
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        //show hide
        this.spinner.hide();
        this.countryObject = data.data.content;
        this.handlePagination(data);
        this.countryObject.sort((a: any, b: any) => a.countryId - b.countryId);
      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
          //show hide
          this.spinner.hide();
        })
  }
  editCountry(data: any) {
    this.countryId = data.countryId;
    this.countryName1 = data.countryName;
  }
  updateCountry() {
    if (!this.isCountryExist && this.countryName1.trim() !== '') {
      const object: any = { 'countryName': this.countryName1 };
      this.configurationService.updateCountry(this.countryId, object).subscribe((data: any) => {
        window.scroll(0, 0);
        (<any>$('#myModal-edit')).modal('hide');
        this.notification.notify('success', 'Country updated successfully!');
        // console.log(data)
        this.fetchCountries();
      });
    }
    else {
      if (this.countryName1.trim() === '') {
        this.isCountryNameBlank = 'Country Name can\'t be blank';
      }
    }
  }
  removeCountry(data: any) {
    this.countryId = data.countryId;
  }
  deleteCountry() {
    this.configurationService.deleteCountry(this.countryId).subscribe((data: any) => {
      console.log(data)
      this.fetchCountries();
    },
    (error:any) => {
      this.spinner.hide();
      let erroe:any=error.error.message;
      this.notification.notify("error",erroe);
    })
  }
  clear() {
    this.countryName = "";
    this.countryName1 = "";
    this.isCountryExist = false;
  }
  checkCountry() {
    this.isCountryExist = false;
    console.log(this.countryName);
    let api = 'country/validate?name=' + this.countryName;
    this.crudOperationsService.validate(api)
      .subscribe((data: any) => {
        this.isCountryExist = data;
      },
        (_error: any) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  checkCountry1() {
    this.isCountryExist = false;
    console.log(this.countryName);
    let api = 'country/validate?name=' + this.countryName1;
    this.crudOperationsService.validate(api)
      .subscribe((data: any) => {
        this.isCountryExist = data;
      },
        (_error: any) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  
  handleCountryName() {
    if (this.countryName != '') {
      this.isCountryNameBlank = ''
    }
  }
}
