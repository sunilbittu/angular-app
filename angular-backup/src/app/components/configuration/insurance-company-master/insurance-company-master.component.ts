import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-insurance-company-master',
  templateUrl: './insurance-company-master.component.html',
  styleUrls: ['./insurance-company-master.component.css']
})
export class InsuranceCompanyMasterComponent implements OnInit {
  constructor(private crudOperationsService: CrudOperationsService, private notification: NotifierService, private spinner: NgxSpinnerService) { }
  public headers: any = ["SNo", "Insurance Name", "Description", "Action"];
  public insuranceCompaniesId: any;
  public companiesList: any = [];
  public insuranceName: String = "";
  public discription: String = "";
  public discription1: String = "";
  public insuranceName1: String = "";
  public companyId: any = Number(sessionStorage.getItem("companyId"));
  public insuranceCompanyById: any;
  public insId: Number = 0;
  isIMExist: any;
  public searchModel = '';
  public submitted = false;
  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';
  public cancelClicked: boolean = false;
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
  ngOnInit(): void {
    this.getIMList();
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
    this.getIMList();
  }

  getIMList() {
    this.spinner.show();
    let api = "insurancecompany/list?companyId=" + this.companyId + '&remarks=' +'insurance'+ '&search=' + this.searchModel + "&page="+this.pageNumber+"&size=10";;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      console.log(data, "===data");
      this.companiesList = data.data.content;
      this.handlePagination(data);
    })
  }
  clear1() {
    this.insuranceName = "";
    this.discription = "";
    this.isIMExist = false;
    this.submitted = false;
  }
  clear2() {
    this.insuranceName1 = "";
    this.discription1 = "";
    this.isIMExist = false;
    this.submitted = false;
  }
  createInsuranceCompany() {
    this.submitted = true;
    if (!this.isIMExist && this.insuranceName && this.discription) {
      let Object = {
        insuranceCompaniesName: this.insuranceName,
        description: this.discription,
        remarks:'insurance',
        company: {
          companyId: this.companyId
        }
      }
      let api: any = "insurancecompany";
      this.crudOperationsService.create(Object, api).subscribe((data: any) => {
        this.notification.notify('success', data.message);
        (<any>$('#myModal-add')).modal('hide');
        this.ngOnInit();
        this.clear1();
      }, (error) => {
        this.notification.notify('error', 'something went wrong');
      })
    }
  }
  updateInsuranceCompany() {
    this.submitted = true;
    if (!this.isIMExist && this.insuranceName1 && this.discription1) {
      let Object = {
        "insuranceCompaniesId": this.insuranceCompanyById.insuranceCompaniesId,
        "insuranceCompaniesName": this.insuranceName1,
        "description": this.discription1,
        "remarks":'insurance',
      }
      let api: any = "insurancecompany/" + this.insuranceCompanyById.insuranceCompaniesId;
      this.crudOperationsService.update(Object, api).subscribe((data: any) => {
        this.notification.notify("success", data.message);
        (<any>$('#myModal-edit')).modal('hide');
        this.ngOnInit();
        this.clear2();
      },
        (error) => {
          this.notification.notify('error', 'something went wrong')
        }
      )
    }
  }
  editInsurance(id: Number) {
    let api: any = "insurancecompany/" + id;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      console.log("find BY Id:-", data)
      this.insuranceCompanyById = data.data;
      this.insuranceName1 = this.insuranceCompanyById.insuranceCompaniesName,
        this.discription1 = this.insuranceCompanyById.description
    },
      (error) => {
        this.notification.notify('error', 'Somethinng Went Wrong');
      })
  }
  deleteInsurance(id: any) {
    let api: any = "insurancecompany/" + id;
    this.crudOperationsService.delete(api).subscribe((data: any) => {
      if (data.status == 'success') {
        this.notification.notify('success', data.message);
      }
      this.getIMList();
    },
      (error) => {
        if (error.error.error == 'Conflict') {
          this.notification.notify('error', error.error.message);
        } else {
          this.notification.notify('error', 'Something Went Worng');
        }
      })
  }
  removeInsurance(id: Number) {
    this.insId = id;
  }
  check() {
    this.isIMExist = false;
    let api = 'insurancecompany/validate?name=' + this.insuranceName;
    this.crudOperationsService.validate(api)
      .subscribe((data: any) => {
        this.isIMExist = data;
      },
        (_error: any) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
  check1() {
    this.isIMExist = false;
    let api = 'insurancecompany/validate?name=' + this.insuranceName1;
    this.crudOperationsService.validate(api)
      .subscribe((data: any) => {
        this.isIMExist = data;
      },
        (_error: any) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }
}
