import { APP_ID, Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { NotifierService } from 'angular-notifier';
@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.css']
})
export class HolidaysComponent implements OnInit {
  public holidayHeaders: any = ["Serial No.", "Holiday", "Date", "Project Name", "Action"];
  public holidayObject: any = [];
  public weekOffHeaders: any = ["Week OFF Days"];
  public weekOffData: any = [
    { day: 'Monday' }, { day: 'Tuesday' }, { day: 'Wednesday' }, { day: 'Thrusday' }, { day: 'Friday' }, { day: 'Saturday' }, { day: 'Sunday' }
  ]
  public weekOffObject: any;
  public years: any = [2021, 2020, 2019, 2018, 2017];
  public branches: any;
  public holidayTypes: any[] = ['Holiday', 'Restrict Holiday'];
  public role: any;
  public holidayName: any;
  public holidayDate: any;
  public holidayType: any;
  public holidayDate1: any;
  public holidayName1: any;
  public holidayType1: any;
  public holidaysId: any;
  public weekOffId: any;
  public companyId = Number(sessionStorage.getItem('companyId'));
  public selectAllModel: any;
  public branchNameModel: any = "";
  public filterHolidayList: any = [];
  public weekOffList: any = [];
  public yearModel: any = "";
  public toggleTitle: any = "Add";
  public togglebtn: boolean = true;
  public branchName: any;
  public tempBranchesList: any;
  constructor(public crudOperationsService: CrudOperationsService,private notification: NotifierService, private spinner: NgxSpinnerService) { }
  ngOnInit(): void {
    this.role = sessionStorage.getItem("role");
    this.fetchBranches();
   
  }
  filterBranch() {
    this.filterHolidayList = [];
    this.branchName = this.branchNameModel;
    this.fetchHoliday();
    this.fetchWeekOff();
    
    //console.log('aaa', this.filterHolidayList);
  }
  createHoliday() {
    let array = [];
    for (let i = 0; i < this.tempBranchesList.length; i++) {
      if(this.tempBranchesList[i].isSelected) {
        array.push(this.tempBranchesList[i].projectName);
      }
    }
   // console.log('filtered array : ', array);
    let object = {
      "holidayName": this.holidayName,
      "holidayDate": this.holidayDate,
      "holidayType": this.holidayType,
      "branchDetails": array,
      "company": { "companyId": sessionStorage.getItem("companyId") }
    }
    console.log('obj', object)
    this.crudOperationsService.create(object, 'holiday').subscribe((data: any) => {
      console.log(data);
      this.fetchHoliday();
      (<any>$('#addModal')).modal('hide');
      this.notification.notify('success', data.message);
      this.cancel()
    }, 
    (error) => {
      this.notification.notify('error', 'Something Went Worng');
    })
  }
  fetchHoliday() {
    this.holidayObject=[];
    this.filterHolidayList=[];
    let api: any = 'holiday/list?companyId=' + sessionStorage.getItem("companyId");
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.holidayObject = data.data;
      //this.filterBranch();
      for (let i = 0; i < this.holidayObject.length; i++) {
        let date = new Date(this.holidayObject[i].holidayDate);
        let year = date.getFullYear();
        for (let j = 0; j < this.holidayObject[i].branchDetails.length; j++) {
          //console.log('name', this.branchNameModel);
         // console.log('test', this.holidayObject[i].branchDetails[j]);
          // if((this.branchNameModel==this.holidayObject[i].branchDetails[j]) && Number(this.yearModel) ==year){
          if (((this.branchNameModel == this.holidayObject[i].branchDetails[j])) || (this.holidayObject[i].branchDetails[j] == "Select All")) {
            this.filterHolidayList.push(this.holidayObject[i]);
            
           // console.log('111', this.filterHolidayList);
          }
          else {
            // alert('aaa')
          }
        }
      }
    })
  }
  // let api:any='documentmaster/list?companyId='+sessionStorage.getItem("companyId")+'&search=&page&size=10';
  checkUncheckAll() {
    console.log(this.selectAllModel);
    console.log('aaaa', this.branches);
    this.arr = [];
    if (this.selectAllModel == true) {
      this.arr.push("Select All");
      for (let i = 0; i < this.branches.length; i++) {
        this.tempBranchesList[i].isSelected = true;
      }
    }
    else {
      for (let i = 0; i < this.branches.length; i++) {
        this.tempBranchesList[i].isSelected = false;
      }
    }
  }
  public arr: any = [];
  checkItem(i: any) {
    this.tempBranchesList[i].isSelected = this.branches[i].isSelected;
  }
  editHoliday(data: any) {
    this.selectAllModel = false;
    for (let i = 0; i < this.branches.length; i++) {
      this.branches[i].isSelected = false;
    }
    console.log(data);
    data.branchDetails.forEach((element: any) => {
      if (element == "Select All") {
        this.selectAllModel = true;
        for (let i = 0; i < this.branches.length; i++) {
          this.branches[i].isSelected = true;
        }
      }
      else {
        for (let i = 0; i < this.branches.length; i++) {
          console.log('aa', this.branches[i].projectName)
          if (element == this.branches[i].projectName) {
            this.branches[i].isSelected = true;
          }
        }
      }
    });
    this.togglebtn = false;
    this.toggleTitle = "Update";
    this.holidaysId = data.holidaysId;
    this.holidayDate = data.holidayDate;
    this.holidayName = data.holidayName;
    this.holidayType = data.holidayType;
  }
  cancel() {
    this.togglebtn = true;
    this.toggleTitle = "Add";
    this.holidayDate = "";
    this.holidayName = "";
    this.holidayType = "";
  }
  updateHoliday() {
    let array = [];
    for (let i = 0; i < this.branches.length; i++) {
      if (this.branches[i].isSelected) {
        array.push(this.branches[i].projectName);
      }
    }
    let object = {
      "holidayName": this.holidayName,
      "holidayDate": this.holidayDate,
      "holidayType": this.holidayType,
      "branchDetails": array,
    }
    let api: any = 'holiday/' + this.holidaysId;
    this.crudOperationsService.update(object, api).subscribe((data: any) => {
      console.log(data);
      this.fetchHoliday();
      (<any>$('#editModal')).modal('hide');
    })
  }
  removeHoliday(data: any) {
    this.holidaysId = data.holidaysId;
  }
  deleteHoliday() {
    let api: any = 'holiday/' + this.holidaysId;
    this.crudOperationsService.delete(api).subscribe((data: any) => {
      //console.log(data);
      this.holidayObject=[];
      this.fetchHoliday();
    })
  }
  fetchBranches() {
    this.spinner.show();
    let api: any = 'projectmaster/list/' + sessionStorage.getItem("companyId")+'?search=&page=0&size=100';
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.spinner.hide();
      this.branches = data.data.content;
      console.log(this.branches)
      for (let i = 0; i < this.branches.length; i++) {
        this.branches[i].isSelected = false;
      }
      console.log('btanc', this.branches);
      this.tempBranchesList = this.branches;
    },
    (error) => {
      this.spinner.hide();
    });
  }
  fetchWeekOff() {
    let api: any = 'weekoff/list?companyId=' + sessionStorage.getItem("companyId")+"&remarks="+this.branchName;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
        const dayOrder: { [key: string]: number } = {
            "Monday": 1,
            "Tuesday": 2,
            "Wednesday": 3,
            "Thrusday": 4,  
            "Friday": 5,
            "Saturday": 6,
            "Sunday": 7
        };

        this.weekOffObject = data.data.sort((a: any, b: any) => {
            return (dayOrder[a.weekDay] || 8) - (dayOrder[b.weekDay] || 8);
        });
    });
}
  
  checkCheckBoxvalue(event:any){
   // console.log("data is ========= ",event.target.checked);
   // console.log("value is ========= ",event.target.defaultValue);
    // if(event.target.checked){
    //   this.weekOffList.push(event.target.defaultValue);
    // }

    let object = {
      "company": {
        "companyId": this.companyId
      },
      "weekDay": event.target.defaultValue,
      "weekDayStatus": event.target.checked,
      "remarks":this.branchName,
    }
    this.weekOffList.push(object);
  }
  updateWeekOff() {
    //console.log("list is ============ ",this.weekOffList.length);
    for(let i=0;i<this.weekOffList.length;i++)  {
     //alert(this.weekOffList[i].remarks);
      let api: any = 'weekoff';
      this.crudOperationsService.create(this.weekOffList[i], api).subscribe((data: any) => {
        console.log(data);
        this.notification.notify('success', data.message);
      })
    }
    
    this.weekOffList =[];

  }
}
