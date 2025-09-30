import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { EmployeeMastersService } from '../../master/employee.masters.service';
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { CrudOperationsService } from 'src/app/services/crud-operations.service';



interface IMonth {
  item_id: number;
  item_text: string;
}

@Component({
  selector: 'app-ctc-report',
  templateUrl: './ctc-report.component.html',
  styleUrls: ['./ctc-report.component.css']
})
export class CtcReportComponent implements OnInit {

  public modelDate = new Date();
  public minDate!: Date;
  public maxDate!: Date;
  public branchDetailsList!: any[];
  public departmentMasterList: any;
  public companyId!: number;
  public ctcForm: any;
  public selectType: any = "";
  public branch!: boolean;
  public department!: boolean;
  public year!: boolean;
  public month!: boolean;
  public submitted = false;

  public headers: any = ["Sr.No", "Branch", "Total Gross Salaray", "Total Deduction", "NetPay"];


  months: Array<IMonth> = [];
  selectedItems: Array<IMonth> = [];
  dropdownSettings: IDropdownSettings = {};

  constructor(private formBuilder: FormBuilder, private employeMasterService: EmployeeMastersService,
    private notification: NotifierService,private crudeService: CrudOperationsService,) {

    //setting date range
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setFullYear(this.minDate.getFullYear() - 10);
    this.maxDate.setDate(this.maxDate.getDate() + 7);

  }

  ngOnInit(): void {
    this.ctcForm = this.formBuilder.group({
      selectType: ['', Validators.required],
      year: ['', Validators.required],
      branch: ['', Validators.required],
      department: ['', Validators.required],

    })

    //multi monthsSelector
    this.multiMonthSelector();

    //fetch btranchDetailsList
    this.fetchBranchDetailsList();

    
  }


  //calaender popup 
  onOpenCalendar($event: any) {
    $event.monthSelectHandler = (event: any): void => {
      $event._store.dispatch($event._actions.select(event.date));
    };
    $event.setViewMode('year');

  }


  multiMonthSelector() {
    this.months = [
      { item_id: 1, item_text: "January" },
      { item_id: 2, item_text: "February" },
      { item_id: 3, item_text: "March" },
      { item_id: 4, item_text: "April" },
      { item_id: 5, item_text: "May" },
      { item_id: 6, item_text: "June" },
      { item_id: 7, item_text: "July" },
      { item_id: 8, item_text: "August" },
      { item_id: 9, item_text: "September" },
      { item_id: 10, item_text: "October" },
      { item_id: 11, item_text: "November" },
      { item_id: 12, item_text: "December" }
    ];
    this.selectedItems = [
      { item_id: 4, item_text: "Pune" },
      { item_id: 6, item_text: "Navsari" }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      defaultOpen: false,
      idField: "item_id",
      textField: "item_text",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 3
    };
  }

  onItemSelect(item: any) {
    console.log('onItemSelect', item);
  }
  onItemDeSelect(item: any) {
    console.log('onItem DeSelect', item);
  }

  onSelectAll(items: any) {
    console.log('onSelectAll', items);
  }

  onDropDownClose() {
    console.log('dropdown closed');
  }


  //change input fields based on selection
  onSelect() {
    //alert(this.selectType);



    if (this.ctcForm.value.selectType == "branch") {
      this.year = true;
      this.month = true;
      this.branch = false;
      this.department = false;


    }

    else if (this.ctcForm.value.selectType == "department") {
      this.year = true;
      this.month = true;
      this.branch = true;
      this.department = false;


    }

    else if (this.ctcForm.value.selectType == "grade") {
      this.year = true;
      this.month = true;
      this.branch = true;
      this.department = true;


    }

    else {
      this.year = false;
      this.month = false;
      this.branch = false;
      this.department = false;
    }
  }

  fetchBranchDetailsList() {
    //getting companyId from session-storage
    this.companyId = Number(sessionStorage.getItem('companyId'));
    return this.employeMasterService.getBranchMaster(this.companyId)
      .subscribe((data: any) => {

        this.branchDetailsList = data.data.content;
           
      }
        ,
        (error) => {
          this.notification.notify('error', 'Something Went Worng');
        })
  }

//calling departmments based on branchId
  onchangeBranch(){
    this.fetchEmployeesDePartments(this.ctcForm.value.branch)
   
  }


  //get Department List 
  fetchEmployeesDePartments(id:number) {
    //get companyId
    let api: any = "department/dropdownList_departments/" +id;
    this.crudeService.getList(api)
      .subscribe((data: any) => {

        this.departmentMasterList = data.data;

      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
        })
  }




  //get form controls
  get form() {
    return this.ctcForm.controls;
  }

  onSubmit() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.ctcForm.invalid) {
      return;
    }

  }

}
