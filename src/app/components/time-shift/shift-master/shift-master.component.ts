import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { ConfigurationService } from '../../configuration/configuration.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@Component({
  selector: 'app-shift-master',
  templateUrl: './shift-master.component.html',
  styleUrls: ['./shift-master.component.css']
})
export class ShiftMasterComponent implements OnInit {
  submitText: string = '';
  public shiftForm!: FormGroup;
  public headers: any = ["Shift Name", "Description", "Start Time", "End Time", "Duration(Hrs)","Color", "Action"];
  public designationsList: any;
  public departmentsList: any;
  public gradesList: any;
  public companyId: any = Number(sessionStorage.getItem("companyId"));
  public financialYearList: any = [];
  public shiftList: any;
  public shiftObject: any;
  public kpaObjectArray: any = [];
  public shiftDetailsById: any;
  public enableUpdateButton: any;
  public branchDetailsList!: any[];
  public cancelClicked!: any;
  public submitProcessing: boolean = false;
  public format = "24";
  public minutesGap = 5;
  public durationHours: any;
  public durationMinutes: any;
  public finalTimeInMInutes: any;
  public submitted!: boolean;
  public color =" ";

  p: number = 1;
  //pagination
  itemsPerPage: any;
  totalItems: any;
  currentPage: any;
  totalElements: number = 0;
  showingFrom: number = 0;
  showingTo: number = 0;
  public pageNumber: Number = 0;
  public popoverTitle = 'Delete Confirmation';
  public requiredErrorText = 'can\'t be blank';
  public popoverMessage = 'Are you sure you want delete';
  kkkk: any;
  finalDuration: any;
  constructor(private formBuilder: FormBuilder, private crudeService: CrudOperationsService,
    private notification: NotifierService, public configurationService: ConfigurationService, public ngxMaterialTimepickerModule: NgxMaterialTimepickerModule,
    private spinner: NgxSpinnerService, private employeMasterService: EmployeeMastersService) { }
  ngOnInit(): void {
    this.shiftForm = this.formBuilder.group({
      name: ['', Validators.required],
      descreption: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      duration: ['', Validators.required],
      shiftColour: ['']
    });

    //get Shift List
    this.fetchList()
  }
  get form_() { return this.shiftForm.controls; };



  //get kpalist
  fetchShiftListByCompanyId() {
    this.spinner.show();
    let api: any = 'shiftMaster/list_company/' + this.companyId + '?page=' + this.pageNumber + '&size=10';
    this.crudeService.getList(api)
      .subscribe((data: any) => {
        this.shiftList = data.data.content;
        this.spinner.hide();
        //pagination call
        this.handlePagination(data);
      },
        (error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Wrong');
        })
  }
  handlePagination(data: any) {
    this.totalElements = data.data.totalElements;
    this.itemsPerPage = 10;
    this.currentPage = data.data.pageable.pageNumber + 1;
    this.totalItems = (data.data.totalPages) * this.itemsPerPage;
    this.showingFrom = (data.data.pageable.pageNumber * 10) + 1;
    const to = (data.data.pageable.pageNumber + 1) * 10;
    if (this.totalElements >= to) {
      this.showingTo = to;
    } else {
      this.showingTo = this.totalElements;
    }
  }
  pageChanged(event: any) {
    this.pageNumber = event - 1;
    this.fetchList();
  }
  //search data in table by
  public searchModel = '';

fetchListBysearch(){
  let api: any = 'shiftMaster/shift_master_searchBy_param/' + this.companyId + '?search=' + this.searchModel + '&page=' + this.pageNumber + '&size=10';
    this.crudeService.getList(api)
      .subscribe((data: any) => {
        this.shiftList = data.data.content;
        //show hide
        this.spinner.hide();
        //pagination call
        this.handlePagination(data);
      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
          //show hide
          this.spinner.hide();
        })
}

  fetchList() {
    //show spinner
    this.spinner.show();
    let api: any = 'shiftMaster/shiftMaster_search_list/' + this.companyId + '?search=' + this.searchModel + '&page=' + this.pageNumber + '&size=10';
    this.crudeService.getList(api)
      .subscribe((data: any) => {
        this.shiftList = data.data.content;
        //show hide
        this.spinner.hide();
        //pagination call
        this.handlePagination(data);
      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
          //show hide
          this.spinner.hide();
        })
  }
  //edit function
  getKpaDetailsById(id: number) {
    this.submitText = 'Update';
    //show spinner
  
    this.spinner.show();
    let api: any = 'shiftMaster/' + id;
    this.crudeService.getList(api)
      .subscribe((data: any) => {
        this.shiftDetailsById = data.data;
        //enable update button
        this.enableUpdateButton = true;
        //show hide
        this.spinner.hide();
        this.color=this.shiftDetailsById.shiftColour;
        this.shiftForm.patchValue({
          name: this.shiftDetailsById.name,
          descreption: this.shiftDetailsById.descreption,
          startTime: this.shiftDetailsById.startTime,
          endTime: this.shiftDetailsById.endTime,
          duration: this.shiftDetailsById.duration,
          shiftColour:this.shiftDetailsById.shiftColour
        })
      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
          //show hide
          this.spinner.hide();
        })
  }
  updateShiftData() {
    //show spinner
    this.spinner.show();
    this.submitProcessing = true;
    this.shiftObject =
    {
      'shiftId': this.shiftDetailsById.shiftId,
      'name': this.shiftForm.value.name,
      'descreption': this.shiftForm.value.descreption,
      'startTime': this.shiftForm.value.startTime,
      'endTime': this.shiftForm.value.endTime,
      'duration': this.shiftForm.value.duration,
      'shiftColour':this.color,
      'company': {
        'companyId': this.companyId
      },
    }
    let api: any = 'shiftMaster/' + this.shiftDetailsById.shiftId
    this.crudeService.update(this.shiftObject, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        this.submitProcessing = false;
        this.shiftForm.reset();
        //show hide
        this.spinner.hide();
        //hide modelpopup
        (<any>$('#add')).modal('hide');
        //get kpalist
        this.fetchList()
      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
          //show hide
          this.spinner.hide();
          this.submitProcessing = false;
        })
  }
  //delete kpa record
  deleteKpaData(id: number) {
    //show spinner
    this.spinner.show();
    let api: any = 'shiftMaster/' + id
    this.crudeService.delete(api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        //show hide
        this.spinner.hide();
        //get kpalist
        this.fetchList()
      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
          //show hide
          this.spinner.hide();
        })
  }
  onSubmit() {
    if (this.submitText == 'Update') {
      this.updateShiftData();
    }
    if (this.submitText == 'Save') {
      this.saveShiftData();
    }
  }

  saveShiftData() {
    //show spinner
    // this.spinner.show();
    
    this.submitted = true;
    console.log("value is ======= ",this.shiftForm.valid);
   // if (this.shiftForm.valid == true ) {
      console.log("save shift ========= ");
    this.submitProcessing = true;
    this.shiftObject =
    {
      'name': this.shiftForm.value.name,
      'descreption': this.shiftForm.value.descreption,
      'startTime': this.shiftForm.value.startTime,
      'endTime': this.shiftForm.value.endTime,
      'duration': this.finalDuration,
      'shiftColour':this.color,
      'company': {
        'companyId': this.companyId
      }
    }

    //console.log(this.shiftObject);
    let api: any = 'shiftMaster'
    this.crudeService.create(this.shiftObject, api)
      .subscribe((data: any) => {
        this.notification.notify('success', data.message);
        this.shiftForm.reset();
        this.submitProcessing = false;
        this.submitted = false;
        //show hide
        this.spinner.hide();
        //hide modelpopup
        (<any>$('#add')).modal('hide');
        //get kpalist
        this.fetchList()
      },
        (error) => {
          this.notification.notify('error', 'Something Went Wrong');
          this.submitProcessing = false;
          //show hide
          this.spinner.hide();
        })
    //}
  }
  resetTheForm(): void {
    this.shiftForm.reset();
    this.color=" ";

  }
  clickAdd() {
    this.submitText = 'Save';
    this.resetTheForm();
  }




  timeChange1(event: any) {
    if (this.shiftForm.value.endTime != null) {
      console.log(event)
      let time2 = this.shiftForm.value.endTime;
      let lengthOfendTime = time2.length;
      let endTImeHours = Number(time2.slice(0, time2.lastIndexOf(":")));
      let endTImeminutes = Number(time2.slice(time2.lastIndexOf(":") + 1, time2.lastIndexOf(":") + 3))
      let endTImeformat = time2.slice(time2.lastIndexOf("M") - 1, time2.lastIndexOf("M") + 1)
      if (endTImeformat == "PM") {
        endTImeHours += 12;
      }

      let time1 = event;
      let lengthOfstartTime = time1.length;
      let startTImeHours = Number(time1.slice(0, time1.lastIndexOf(":")));
      let startTImeminutes = Number(time1.slice(time1.lastIndexOf(":") + 1, time1.lastIndexOf(":") + 3))
      let startTImeformat = time1.slice(time1.lastIndexOf("M") - 1, time1.lastIndexOf("M") + 1);
      if (startTImeformat == "PM") {
        startTImeHours += 12;
      }
      if (endTImeHours > startTImeHours) {
        this.durationHours = endTImeHours - startTImeHours;

      } else {
        this.durationHours = Number(24 - startTImeHours + endTImeHours);
      }

      this.durationMinutes = Number((60 - startTImeminutes) + (endTImeminutes));


      if (this.durationHours > 1) {
        this.durationMinutes = (Number((60 - startTImeminutes) + (endTImeminutes)) % 60);
        if(this.durationMinutes < 10){
          if(this.durationHours < 10){
            this.shiftForm.value.duration="0"+String(this.durationHours)+":0"+String(this.durationMinutes);
          }else{
            this.shiftForm.value.duration=String(this.durationHours)+":0"+String(this.durationMinutes);
          }
          
        }else{
          if(this.durationHours < 10){
            this.shiftForm.value.duration="0"+String(this.durationHours)+":"+String(this.durationMinutes);
          }else{
            this.shiftForm.value.duration=String(this.durationHours)+":"+String(this.durationMinutes);
          }
        }


      } else {

        if (this.durationMinutes > 60) {
          this.durationMinutes = Number(((60 - startTImeminutes) + (endTImeminutes)) % 60);
          if(this.durationMinutes < 10){
            this.shiftForm.value.duration = "01:0" + String(this.durationMinutes);
          }else{
            this.shiftForm.value.duration = "01:" + String(this.durationMinutes);
          }
          
          console.log("final 5", this.shiftForm.value.duration)
        } else if(this.durationMinutes = 60){
          
            this.shiftForm.value.duration = "01:00";
        }else{
          if(this.durationMinutes < 10){
            this.shiftForm.value.duration = "00:" + String(this.durationMinutes);
          }else{
            this.shiftForm.value.duration = "00:" + String(this.durationMinutes);
          }
        }
      }


      this.finalDuration= this.shiftForm.value.duration;



    } else {
      //
    }



  }

  timeChange2(event: any) {
    if (this.shiftForm.value.startTime != null) {
      let time2 = this.shiftForm.value.startTime;
      let lengthOfstartTime = time2.length;
      let startTImeHours = Number(time2.slice(0, time2.lastIndexOf(":")));
      let startTImeminutes = Number(time2.slice(time2.lastIndexOf(":") + 1, time2.lastIndexOf(":") + 3))
      let startTImeformat = time2.slice(time2.lastIndexOf("M") - 1, time2.lastIndexOf("M") + 1)
      if (startTImeformat == "PM") {
        startTImeHours += 12;
      }

      let time1 = event;
      let lengthOfendTime = time1.length;
      let endTImeHours = Number(time1.slice(0, time1.lastIndexOf(":")));
      let endTImeminutes = Number(time1.slice(time1.lastIndexOf(":") + 1, time1.lastIndexOf(":") + 3))
      let endTImeformat = time1.slice(time1.lastIndexOf("M") - 1, time1.lastIndexOf("M") + 1);
      if (endTImeformat == "PM") {
        endTImeHours += 12;
      }

      if (endTImeHours > startTImeHours) {
        this.durationHours = endTImeHours - startTImeHours;

      } else {
        this.durationHours = Number(24 - startTImeHours + endTImeHours);
      }

      this.durationMinutes = Number((60 - startTImeminutes) + (endTImeminutes));

    
      if (this.durationHours > 1) {
        this.durationMinutes = (Number((60 - startTImeminutes) + (endTImeminutes)) % 60);
        if(this.durationMinutes < 10){
          if(this.durationHours < 10){
            this.shiftForm.value.duration="0"+String(this.durationHours)+":0"+String(this.durationMinutes);
          }else{
            this.shiftForm.value.duration=String(this.durationHours)+":0"+String(this.durationMinutes);
          }
          
        }else{
          if(this.durationHours < 10){
            this.shiftForm.value.duration="0"+String(this.durationHours)+":"+String(this.durationMinutes);
          }else{
            this.shiftForm.value.duration=String(this.durationHours)+":"+String(this.durationMinutes);
          }
        }


      } else {

        if (this.durationMinutes > 60) {
          this.durationMinutes = Number(((60 - startTImeminutes) + (endTImeminutes)) % 60);
          if(this.durationMinutes < 10){
            this.shiftForm.value.duration = "01:0" + String(this.durationMinutes);
          }else{
            this.shiftForm.value.duration = "01:" + String(this.durationMinutes);
          }
          
          console.log("final 5", this.shiftForm.value.duration)
        } else if(this.durationMinutes = 60){
          
            this.shiftForm.value.duration = "01:00";
        }else{
          if(this.durationMinutes < 10){
            this.shiftForm.value.duration = "00:" + String(this.durationMinutes);
          }else{
            this.shiftForm.value.duration = "00:" + String(this.durationMinutes);
          }
        }
      }


      this.finalDuration= this.shiftForm.value.duration;


    } else {
    }

  }



}
