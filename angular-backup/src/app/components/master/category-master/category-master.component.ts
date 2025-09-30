import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { EmployeeMastersService } from '../employee.masters.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { Sort } from '@angular/material/sort';
declare var $: any;

@Component({
  selector: 'app-category-master',
  templateUrl: './category-master.component.html',
  styleUrls: ['./category-master.component.css']
})
export class CategoryMasterComponent implements OnInit {

  public headers: any = ["Category Code", "Category Name", "Action"];

  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';

  public categoryMastersForm!: FormGroup;
  public editButtonEnable!: boolean;
  public categoryMasterList!: any[];
  public categoryObject!: any;
  public categoryMasterId!: any;
  public sortedData: any = [];
  public companyId!: number;
  public exist: boolean = false;
  public exist2: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public submitted: boolean = false;
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

  constructor(private formBuilder: FormBuilder, private employeMasterService: EmployeeMastersService,
    private notification: NotifierService, private spinner: NgxSpinnerService, private crudOperationsService: CrudOperationsService) { }

  ngOnInit(): void {

    this.categoryMastersForm = this.formBuilder.group({
      categoryCode: ['', Validators.required],
      categoryName: ['', Validators.required]
    })

    //get costcenter list
    this.fetchCategoryList()
  }

  get form_() { return this.categoryMastersForm.controls; };

  sortData(sort: Sort) {
    this.sortedData = this.crudOperationsService.sortData(sort, this.categoryMasterList);

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
    this.fetchCategoryList();
  }
  //clear form values
  modelShow() {
    this.exist = false;
    this.exist2 = false;
    this.categoryMastersForm.reset();
    //hide edit button
    this.editButtonEnable = false;

  }

  checkIfalreadyExist2(typedCode: any) {

    if (this.editButtonEnable == true) {
      let categoryMasterList2: any[] = this.categoryMasterList.filter(y => y.categoryId != this.categoryMasterId);

      let code: any[] = categoryMasterList2.filter(
        x => x.categoryCode.toLowerCase() == typedCode.toLowerCase());

      if (code.length > 0) {
        this.exist2 = true;
      } else {
        this.exist2 = false;
      }
    } else {
      let code: any[] = this.categoryMasterList.filter(
        x => x.categoryCode.toLowerCase() == typedCode.toLowerCase());

      if (code.length > 0) {
        this.exist2 = true;
      } else {
        this.exist2 = false;
      }
    }
  }
  checkIfalreadyExist(typedName: any) {

    if (this.editButtonEnable == true) {
      let categoryMasterList2: any[] = this.categoryMasterList.filter(y => y.categoryId != this.categoryMasterId);

      let name: any[] = categoryMasterList2.filter(
        x => x.categoryName.toLowerCase() == typedName.toLowerCase());

      if (name.length > 0) {
        this.exist = true;
      } else {
        this.exist = false;
      }
    } else {
      let name: any[] = this.categoryMasterList.filter(
        x => x.categoryName.toLowerCase() == typedName.toLowerCase());

      if (name.length > 0) {
        this.exist = true;
      } else {
        this.exist = false;
      }
    }
  }

  //get categoryMaster list
  fetchCategoryList() {
    this.spinner.show();
    this.companyId = Number(sessionStorage.getItem('companyId'));
    this.employeMasterService.getCategoryMasterList(this.companyId,this.pageNumber)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.categoryMasterList = data.data.content;
        this.sortedData = data.data.content;
        this.handlePagination(data);


      },
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Worng');
        })
  }


  public searchModel='';
  getCategoryListBySearchParam($event: any) {
    const param = $event.target.value;
    this.searchModel=param;
    if (param.trim() == "") {
      //geting agents list
      this.fetchCategoryList();
    }
    else {
      //alert($event.target.value);
      let api: any = "categorymaster/list/1?search=" + param + "&page=" + this.pageNumber + "&size=10";
      this.crudOperationsService.getList(api)
        .subscribe((data: any) => {
          this.categoryMasterList = data.data.content;
          this.sortedData=data.data.content;
          this.handlePagination(data);

          //spinner hide
          //this.spinner.hide();

        },
          (error) => {
            console.log(error);
            //spinner hide
            //this.spinner.hide();
          })
    }
  }

  editCategoryMaster(id: number) {
    //show edit button
    this.editButtonEnable = true;

    this.categoryMasterId = id;
    this.employeMasterService.getCategoryMasterById(id)
      .subscribe((data: any) => {
        const categoryListById = data.data[0]
        this.categoryMastersForm.patchValue({
          categoryCode: categoryListById.categoryCode,
          categoryName: categoryListById.categoryName
        })
      }
        ,
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })

  }
  updateCategoryMaster(id: number) {
    this.submitted = true;

    if (this.categoryMastersForm.valid == true && this.exist == false && this.exist2 == false) {

      this.categoryObject =
      {

        "categoryId": this.categoryMasterId,
        "categoryCode": this.categoryMastersForm.value.categoryCode,
        "categoryName": this.categoryMastersForm.value.categoryName,
        "company": {
          "companyId": this.companyId
        }
      }
      this.employeMasterService.updateCategoryMaster(this.categoryMasterId, this.categoryObject)
        .subscribe((data: any) => {
          this.submitted = false;

          this.notification.notify('success', data.message);
          $('#employeeModelPopup').modal('hide');
          //get designation list
          this.fetchCategoryList();
        }
          ,
          (error) => {
            this.notification.notify('error', 'Something Went Worng');
          })

    }
  }
  //delete categrory ListById
  deleteCategoryListById(id: number) {
    this.employeMasterService.deleteCategoryListById(id)
      .subscribe((data: any) => {
        if (data.status == 'success') {
          this.notification.notify('success', data.message);
        }
        this.fetchCategoryList();
      },
        (error) => {
          if (error.error.error == 'Conflict') {
            this.notification.notify('error', error.error.message);
          } else {
            this.notification.notify('error', 'Something Went Worng');
          }
        })
  }
  onSubmit() {
    this.submitted = true;

    if (this.categoryMastersForm.valid == true && this.exist == false && this.exist2 == false) {

      $('#employeeModelPopup').modal('hide');

      this.categoryObject =
      {
        "categoryCode": this.categoryMastersForm.value.categoryCode,
        "categoryName": this.categoryMastersForm.value.categoryName,
        "company": {
          "companyId": this.companyId
        }
      }
      this.employeMasterService.postCategoryMaster(this.categoryObject)
        .subscribe((data: any) => {
          this.notification.notify('success', data.message);
          this.submitted = false;

          //get designation list
          this.fetchCategoryList();
        }
          ,
          (error) => {
            this.notification.notify('error', 'Something Went Worng');
          })
    }

  }
}
