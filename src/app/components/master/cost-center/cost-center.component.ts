import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { EmployeeMastersService } from '../employee.masters.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { Sort } from '@angular/material/sort';

declare var $: any;

@Component({
  selector: 'app-cost-center',
  templateUrl: './cost-center.component.html',
  styleUrls: ['./cost-center.component.css']
})
export class CostCenterComponent implements OnInit {

  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';

  public costCenterMastersForm!: FormGroup;
  public editButtonEnable!: boolean;
  public costCenterMasterList!: any[];
  public costCenterObject!: any;
  public costCenterMasterId!: any;
  public companyId!: number;
  public exist: boolean = false;
  public exist2: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public submitted: boolean = false;
  public sortedData: any = [];
  public headers: any = ["Cost Center Code", "Cost Center Name", "Action"];
  public employees: any = [
    { costCenterCode: '123', costCenterName: 'BB' },
    { costCenterCode: '123', costCenterName: 'BB' }
  ]
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

    this.costCenterMastersForm = this.formBuilder.group({

      costCenterCode: ['', Validators.required],
      costCenterName: ['', Validators.required]
    })

    //get designation list
    this.fetchCostCenterList()
  }

  get form_() { return this.costCenterMastersForm.controls; };
  sortData(sort: Sort) {
    this.sortedData = this.crudOperationsService.sortData(sort, this.costCenterMasterList);

  }
  //clear form values
  modelShow() {
    this.exist = false;
    this.exist2 = false;
    this.costCenterMastersForm.reset();
    //hide edit button
    this.editButtonEnable = false;

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
    this.fetchCostCenterList();
  }
  checkIfalreadyExist2(typedCode: any) {

    if (this.editButtonEnable == true) {
      let costCenterMasterList2: any[] = this.costCenterMasterList.filter(y => y.costCenterId != this.costCenterMasterId);

      let code: any[] = costCenterMasterList2.filter(
        x => x.costCenterCode.toLowerCase() == typedCode.toLowerCase());

      if (code.length > 0) {
        this.exist2 = true;
      } else {
        this.exist2 = false;
      }
    } else {
      let code: any[] = this.costCenterMasterList.filter(
        x => x.costCenterCode.toLowerCase() == typedCode.toLowerCase());

      if (code.length > 0) {
        this.exist2 = true;
      } else {
        this.exist2 = false;
      }
    }
  }
  checkIfalreadyExist(typedName: any) {

    if (this.editButtonEnable == true) {
      let costCenterMasterList2: any[] = this.costCenterMasterList.filter(y => y.costCenterId != this.costCenterMasterId);

      let name: any[] = costCenterMasterList2.filter(
        x => x.costCenterName.toLowerCase() == typedName.toLowerCase());

      if (name.length > 0) {
        this.exist = true;
      } else {
        this.exist = false;
      }
    } else {
      let name: any[] = this.costCenterMasterList.filter(
        x => x.costCenterName.toLowerCase() == typedName.toLowerCase());

      if (name.length > 0) {
        this.exist = true;
      } else {
        this.exist = false;
      }
    }
  }
  //get costcenter list
  fetchCostCenterList() {
    this.spinner.show();
    this.companyId = Number(sessionStorage.getItem('companyId'));
    this.employeMasterService.getCostCenterMasterList(this.companyId,this.pageNumber)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.costCenterMasterList = data.data.content;
        this.sortedData = data.data.content;
        this.handlePagination(data);


      },
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Worng');
        })
  }

  public searchModel = '';
  getCostCenterListBySearchParam($event: any) {
    const param = $event.target.value;
    this.searchModel = param;
    if (param.trim() == "") {
      //geting agents list
      this.fetchCostCenterList();
    }
    else {
      //alert($event.target.value);
      let api: any = "costcentermaster/list/1?search=" + param + "&page=" + this.pageNumber + "&size=10";
      this.crudOperationsService.getList(api)
        .subscribe((data: any) => {
          this.costCenterMasterList = data.data.content;
          this.sortedData = data.data.content;
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


  //delete costcenter
  deleteCostCenterById(id: number) {
    this.employeMasterService.deleteCostCenterListById(id)
      .subscribe((data: any) => {
        if (data.status == 'success') {
          this.notification.notify('success', data.message);
        }
        this.fetchCostCenterList();
      },
        (error) => {
          if (error.error.error == 'Conflict') {
            this.notification.notify('error', error.error.message);
          } else {
            this.notification.notify('error', 'Something Went Worng');
          }
        })
  }
  editCostCenter(id: number) {
    this.editButtonEnable = true

    this.costCenterMasterId = id;
    this.employeMasterService.getCostCenterMasterById(id)
      .subscribe((data: any) => {
        const costCenterListById = data.data[0]
        this.costCenterMastersForm.patchValue({
          costCenterCode: costCenterListById.costCenterCode,
          costCenterName: costCenterListById.costCenterName
        })
      }
        ,
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }

  updateCostCenterMaster(id: number) {

    this.submitted = true;

    if (this.costCenterMastersForm.valid == true && this.exist == false && this.exist2 == false) {

      this.costCenterObject =
      {
        "costCenterId": this.costCenterMasterId,
        "costCenterCode": this.costCenterMastersForm.value.costCenterCode,
        "costCenterName": this.costCenterMastersForm.value.costCenterName,
        "company": {
          "companyId": this.companyId
        }
      }
      this.employeMasterService.updateCostCenterMaster(this.costCenterMasterId, this.costCenterObject)
        .subscribe((data: any) => {
          this.notification.notify('success', data.message);
          this.submitted = false;

          $('#employeeModelPopup').modal('hide');
          //get designation list
          this.fetchCostCenterList();
        }
          ,
          (error) => {
            this.notification.notify('error', 'Something Went Worng');
          })

    }
  }
  onSubmit() {
    this.submitted = true;

    if (this.costCenterMastersForm.valid == true && this.exist == false && this.exist2 == false) {
      $('#employeeModelPopup').modal('hide');

      this.costCenterObject =
      {
        "costCenterCode": this.costCenterMastersForm.value.costCenterCode,
        "costCenterName": this.costCenterMastersForm.value.costCenterName,
        "company": {
          "companyId": this.companyId
        }
      }
      this.employeMasterService.postCostCenterMaster(this.costCenterObject)
        .subscribe((data: any) => {
          this.notification.notify('success', data.message);
          this.submitted = false;

          //get designation list
          this.fetchCostCenterList();
        }
          ,
          (error) => {
            this.notification.notify('error', 'Something Went Worng');
          })

    }

  }

}
