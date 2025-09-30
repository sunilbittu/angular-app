import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, NgForm } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { AddEmployeeService } from '../../master/addEmplyee.service';

@Component({
  selector: 'app-apply-leave',
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.css']
})
export class ApplyLeaveComponent implements OnInit {

  constructor(public datePipe: DatePipe, public fb: FormBuilder, public addEmployeeService: AddEmployeeService,
    public crudOperationsService: CrudOperationsService, private notification: NotifierService,
    private spinner: NgxSpinnerService) { }
  public managerName: any = '';
  public managerId: any = '';
  public companyId: any = Number(sessionStorage.getItem('companyId'));
  public employeeId: any = Number(sessionStorage.getItem('empId'));
  public leaveTypes: any = [];
  public leavesList: any = [];
  public permisionsArray: any[] = [];
  public fromDate: any = new Date();
  public submitted: boolean = false;
  public toDay = new Date();
  public start_date: any;
  public end_date: any;
  public tempStartDate: any;
  public tempEndDate: any;
  public holidayObject: any = [];
  public daysToShow: any = [];
  public selectedDate: any;
  public durationDays: number = 0;
  public weekoffcount: number = 0;
  public duplicate: number = 0;
  public LeaveTypesObject: any;
  public endDate: any;
  public checkstartDate: any;
  public holidayDate: any;
  public checkendDate: any
  public weekOffDays: number = 0;
  public holidays: any = [];

  public days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  public imageFileName: any;
  public filePath: any;
  public fileSelected: boolean = false;
  public requiredErrorText = 'can\'t be blank';
  public externalReportingHeadMail = sessionStorage.getItem("externalReportingHeadMail");
  public form = this.fb.group({
    LeaveType: ["", Validators.required],
    startDate: ["", Validators.required],
    endDate: ["", Validators.required],
    noDays: [0],
    manager: [this.managerName],
    externalmanager: [this.externalReportingHeadMail],
    letterContent: [""],
    selectedFile: [""]
  });
  get form_() { return this.form.controls; }
  ngOnInit(): void {
    this.daysToShow = [];
    this.getallPermissions();
    this.cancel();
    this.getLeaveType();
    this.fetchHolidays();
    this.crudOperationsService.getList('leavetype/leaveTypeByEmployee/?companyId=' + this.companyId
      + '&employeeId=' + this.employeeId).subscribe((data: any) => {
        this.LeaveTypesObject = data.data;
      })
    this.crudOperationsService.getList('employee/get_employee_reporting/' + Number(sessionStorage.getItem('empId')))
      .subscribe((data: any) => {
        this.managerName = data.data.employeeCode + '-' + data.data.firstName + ' ' + data.data.lastName;
        this.managerId = data.data.employeeId;
      });
    this.form.controls['manager'].patchValue(this.managerName);
    this.form.controls['externalmanager'].patchValue(this.externalReportingHeadMail);
    this.getWeekOffDays();
  }
  getallPermissions() {
    let api: any = "employeepermissions/employeepermissionsfordisplay?employeeId=" + this.employeeId+"&companyId="+this.companyId;
    this.crudOperationsService.getList(api).subscribe((resp: any) => {
      this.permisionsArray = resp.data;
    })
  }
  getWeekOffDays() {
    let api = 'manage-training/getWeekOffDays?companyId=' + this.companyId+"&remarks="+sessionStorage.getItem("projectid");
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.weekOffDays = data.data;
    },
      (error) => {
        console.log(error);
      })
  }
  public holidayDates: any=[];
  fetchHolidays(){
    let api='holiday/getHolidays?companyId='+ this.companyId+"&remarks="+sessionStorage.getItem("projectid");
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.holidays = data.data;
      this.holidayDates = this.holidays.map((holiday: { holidayDate: Date; }) => {
        const date = new Date(holiday.holidayDate);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${month}/${day}/${date.getFullYear()}`;
      });     
       console.log(this.holidayDates) ;
    },
      (error) => {
        console.log(error);
      })
  }
  getLeaveType() {
    this.spinner.show();
    this.crudOperationsService.getList('leavetype/dropdownList/?id=' + this.companyId).subscribe((data: any) => {
      this.spinner.hide();
      this.leaveTypes = data.data;
    },
      (_error) => {
        this.spinner.hide();
      })
  }
  onStartDateValueChange(event: any) {
    this.weekoffcount = 0;
    this.duplicate = 0;
    this.start_date = this.datePipe.transform(event, 'yyyy-MM-dd');
    this.fromDate = this.datePipe.transform(event, 'MM-dd-yyyy');
    this.tempStartDate = new Date(event);
    if (this.tempStartDate && this.tempEndDate) {
      this.getBusinessDates(this.tempStartDate, this.tempEndDate);
    }
  }
  onEndDateValueChange(event: any) {
    this.weekoffcount = 0;
    this.duplicate = 0;
    this.end_date = this.datePipe.transform(event, 'yyyy-MM-dd');

    this.endDate = this.datePipe.transform(event, 'MM-dd-yyyy');
    this.tempEndDate = new Date(event);
    if (this.tempStartDate && this.tempEndDate) {
      this.getBusinessDates(this.tempStartDate, this.tempEndDate);
      console.log(this.daysToShow)
    }
  }

  
  public getBusinessDates = (startDate: any, endDate: any) => {
   
    let count = 0;
    this.daysToShow = [];
    this.form.controls['noDays'].setValue(0);
    let data = ['Half Day', 'Full Day'];
    let curDate = +startDate;
   // alert("startdate ==="+startDate);
   // alert("enddate ==="+endDate);
   const holidaySet = new Set(
    this.holidayDates.map((date: Date) => new Date(date).toLocaleDateString('en-US'))
    );
    //console.log("holidaySet----------------", Array.from(holidaySet));

    while (curDate <= +endDate) {
     // alert("curtentdate ========= "+curDate);
      const dayOfWeek = new Date(curDate).getDay();
      const isWeekend = (this.checkWeekDays(dayOfWeek));
     // alert("isWeekend ======== "+isWeekend);
      const formattedDate = new Date(curDate).toLocaleDateString('en-US');
      //console.log("formattedDate----------------", formattedDate);
        
        // Check if the date is a weekend or a holiday
        const isHoliday = holidaySet.has(formattedDate);
        //console.log(formattedDate, "isHoliday:", isHoliday);
        if (!isWeekend && !isHoliday) {
        let obj = {
          'date': new Date(curDate),
          'data': data,
          'typeName': '',
          'typeValue': '',
          'selected': false
        }
        this.daysToShow.push(obj);
        count++;
      }
      curDate = curDate + 24 * 60 * 60 * 1000
    }
   // alert("count ======== "+count);
    return count;
  }

  checkWeekDays(dayOfWeek: number): boolean {
    if (this.weekOffDays == 1) {
      return dayOfWeek === 0;
    } else if (this.weekOffDays == 2) {
      return dayOfWeek === 6 || dayOfWeek === 0;
    } else if (this.weekOffDays == 3) {
      return dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0;
    } else {
      return false;
      //return dayOfWeek === 4 || dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0;
    }
  }

  CreateLeave() {
    this.submitted = true;
    console.log(this.form.value);
    let leaveTypeId = 0;
    this.leaveTypes.forEach((l: any) => {
      if (l.leaveTypeCode == this.form.value['LeaveType']) {
        leaveTypeId = l.leaveTypeId;
      }
    });
    //console.log("id =========== ",leaveTypeId)
    if (this.form.valid && this.checkDatesTypeValid()) {
      let formData = this.setFormData(leaveTypeId);
      let url = "leaveapplication";
      this.spinner.show();
      this.save(formData, url);
    }
  }
  checkDatesTypeValid(): boolean {
    let count = 0;
    this.daysToShow.forEach((day: any) => {
      if (!day.selected) {
        count++;
      }
    });
    if (count > 0) {
      return false
    }
    return true;
  }

  save(formData: any, api: string) {
    this.crudOperationsService.create(formData, api)
      .subscribe((data: any) => {
        this.spinner.hide();
        if (data.message == "Leave Application () Saved Successfully.") {
          this.cancel();
          this.submitted = false;
          this.selectedFile = null;
          this.notification.notify('success', 'Leave applied successfully!');
        } else {
          this.notification.notify('error', "Leave Type with current employee and year not found.");
        }
      },
        (_error) => {
          this.spinner.hide();
          this.notification.notify('error', 'Something Went Wrong')
        })
  }

  setFormData(leaveTypeId: any): any {
    const empId = sessionStorage.getItem("empId");
    let data = {
      'manager': this.managerName,
      'noOfDays': this.form.value['noDays'],
      'startDate': this.start_date,
      'endDate': this.end_date,
      "leaveType": { "leaveTypeId": Number(leaveTypeId) },
      "employee": { "employeeId": Number(empId) },
      "managerId": { "employeeId": this.managerId },
      "leaveLetterContent": this.form.value['letterContent'],
      'datesData': this.daysToShow
    }
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('leaveApplicationDTO', JSON.stringify(data));
    return formData;
  }
  cancel() {
    this.form.reset();
    this.form.controls['manager'].patchValue(this.managerName);
    this.form.controls['LeaveType'].patchValue('');
    this.form.controls['selectedFile'].patchValue('');
    this.form.controls['startDate'].patchValue('');
    this.form.controls['endDate'].patchValue('');
    this.fileSelected = false;
    this.selectedFile = null;
    this.tempStartDate = null;
    this.tempEndDate = null;
    this.daysToShow = [];
  }

  public selectedFile: any = null;
  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    this.fileSelected = false;
  }

  public seqNumber = 0;
  public dateType1: any = '';
  handleType(type: any) {
    console.log(type)
  }

  public finalDateObject: any = [];
  handleDateType(i: any, j: any, date: any) {
    this.durationDays = 0;
    this.daysToShow[i].typeValue = (j == 0 ? 0.5 : j);
    this.daysToShow[i].typeName = (j == 0 ? 'Half Day' : 'Full Day');
    this.daysToShow[i].selected = true;
    this.daysToShow.forEach((day: any) => {
     console.log(day.date, '....',day.typeName,'....',day.typeValue)
    });
    this.daysToShow.forEach((day: any) => {
      this.durationDays += Number(day.typeValue);
    });
    this.form.controls['noDays'].setValue(this.durationDays);
  }
}
