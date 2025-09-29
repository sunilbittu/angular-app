import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common'
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-attendance-time-sheet',
  templateUrl: './attendance-time-sheet.component.html',
  styleUrls: ['./attendance-time-sheet.component.css']
})
export class AttendanceTimeSheetComponent implements OnInit {

  constructor(public datepipe: DatePipe, public crudOperationsService: CrudOperationsService, private spinner: NgxSpinnerService) { }
  public timeSheets: any = [];
  public timeSheetModel: any;
  public timeShiftColorModel: any = '';
  public startTimeModel: any;
  public endTimeModel: any;
  public timeSheetNameModel: any;
  public timeSheetIdModel: any;
  public Description: any = '';
  public hoursModel: any = '';
  public eventsList: any = [];
  public Events: any = [];
  public showErrorMsg: boolean = false;
  public latest_date: any;
  public obj: any = {};
  public employeeList: any = [];
  public isManager: boolean = false;
  public employeeIdModel: any = '';
  public empId: any = Number(sessionStorage.getItem('empId'));
  public monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  calendarOptions: CalendarOptions = {
    height: 700,
    headerToolbar: {
      left: '',
      center: 'title',
      right: 'today prev,next'
    },
    initialView: 'dayGridMonth',
    editable: true,
    customButtons: {
      prev: {
        text: '<',
        click: this.getEventsByMonthBefore.bind(this)
      },
      next: {
        text: '>',
        click: this.getEventsByMonthAfter.bind(this)
      },
      today: {
        text: 'today',
        click: this.currentMonth.bind(this),
      },
    },
    selectable: true,
    dayMaxEvents: false,
    dateClick: this.handleDateClick.bind(this)
  }

  private month: number = new Date().getMonth() + 1;
  public year = new Date().getFullYear();
  @ViewChild('fullcalendar', { static: false })
  fullcalendar!: FullCalendarComponent;

  ngOnInit(): void {
    this.isManager = sessionStorage.getItem("designation") == 'Manager';
    if (this.isManager) {
      this.getEmployeeList(this.empId);
    }
    this.getAttandeance();
  }
  getEmployeeList(empId: any) {
    let api: any = "employee/findEmployeeListByManager?page=0&employeeId=" + empId + "&size=500";
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.employeeList = data.data.content;
      }, (error) => {
        console.log(error);
      })
  }
  getAttandeance() {
    this.spinner.show();
    let mon = this.monthNames[this.month - 1].toLocaleUpperCase();
    this.crudOperationsService.getList('employeeattendance/employee_attendance_by_month_year/' +
      this.empId + '/' + mon + '?year=' + this.year).subscribe((data: any) => {
        this.spinner.hide();
        let Events = [];
        if(data.data != null) {
          this.eventsList = data.data.attendanceData;
          for (let i = 0; i < this.eventsList.length; i++) {
            Events.push({
              id: this.eventsList[i].timeSheetId,
              title: this.eventsList[i].timeSheetName + ' - ' + this.eventsList[i].workedHours + ' ' + 'Hours',
              start: this.eventsList[i].attendanceDate,
              end: this.eventsList[i].attendanceDate,
              color: this.eventsList[i].shiftColour
            })
          }
        }
        this.calendarOptions.events = Events;
      }, (error) => {
        this.spinner.hide();
        console.log(error);
      })
  }
  getEventsByMonthBefore() {
    this.month--;
    if (this.month == 0) {
      this.month = 12;
      this.year--;
    }
    const monthString = this.month > 9 ? this.month.toString() : '0' + this.month.toString();
    this.fullcalendar.getApi().removeAllEvents();
    this.fullcalendar.getApi().changeView('dayGridMonth', this.year + '-' + monthString + '-01');
    this.getAttandeance();
  }
  getEventsByMonthAfter() {
    this.month++;
    if (this.month > 12) {
      this.month = 1;
      this.year++;
    }
    const monthString = this.month > 9 ? this.month.toString() : '0' + this.month.toString();
    this.fullcalendar.getApi().removeAllEvents();
    this.fullcalendar.getApi().changeView('dayGridMonth', this.year + '-' + monthString + '-01');
    this.getAttandeance();
  }

  currentMonth() {
    this.month = new Date().getMonth() + 1;
    this.year = new Date().getFullYear();
    const monthString = this.month > 9 ? this.month.toString() : '0' + this.month.toString();
    this.fullcalendar.getApi().removeAllEvents();
    this.fullcalendar.getApi().changeView('dayGridMonth', this.year + '-' + monthString + '-01');
    this.getAttandeance();
  }

  getEmployeeTimeShift(date: any) {
    this.crudOperationsService.getList('employeeShiftService/shiftMasterDropdownList?employeeId=' +
      this.empId + '&date=' + date).subscribe((data: any) => {
        this.timeSheets = data.data;
        if (this.timeSheets.length == 0) {
          this.showErrorMsg = true;
        }
      })
  }

  handleDateClick(arg: any) {
    (<any>$('#myModal')).modal('show');
    this.showErrorMsg = false;
    console.log('aaaa', arg);
    let date = arg.date;
    this.year = new Date(date).getFullYear();
    this.latest_date = this.datepipe.transform(date, 'yyyy-MM-dd');
    this.getEmployeeTimeShift(this.latest_date);
    this.hoursModel = '';
    this.Description = '';
    this.timeSheetModel = undefined;
    this.startTimeModel = '';
    this.endTimeModel = '';
    this.timeSheetNameModel = '';
    this.timeSheetIdModel = '';
    this.timeShiftColorModel = '';
  }
  saveEvent() {
    console.log(this.hoursModel);
    console.log(this.Description);
    (<any>$('#myModal')).modal('hide');
    let mon = this.monthNames[this.month - 1].toLocaleUpperCase();
    this.obj = {
      monthOfAttendance: mon, yearOfAttendance: this.year, employee: {
        'employeeId': this.empId
      },
      attendanceData: [{
        attendanceDate: this.latest_date,
        workedHours: this.hoursModel,
        workDiscription: this.Description,
        startTime: this.startTimeModel,
        endTime: this.endTimeModel,
        timeSheetName: this.timeSheetNameModel,
        timeSheetId: this.timeSheetIdModel,
        shiftColour: this.timeShiftColorModel
      }],
      attendanceStatus: 'Pending'
    };
    this.crudOperationsService.create(this.obj, 'employeeattendance').subscribe((data: any) => {
      (<any>$('#myModal')).modal('hide');
      this.getAttandeance();
    });
  }

  changeTimeSheet() {
    console.log('..timeShhet : ', this.timeSheetModel);
    this.hoursModel = this.timeSheetModel.duration;
    this.startTimeModel = this.timeSheetModel.startTime;
    this.endTimeModel = this.timeSheetModel.endTime;
    this.timeSheetNameModel = this.timeSheetModel.name;
    this.timeSheetIdModel = this.timeSheetModel.timeSheetId;
    this.timeShiftColorModel = this.timeSheetModel.shiftColour;
  }

  onchangeEmployee() {
    this.empId = Number(this.employeeIdModel);
    this.getAttandeance();
  }

  cancel() {
    this.employeeIdModel = '';
    this.empId = Number(sessionStorage.getItem('empId'));
    this.getAttandeance();
  }
}