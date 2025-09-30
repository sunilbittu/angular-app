import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-employee-goal-setting',
  templateUrl: './employee-goal-setting.component.html',
  styleUrls: ['./employee-goal-setting.component.css']
})
export class EmployeeGoalSettingComponent implements OnInit {

  public kpaList: any = [];
  public companyId = Number(sessionStorage.getItem("companyId"));
  public employeeId: any;
  public dropdownSettingsBranch: any;
  public selectedItemsBranch: any;
  public toogleGoals: boolean = false;
  public investmentYear: any = [];
  public yearModel: any = "";
  public employeeData: any;
  public financialYearId: any;
  public designation: any;
  public kpaWeighttage: Number = 0;
  public targetResults: any = "";
  public obj: any = {};
  public kpaTableData: any = [];
  public togglelist1: boolean = false;
  public managerName: any = "";
  public statusList: any = [];
  public isnotFinalized: boolean = true;

  public togglelist: boolean = false;
  public submitted: boolean = false;
  public Array: any = [];
  public warningAlert: boolean = false;
  public warningAlert1: boolean = false;
  public togglebtn: boolean = true;
  public selectedItemsBranch1: any = [];
  constructor(public crudOperationsService: CrudOperationsService, private spinner: NgxSpinnerService) {


  }
  ngOnInit(): void {
    if (sessionStorage.getItem("review") == "true") {
      this.employeeId = Number(sessionStorage.getItem("reviewemp"));
      sessionStorage.setItem("review", "false");
    } else {
      this.employeeId = Number(sessionStorage.getItem("empId"));
    }


    //manager
    this.spinner.show();
    this.designation = sessionStorage.getItem("designation");
    this.crudOperationsService.getList('employee/get_employee_reporting/' + Number(sessionStorage.getItem('empId')))
      .subscribe((data: any) => {
        this.spinner.hide();
        this.managerName = data.data.firstName;
      },
        (error) => {
          this.spinner.hide();
        })

    let url = "financialyear/list-by/" + this.companyId;
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      console.log(data);
      this.investmentYear = data.data.content;
    });

    let empUrl = "employee/" + this.employeeId;
    this.crudOperationsService.getList(empUrl).subscribe((data: any) => {
      if (data)
        this.employeeData = data.data;

    },
      (error) => {
        this.spinner.hide();
      })
  }// ngonit closing


  onSelectAllBranch(data: any) {
    console.log('data2', data);
    this.selectedItemsBranch = data;
  }
  onItemSelect(item: any) {
    console.log(item);
    this.selectedItemsBranch1.push(item)
    console.log(this.selectedItemsBranch1);
    // for(let i=0;i<this.selectedItemsBranch.length;i++){
    //   if(this.selectedItemsBranch1[i]?.kpaWeighttage == undefined){
    //      this.selectedItemsBranch1.push(this.selectedItemsBranch[i])
    //   }
    // }

  }
  public deletedGoals: any = [];
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItemsBranch);
    for (let i = 0; i < this.selectedItemsBranch1.length; i++) {
      // if(this.selectedItemsBranch1[i].employeeGoalSettingId != null){
      //   this.deletedGoals.push(this.selectedItemsBranch1[i].isDeleted=true)
      //   // alert('deleted');
      //   // console.log(this.selectedItemsBranch1[i])
      // }
      if (this.selectedItemsBranch1[i].kpaId == item.kpaId) {
        // if(this.selectedItemsBranch1[i].employeeGoalSettingId != null){
        //   this.selectedItemsBranch1[i].isDeleted=true;
        //   this.deletedGoals.push(this.selectedItemsBranch1[i].isDeleted=true)
        //   alert('test');
        // }

        this.selectedItemsBranch1.splice(i, 1);
      }
    }
  }
  appendKap() {
    // console.log('this.kpaList',this.kpaList)
    // let totalweightage=0;
    let Arr: any[] = [];
    // debugger;
    // alert('1111'+this.selectedItemsBranch1);
    // this.selectedItemsBranch1=[];

    for (let i = 0; i < this.selectedItemsBranch.length; i++) {
      let obj: any = {};
      // console.log('test',this.selectedItemsBranch1[i]?.kpaWeighttage)

      obj.kpaId = this.selectedItemsBranch[i].kpaId;
      obj.kpaName = this.selectedItemsBranch[i].kpaName;
      if (this.selectedItemsBranch1[i]?.kpaWeighttage != undefined) {

        obj.kpaWeighttage = this.selectedItemsBranch1[i].kpaWeighttage;
        obj.targetedResults = this.selectedItemsBranch1[i].targetedResults;
        obj.managerRemarks = this.selectedItemsBranch1[i].managerRemarks;
      }
      Arr.push(obj);
      // if(this.selectedItemsBranch1[i]?.kpaWeighttage != undefined  ){
      // alert(i+this.selectedItemsBranch1[i]?.kpaWeighttage)

      //   obj.kpaId=this.selectedItemsBranch[i].kpaId;
      //   obj.kpaName=this.selectedItemsBranch[i].kpaName;
      //   obj.kpaWeighttage=this.selectedItemsBranch1[i].kpaWeighttage;
      //   obj.targetedResults=this.selectedItemsBranch1[i].targetedResults;
      // }
      // else{

      //   obj.kpaId=this.selectedItemsBranch[i].kpaId;
      //   obj.kpaName=this.selectedItemsBranch[i].kpaName;
      //   // for(let j=0;j<this.selectedItemsBranch.length;j++){
      //   //   if((this.selectedItemsBranch[i].kpaId !=this.selectedItemsBranch1[j]?.kpaId) || this.selectedItemsBranch1.length==0){
      //   //     this.selectedItemsBranch1.push(obj)
      //   //   }
      //   // }

      // }
    }
    alert(this.selectedItemsBranch1.length);
    console.log(this.selectedItemsBranch1)
    for (var i = 0; i < Arr.length; i++) {
      // for(let j=0;j<this.selectedItemsBranch1.length;j++){
      //   if((Arr[i].kpaId !=this.selectedItemsBranch1[j]?.kpaId) || this.selectedItemsBranch1.length ==0 ){
      //     console.log(this.selectedItemsBranch1)
      //     alert('aaaaa');
      //   }
      // }
      this.selectedItemsBranch1.push(Arr[i]);

    }
    // console.log(this.selectedItemsBranch1)

    console.log('branch', this.selectedItemsBranch1);
    // console.log('sele',this.selectedItemsBranch)
    this.toogleGoals = true;
    this.selectedItemsBranch1.filter((v: any, i: any, a: any) => a.findIndex((t: any) => (t.kpaId == v.kpaId)) === i);
    //   console.log('filer',this.selectedItemsBranch1)
    //   var filterArray = this.selectedItemsBranch1.reduce((accumalator:any, current:any) => {
    //     if(!accumalator.some((item:any) => item.id != current.id )) {
    //       accumalator.push(current);
    //     }
    //     return accumalator;
    // },[]);
    // console.log(filterArray)
  }

  getKpaList() {
    this.checkWeatherPMSFinalizedOrNot();


    let api1 = "employeegoalsetting/list_employee_financialyear/" + this.employeeId + "/" + Number(this.yearModel);
    this.crudOperationsService.getList(api1).subscribe((data: any) => {
      if (data.data.length != 0) {
        this.togglelist = true;
        this.togglelist1 = false;
      }
      else {
        this.togglelist = false;
        this.togglelist1 = true;
      }
      this.kpaTableData = data.data;


    });

    let api = "goal_kpa/list_employee_financialyear2/" + this.employeeId + "/" + Number(this.yearModel);
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      console.log('dat==', data)
      this.kpaList = data.data;

      let api = "employeegoalsetting/employees_list_by_manager_status/" + this.employeeId + "/" + Number(this.yearModel);
      this.crudOperationsService.getList(api).subscribe((data: any) => {
        console.log('dat==', data)
        this.statusList = data.data;
      });

      this.dropdownSettingsBranch = {
        singleSelection: false,
        enableCheckAll: false,
        idField: 'kpaId',
        textField: 'kpaName',
        // selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        classes: "myclass custom-class",
        itemsShowLimit: 3,
        allowSearchFilter: false,
        closeDropDownOnSelection: false,
        showSelectedItemsAtTop: false,
        limitSelection: -1,
        clearSearchFilter: true,
        defaultOpen: false


      };

    })

  }
  public x: any = [{ kpaId: 1110, kpaName: "Kpa1" }, { kpaId: 1111, kpaName: "KPA2" }];
  editGoals() {
    this.togglebtn = false;
    this.togglelist1 = true;
    this.togglelist = false;
    this.selectedItemsBranch = this.kpaTableData;
    this.selectedItemsBranch1 = this.kpaTableData;

  }
  // public totalweightage:number=0;
  onSubmit(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      var totalweightage = 0;
      let Arr: any[] = [];
      for (let i = 0; i < this.selectedItemsBranch1.length; i++) {
        let obj: any = {};
        totalweightage = totalweightage + Number(this.selectedItemsBranch1[i].kpaWeighttage)
        obj.goalKpa = { 'kpaId': this.selectedItemsBranch1[i].kpaId };
        obj.employee = { 'employeeId': this.employeeId };
        obj.financialYear = { 'financialYearId': Number(this.yearModel) };
        obj.kpaWeighttage = Number(this.selectedItemsBranch1[i].kpaWeighttage);
        obj.targetedResults = this.selectedItemsBranch1[i].targetedResults;
        obj.managerRemarks = this.selectedItemsBranch1[i].managerRemarks;
        Arr.push(obj)
      }
      let alert = false;
      alert = Arr.some((value) => {
        return value.kpaWeighttage > 50
      })
      console.log('alert', alert);
      if (alert) {
        this.warningAlert1 = true;
        setTimeout(() => {
          this.warningAlert1 = false;
        }, 10000);
      }
      console.log("hhhh", totalweightage)

      if (totalweightage != 100) {
        this.warningAlert = true;
        setTimeout(() => {
          this.warningAlert = false;
        }, 10000);
      }
      if ((totalweightage == 100) && (alert == false)) {
        let saveApi = "employeegoalsetting";

        this.crudOperationsService.create(Arr, saveApi).subscribe((data) => {
          this.getKpaList();
          this.submitted = false;
        });
      }

    }
  }
  onUpdate(uploadForm: NgForm) {
    // employeegoalsetting
    this.submitted = true;
    if (uploadForm.valid) {
      var totalweightage = 0;
      let Arr: any[] = [];
      for (let i = 0; i < this.selectedItemsBranch1.length; i++) {
        let obj: any = {};
        totalweightage = totalweightage + Number(this.selectedItemsBranch1[i].kpaWeighttage)
        obj.goalKpa = { 'kpaId': this.selectedItemsBranch1[i].kpaId };
        obj.employee = { 'employeeId': this.employeeId };
        obj.financialYear = { 'financialYearId': Number(this.yearModel) };
        obj.kpaWeighttage = Number(this.selectedItemsBranch1[i].kpaWeighttage);
        obj.targetedResults = this.selectedItemsBranch1[i].targetedResults;
        obj.managerRemarks = this.selectedItemsBranch1[i].managerRemarks;
        obj.employeeGoalSettingId = this.selectedItemsBranch1[i].employeeGoalSettingId;
        Arr.push(obj)
      }
      for (let i = 0; i < this.selectedItemsBranch1.length; i++) {

      }
      let alert = false;
      alert = Arr.some((value) => {
        return value.kpaWeighttage > 50
      })
      console.log('alert', alert);
      if (alert) {
        this.warningAlert1 = true;
        setTimeout(() => {
          this.warningAlert1 = false;
        }, 10000);
      }
      console.log("hhhh", totalweightage)

      if (totalweightage != 100) {
        this.warningAlert = true;
        setTimeout(() => {
          this.warningAlert = false;
        }, 10000);
      }
      if ((totalweightage == 100) && (alert == false)) {
        let saveApi = "employeegoalsetting/" + this.employeeId;
        // let totalArray=  Arr.concat(this.deletedGoals);
        this.crudOperationsService.update(Arr, saveApi).subscribe((data) => {
          this.getKpaList();
          this.submitted = false;
          this.isnotFinalized = false;
          setTimeout(() => {
            this.isnotFinalized = true;
          }, 2000);

        });
      }

    }
  }

  checkWeatherPMSFinalizedOrNot() {
    this.employeeId = Number(sessionStorage.getItem("empId"));
    let url = "employeeratingandscore/employee_rating_by_financialyear/" + this.employeeId + "/" + Number(this.yearModel);
    this.crudOperationsService.getList(url).subscribe((data: any) => {
      if (data.data.isFinalized == true)
        this.isnotFinalized = false;
      console.log('aaaaa', data);

    });
  }

}
