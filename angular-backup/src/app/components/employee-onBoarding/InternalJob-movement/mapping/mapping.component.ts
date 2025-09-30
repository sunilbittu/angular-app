import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.css']
})
export class MappingComponent implements OnInit {
  public headers:any=["Code","Name","Branch","Department","Designation","Division","Grade","Category","Project","Job-Id","Action"];
  public employeeList : any;
  public jobIdList : any;
  public companyId: any;
  public mapJobIdObject : any;
  public jobId: any;
  public searchWord : any;
  constructor(private crudeService : CrudOperationsService, private notificationService: NotifierService, 
    private spinner: NgxSpinnerService) { }
  ngOnInit(): void {
    this.spinner.show();
    this.spinner.hide();
  }
  getAllEmployeeBySearchTerm(searchTerm:string){
    this.spinner.show();
    //alert(this.searchWord);
    this.companyId = sessionStorage.getItem('companyId');
    let api : any = "employee/list_for_employee_internal_job_movement/"+this.companyId+"/"+searchTerm;
    this.crudeService.getList(api)
    .subscribe((data:any)=>{
      this.spinner.hide();
      this.employeeList = data.data.content;
      this.getJobIdData();
    },
    (error)=>{
      this.spinner.hide();
      this.notificationService.notify('danger','Something Went Wrong');
    })
  }
  //jobid dropdown
  getJobIdData(){
    this.companyId = sessionStorage.getItem('companyId');
    let api : any = "resourceindentrequest/mapping/list?companyId=" + this.companyId;
    this.crudeService.getList(api)
    .subscribe((data:any)=>{
      this.jobIdList = data.data;
      debugger     
    },
    (error)=>{
      this.notificationService.notify('danger','Something Went Wrong');
    })
  }
  getJobId($event:any){
    this.jobId = $event.target.options[$event.target.options.selectedIndex].value;
   // alert(this.jobId);
  }
  mapJobIdWithData(id:number){
    this.mapJobIdObject = {
      "resourceIndentRequest":{
        "jobId": this.jobId
      }
    }
    let api : any = "employee/update_mapjob_id_employee/"+id;
    this.crudeService.update(this.mapJobIdObject,api)
    .subscribe((data:any)=>{
     this.notificationService.notify('success',data.message)
     this.employeeList = []; 
     this.searchWord = '';
    },
    (error)=>{
      this.notificationService.notify('danger','Something Went Wrong');
    })
  }

  getbenchResources(){
    this.companyId = sessionStorage.getItem('companyId');
    let api : any = "employee/list_for_employee_internal_job_movement_benchresource/"+this.companyId;
    this.crudeService.getList(api)
    .subscribe((data:any)=>{
      this.employeeList = data.data.content;
      this.getJobIdData();
    },
    (error)=>{
      this.notificationService.notify('danger','Something Went Wrong');
    })
  }
}
