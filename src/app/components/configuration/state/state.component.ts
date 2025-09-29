import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { ConfigurationService } from '../configuration.service';
@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css']
})
export class StateComponent implements OnInit {
  public headers: any = ["Id", "State", "Country", "Action"];
  public countries: any[] = [];
  public states: any = [];
  public stateObject: any = "";
  public stateName: any = "";
  public stateId: any = "";
  public stateName1: any = "";
  public countryName: any = "";
  public countryId: any = "";
  public isDeleted: any = "false";
  public countryId1: any = "";
  public countryModel: any = '';
  public countryModel1: any = '';
  public stateModel: any = '';
  public stateModel1: any = '';
  public isStateExist: boolean = false;
  public searchModel = '';
  public submitted = false;
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
    this.getCountries();
    this.fetchAllStates();
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
    this.fetchAllStates();
  }

  createState() {
    this.submitted = true;
    if (!this.isStateExist && this.stateModel != '') {
      let object: any = { "stateName": this.stateModel, "country": { "countryId": this.countryModel } }
      this.configurationService.createState(object).subscribe((data: any) => {
        window.scroll(0, 0);
        (<any>$('#myModal-add')).modal('hide');
        this.fetchAllStates();
        this.clear();
      })
    }
  }
  fetchAllStates() {
    this.spinner.show();
    this.configurationService.fetchAllStates(this.searchModel,this.pageNumber).subscribe((data: any) => {
      //console.log(data.data);
      this.spinner.hide();
      this.stateObject = data.data.content;
      this.handlePagination(data);
      this.stateObject.sort((a: any, b: any) => a.stateId - b.stateId);
    },
      (error) => {
        this.spinner.hide();
        this.notification.notify('error', 'Something Went Worng');
      })
  }
  editState(data: any) {
    this.stateId = data.stateId;
    this.stateModel1 = data.stateName;
    this.countryModel1 = data.countryId;
  }
  updateState() {
    this.submitted = true;
    if (!this.isStateExist && this.stateModel1 != '') {
      let object: any = { 'stateName': this.stateModel1, 'country': { "countryId": this.countryModel1 } }
      this.configurationService.updateState(this.stateId, object).subscribe((data: any) => {
        window.scroll(0, 0);
        (<any>$('#myModal-edit')).modal('hide');
        console.log(data)
        this.fetchAllStates();
        this.clear();
      })
    }
  }
  removeState(data: any) {
    this.stateId = data.stateId;
  }
  deleteState() {
    this.configurationService.deleteState(this.stateId).subscribe((data: any) => {
      console.log(data)
      this.fetchAllStates();
    },
    (error:any) => {
      this.spinner.hide();
      let erroe:any=error.error.message;
      this.notification.notify("error",erroe);
    })
  }
  getCountries() {
    this.configurationService.fetchCountries().subscribe((data: any) => {
      this.countries = data.data.content;
      console.log(this.countries);
    })
  }
  clear() {
    this.stateModel = "";
    this.countryModel = "";
    this.stateModel1 = "";
    this.countryModel1 = "";
    this.submitted = false;
  }
  check() {
    this.isStateExist = false;
    let api = 'state/validate?name=' + this.stateModel + '&countryId=' + this.countryModel;
    this.crudOperationsService.validate(api)
      .subscribe((data: any) => {
        this.isStateExist = data;
      },
        (_error: any) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }

  check1() {
    this.isStateExist = false;
    let api = 'state/validate?name=' + this.stateModel1 + '&countryId=' + this.countryModel1;
    this.crudOperationsService.validate(api)
      .subscribe((data: any) => {
        this.isStateExist = data;
      },
        (_error: any) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
}
