import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, MultiDataSet, SingleDataSet } from 'ng2-charts';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-ats-dashboard',
  templateUrl: './ats-dashboard.component.html',
  styleUrls: ['./ats-dashboard.component.css']
})
export class AtsDashboardComponent implements OnInit {

  constructor(private route: Router, private crudOperationsService: CrudOperationsService) { }

  public companyId: any = Number(sessionStorage.getItem("companyId"));
  public totalActiveEmployees: number = 0;
  public totalResignEmployees: number = 0;
  public liveEmployees: number = 0;
  public genderChartData: any = [];
  public maleCount: any;
  public femaleCount: any;
  public dobData: any = [];
  public dobCount: any = 0;
  public waData: any = [];
  public waCount: any = 0;
  public maData: any = [];
  public maCount: any = 0;
  public todayLeaveCount: any;
  public presentPercentage: any;
  public absentPercentage: any;
  public totalCount: any;
  public futureLeaveCount: any;
  public joinerCount: any;
  public incrementCount: any;
  public leaveTrendData: any;
  public annoucementList: any = [];

  public clientSearchModel = '';
  public candidatesSearchModel = '';
  public pageNumber: Number = 0;
  public candidateList: any = [];
  public jobList: any = [];

  ngOnInit(): void {
    //emp counts
    // this.fetchTotalActiveEmployee();
    // this.getEmpGenderWiseCount();
    this.getStateBranchDeptWiseCount();
    // this.getUpcomingBithday();
    // this.getWABithday();
    // this.getMABithday();
    // this.getEmployeeTodayLeaveCount();
    // this.getFutureAnalysisLeaveCount();
    // this.getDailyActivityCounts();
    // this.getAttendenceData();
    // this.getLeaveTrendData();
    // this.getAnnouncementData();
    // this.fetchTotalResignEmployee();
    this.getJobsCountByStatus();
    this.getCandidates();
    this.getJobs();
    
  }
  getCandidates() {
   
    let api = 'candidate/list?companyId=' + this.companyId + '&search=' + this.candidatesSearchModel + '&page=' + this.pageNumber + '&size=200&isArchived=false';;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
     
      this.candidateList = data.data.content;
      
    },
      (error) => {
       
        console.log(error);
      })
  }


  getJobs() {
   
    let api = 'job/list?companyId=' + this.companyId + '&search=' + this.clientSearchModel + '&page=' + this.pageNumber + '&size=200';
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      
      this.jobList = data.data.content;
      
    },
      (error) => {
      
        console.log(error);
      })
  }
  getAnnouncementData() {
    let api: any = 'dashboard/announcementList/' + this.companyId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.annoucementList = data.data;
    })
  }
  getLeaveTrendData() {
    let api: any = 'dashboard/leaveTrendData/' + this.companyId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      const responseData = data.data;
      this.lineChartData = responseData.leaveTrendData;
    })
  }
  getDailyActivityCounts() {
    let api: any = 'dashboard/dailyActivity/' + this.companyId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      const responseData = data.data;
      this.joinerCount = responseData.joinerCount;
      this.incrementCount = responseData.incrementCount;
    })
  }
  getAttendenceData() {
    let api: any = 'dashboard/attendenceData/' + this.companyId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      const responseData = data.data;
      this.presentPercentage = responseData.presentPercentage;
      this.absentPercentage = responseData.absentPercentage;
      this.totalCount = responseData.totalCount;
    })
  }
  getEmployeeTodayLeaveCount() {
    let api: any = 'dashboard/employeeTodayLeaveCount/' + this.companyId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.todayLeaveCount = data.data;
    })
  }
  getFutureAnalysisLeaveCount() {
    let api: any = 'dashboard/employeeFutureLeaveAnalysisCount/' + this.companyId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.futureLeaveCount = data.data;
    })
  }
  getMABithday() {
    let api: any = 'dashboard/marriageAnniversary/' + this.companyId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      const responseData = data.data;
      this.maData = responseData.list;
      this.maCount = responseData.count;
    })
  }
  getWABithday() {
    let api: any = 'dashboard/upcomingWorkAnniversary/' + this.companyId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      const responseData = data.data;
      this.waData = responseData.list;
      this.waCount = responseData.count;
    })
  }
  getUpcomingBithday() {
    let api: any = 'dashboard/upcomingBirthday/' + this.companyId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      const responseData = data.data;
      this.dobData = responseData.list;
      this.dobCount = responseData.count;
    })
  }

  getEmpGenderWiseCount() {
    let api: any = 'dashboard/empGenderWiseCount/' + this.companyId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      const responseData = data.data;
      this.genderChartData = responseData.chartData;
      this.maleCount = responseData.maleCount;
      this.femaleCount = responseData.femaleCount;
      this.genderDoughnutChartData = [this.maleCount, this.femaleCount];
    })
  }
  fetchTotalActiveEmployee() {
    let api: any = 'dashboard/count_active_employee_total/' + this.companyId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      this.totalActiveEmployees = data.data;
    })
  }
  getJobsCountByStatus() {
    // let api: any = 'employee/count_resign_employee_total/' + this.companyId;
    // this.crudOperationsService.getList(api).subscribe((data: any) => {
    //   this.totalResignEmployees = data.data;
    //   this.liveEmployees = this.totalActiveEmployees + this.totalResignEmployees;
    //   this.doughnutChartData = [this.liveEmployees, this.totalActiveEmployees, this.totalResignEmployees,5 ];
    // })

    let api = 'job/getJobsCountByStatus?companyId=' + this.companyId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      //console.log("report data ======= ",JSON.stringify(data.data));
      let results = data.data;
      this.doughnutChartData = [results.activeCount, results.completedCount, results.cancelledCount,results.onHoldCount];
    },
      (error) => {
       // this.spinner.hide();
        console.log(error);
      })
    
  }
  //gender 
  public doughnutChartLabels: string[] = ['Active', 'Completed', 'Cancelled', 'On Hold'];
  public doughnutChartData: number[] = [0,0,0,0];
  public genderDoughnutChartLabels: string[] = ['Male', 'Female'];
  public genderDoughnutChartData: number[] = [0,0,0];
  chartOptions = {
    responsive: true
  };
  public pieChartLabels: Label[] = ['PHP', '.Net', 'Java'];
  public pieChartData: SingleDataSet = [50, 30, 20];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  //leave trends

  public lineChartData: any[] = [];
  public lineChartLabels: any[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // public lineChartOptions: (any & { annotation: any }) = {
  //   responsive: true,
  // };
  public lineChartColors: any[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType: any = 'line';
  public lineChartPlugins = [];



  //Salary Process
  public barChartOptions: any = {
    responsive: true,
  };
  public barChartLabels: any[] = ['Live', 'Calculated', 'Not Calculated'];
  public barChartType: any = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: any[] = [
    { data: [0, 30, 60, 90, 120, 150], label: 'Salary Process' },
  ];
  //Salary structure
  public barChartOptions1: any = {
    responsive: true,
  };
  public barChartLabels1: any[] = ['House', 'Conveyance', 'Special', 'Medical', 'Hazard', 'Dearness'];
  public barChartType1: any = 'bar';
  public barChartLegend1 = true;
  public barChartPlugins1 = [];

  public barChartData1: any[] = [
    { data: [0, 5000, 10000, 15000, 200000, 25000], label: 'Salary Structure' },
  ];
  getStateBranchDeptWiseCount() {
    // let api: any = 'dashboard/stateBranchDeptWiseCount/' + this.companyId;
    // this.crudOperationsService.getList(api).subscribe((data: any) => {
    //   const responseData = data.data;
    //   this.barChartData3 = responseData.branchChartdata;
    //   this.barChartLabels3 = responseData.branchLabels;

    //   this.barChartData2 = responseData.stateChartdata;
    //   //this.barChartLabels2 = responseData.stateLabels;

    //   this.barChartData4 = responseData.deptChartdata;
    //   this.barChartLabels4 = responseData.deptLabels;
    // })
    let api = 'candidate/getCandidatesCountByStatus?companyId=' + this.companyId;
    this.crudOperationsService.getList(api).subscribe((data: any) => {
      //console.log("report data ======= ",JSON.stringify(data.data));
      let results = data.data;
      this.barChartData2 = results.stateChartdata;
      //this.doughnutChartData = [results.activeCount, results.completedCount, results.cancelledCount,results.onHoldCount];
    },
      (error) => {
       // this.spinner.hide();
        console.log(error);
      })
  }
  //Branch wise
  public barChartOptions3: any = {
    responsive: true
  };
  public barChartType3: any = 'horizontalBar';
  public barChartLegend3 = true;
  public barChartData3: any[] = [];
  public barChartLabels3: any[] = [];

  //state wise head count
  public barChartOptions2: any = {
    responsive: true
  };
  public barChartType2: any = 'horizontalBar';
  public barChartLegend2 = false;
  public barChartData2: any[] = [];
  public barChartLabels2: any[] = ["New Candidate","Owned","Added to a job","Dropped","Hired"];

  //Department wise
  public barChartOptions4: any = {
    responsive: true
  };
  public barChartType4: any = 'horizontalBar';
  public barChartLegend4 = true;
  public barChartData4: any[] = [];
  public barChartLabels4: any[] = [];

  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
   // console.log("clicked ======== ");
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public randomize(): void {
    // Only Change 3 values
    const data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    const clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].data = data;
    this.barChartData = clone;
    /**
     * (My guess), for Angular to recognize the change in the dataset
     * it has to change the dataset variable directly,
     * so one way around it, is to clone the data, change it and then
     * assign it;
     */
  }

  logout() {
    this.route.navigateByUrl('login');
  }
  routeToEmpMaster() {
    this.route.navigateByUrl('HRMS/Master/employee-master');
  }
  routeToEmpMaleMaster() {
    sessionStorage.setItem('employeeMasterType', "Male");
    this.route.navigateByUrl('HRMS/Master/employee-master');
  }
  routeToEmpFemaleMaster() {
    sessionStorage.setItem('employeeMasterType', "Female");
    this.route.navigateByUrl('HRMS/Master/employee-master');
  }
  routeToEmpDepartment() {
    
    this.route.navigateByUrl('HRMS/Monthly-reports/employee-master-reports');
  }

  routeToEmployeesOnLeaveToday() {
    this.route.navigateByUrl('HRMS/Leave-attendance/todays-leave');
  }
}
