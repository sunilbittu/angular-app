import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { ConfigurationService } from '../configuration.service';
@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {
  public headers: any = ["Code", "City", "Pincode", "State", "Action"];
  public states: any;
  public cities: any = [];
  public cityObject: any = "";
  public cityName: any = "";
  public cityId: any = "";
  public cityName1: any = "";
  public stateName: any = "";
  public stateId: any = "";
  public isDeleted: any = "false";
  public stateId1: any = "";
  public stateModel: any = '';
  public stateModel1: any = '';
  public cityModel: any = '';
  public cityModel1: any = '';
  public cityPincodeModal1: any = '';
  public cityPincodeModal: any = '';
  public searchModel = '';
  public submitted: boolean = false;
  isCityExist: any;
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
    this.getStates();
    this.fetchAllCities();
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
    this.fetchAllCities();
  }
  createCity() {
    this.submitted = true;
    if (!this.isCityExist && this.cityModel != '' && this.cityPincodeModal != '') {
      let object: any = { 'cityName': this.cityModel, 'pincode': this.cityPincodeModal, "state": { 'stateId': this.stateModel } }
      this.configurationService.createCity(object).subscribe((data: any) => {
        window.scroll(0, 0);
        (<any>$('#myModal-add')).modal('hide');
        this.notification.notify('success', 'City Created Successfully!');
        this.fetchAllCities();
        this.clear();
      },
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something went wrong');
        }
      )
    }
  }
  fetchAllCities() {
    this.spinner.show();
    this.configurationService.fetchAllCities(this.searchModel,this.pageNumber).subscribe((data: any) => {
      this.spinner.hide();
      this.cityObject = data.data.content;
      this.handlePagination(data);
      this.cityObject.sort((a: any, b: any) => a.cityId - b.cityId);
      console.log(this.cityObject)
    },
      (error) => {
        this.spinner.hide();
      })
  }
  editCity(data: any) {
    this.cityId = data.cityId;
    this.cityModel1 = data.cityName;
    this.cityPincodeModal1 = data.pincode;
    this.stateModel1 = data.stateId;
  }
  updateCity() {
    this.submitted = true;
    if (!this.isCityExist && this.cityModel1 != '' && this.cityPincodeModal1 != '') {
      let object: any = { 'cityName': this.cityModel1, 'pincode': this.cityPincodeModal1, 'stateId': this.stateModel1 }
      this.configurationService.updateCity(this.cityId, object).subscribe((data: any) => {
        window.scroll(0, 0);
        (<any>$('#myModal-edit')).modal('hide');
        console.log(data)
        this.fetchAllCities();
        this.clear();
      })
    }
  }
  removeCity(data: any) {
    this.cityId = data.cityId;
  }
  deleteCity() {
    this.configurationService.deleteCity(this.cityId).subscribe((data: any) => {
      this.fetchAllCities();
    },
      (error:any) => {
        this.spinner.hide();
        let erroe:any=error.error.message;
        this.notification.notify("error",erroe);
      }
    )
  }
  getStates() {
    this.configurationService.fetchAllStates('').subscribe((data: any) => {
      this.states = data.data.content;
      console.log(this.states);
    })
  }
  clear() {
    this.cityModel = "";
    this.cityPincodeModal = "";
    this.stateModel = "";
    this.cityModel1 = "";
    this.cityPincodeModal1 = "";
    this.stateModel1 = "";
    this.submitted = false;
  }
  check() {
    this.isCityExist = false;
    let api = 'city/validate?name=' + this.cityModel + '&stateId=' + this.stateModel;
    this.crudOperationsService.validate(api)
      .subscribe((data: any) => {
        this.isCityExist = data;
      },
        (_error: any) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  check1() {
    this.isCityExist = false;
    let api = 'city/validate?name=' + this.cityModel1 + '&stateId=' + this.stateModel1;
    this.crudOperationsService.validate(api)
      .subscribe((data: any) => {
        this.isCityExist = data;
      },
        (_error: any) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
}
