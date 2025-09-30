import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';
import { NgxSpinnerService } from 'ngx-spinner';

//import { deepStrictEqual } from 'assert';
declare var $: any;


@Component({
  selector: 'app-currency-type',
  templateUrl: './currency-type.component.html',
  styleUrls: ['./currency-type.component.css']
})
export class CurrencyTypeComponent implements OnInit {
  public employees: any = [
    { currencyCode: '123', currencyName: 'Teacher' },
    { currencyCode: '123', currencyName: 'Teacher' }
  ]


  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are you sure you want delete';

  public headers: any = ["Currency Code", "Currency Name", "Action"];


  public exist: boolean = false;
  public exist2: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public submitted: boolean = false;


  public currencyMastersForm!: FormGroup;
  public editButtonEnable!: boolean;
  public currencyList!: any[];
  public currencyObject!: any;
  public currencyId!: any;
  public currencyMasterList!: any[];

  public companyId!: number;

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
    private notification: NotifierService, private crudOperationsService: CrudOperationsService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    console.log(this.editButtonEnable, "editbutton value")
    this.currencyMastersForm = this.formBuilder.group({

      currencyCode: ['', Validators.required],
      currencyName: ['', Validators.required]
    })

    //get currency list
    this.fetchCurrencyList();
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
    this.fetchCurrencyList();
  }
  get form_() { return this.currencyMastersForm.controls; };



  //clear form values
  modelShow() {
    console.log(this.editButtonEnable, "editbutton value")

    this.exist = false;
    this.exist2 = false;
    this.currencyMastersForm.reset();
    //hide edit button
    this.editButtonEnable = false;

  }

  //get currency list
  fetchCurrencyList() {
    //getting companyId from session-storage
    this.spinner.show();
    this.companyId = Number(sessionStorage.getItem('companyId'));
    this.employeMasterService.getCurrencyList(this.companyId,this.pageNumber)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.currencyList = data.data.content;
        this.handlePagination(data);
      },
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Worng');
        })
  }

  checkIfalreadyExist2(typedCode: any) {
    console.log(this.editButtonEnable, "editbutton value")

    if (this.editButtonEnable == true) {

      let currencyList2: any[] = this.currencyList.filter(y => y.currencyId != this.currencyId);

      let code: any[] = currencyList2.filter(
        x => x.currencyCode.toLowerCase() == typedCode.toLowerCase());

      if (code.length > 0) {
        this.exist2 = true;
      } else {
        this.exist2 = false;
      }
    } else {
      let code: any[] = this.currencyList.filter(
        x => x.currencyCode.toLowerCase() == typedCode.toLowerCase());

      if (code.length > 0) {
        this.exist2 = true;
      } else {
        this.exist2 = false;
      }
    }


  }


  checkIfalreadyExist(typedName: any) {

    if (this.editButtonEnable == true) {

      let currencyList2: any[] = this.currencyList.filter(y => y.currencyId != this.currencyId);
      let name: any[] = currencyList2.filter(
        x => x.currencyName.toLowerCase() == typedName.toLowerCase());

      if (name.length > 0) {
        this.exist = true;
      } else {
        this.exist = false;
      }
    } else {
      let name: any[] = this.currencyList.filter(
        x => x.currencyName.toLowerCase() == typedName.toLowerCase());

      if (name.length > 0) {
        this.exist = true;
      } else {
        this.exist = false;
      }
    }



  }


  //update currency master
  updateCurrencyMaster(id: number) {
    console.log(this.editButtonEnable, "editbutton value")


    this.submitted = true;

    if (this.currencyMastersForm.valid == true && this.exist == false && this.exist2 == false) {

      this.currencyObject =
      {

        "currencyId": this.currencyId,
        "currencyCode": this.currencyMastersForm.value.currencyCode,
        "currencyName": this.currencyMastersForm.value.currencyName,

        "company": {
          "companyId": this.companyId
        }

      }

      this.employeMasterService.updateCurrencyMaster(this.currencyId, this.currencyObject)
        .subscribe((data: any) => {
          this.submitted = false;

          this.notification.notify('success', data.message);
          $('#employeeModelPopup').modal('hide');
          //get currency list
          this.fetchCurrencyList();
        }
          ,
          (error) => {
            this.notification.notify('error', 'Something Went Worng');
          })

    }
  }


  //delete currencyMaster
  deleteCurrencyById(id: number) {
    console.log(this.editButtonEnable, "editbutton value")

    this.employeMasterService.deleteCurrencyListById(id)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        //get currency list
        this.fetchCurrencyList();
      }
        ,
        (error:any) => {
          this.spinner.hide();
          let erroe:any=error.error.message;
          this.notification.notify("error",erroe);
        })
  }

  //append form controls
  editCurrency(id: number) {
    console.log(this.editButtonEnable, "editbutton value")


    //show edit button
    this.editButtonEnable = true;

    this.currencyId = id

    this.employeMasterService.getCurrencyMasterById(id)
      .subscribe((data: any) => {
        const currencyListById = data.data[0]
        this.currencyMastersForm.patchValue({
          currencyCode: currencyListById.currencyCode,
          currencyName: currencyListById.currencyName
        })
      }
        ,
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }


  //submit form data
  onSubmit() {
    console.log(this.editButtonEnable, "editbutton value")

    this.submitted = true;

    if (this.currencyMastersForm.valid == true && this.exist == false && this.exist2 == false) {

      $('#employeeModelPopup').modal('hide');

      this.currencyObject =
      {


        "currencyCode": this.currencyMastersForm.value.currencyCode,
        "currencyName": this.currencyMastersForm.value.currencyName,

        "company": {
          "companyId": this.companyId
        }

      }

      console.log(this.currencyObject)

      this.employeMasterService.postCurrencyMaster(this.currencyObject)
        .subscribe((data: any) => {
          this.notification.notify('success', data.message);
          this.submitted = false;

          //get currency list
          this.fetchCurrencyList();
        }
          ,

          (error) => {

            error instanceof HttpErrorResponse

            console.log(error)

            if (error.error.status == 406) {

              this.notification.notify('error', 'CurrencyName/CurrencyCode Already Exits');
            }

            else {

              this.notification.notify('error', 'Something Went Wrong');

            }
          })
    }
  }

  getCurrencyListBySearchParam($event: any) {
    console.log(this.editButtonEnable, "editbutton value")

    const param = $event.target.value;

    if (param.trim() == "") {
      //geting agents list
      this.fetchCurrencyList();
    }

    else {
      //alert($event.target.value);



      let api: any = "currency/list_company/1?search=" + param+"&page="+this.pageNumber+"&size=10";

      this.crudOperationsService.getList(api)
        .subscribe((data: any) => {
          this.currencyList = data.data.content;
          this.handlePagination(data);


          //spinner hide
          this.spinner.hide();

        },
          (error) => {

            console.log(error);
            this.notification.notify('error', 'Something Went Wrong');

            //spinner hide
            //this.spinner.hide();




          })


    }




  }


}

