import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { ShareDataService } from 'src/app/services/sharaData.service';
@Component({
  selector: 'app-leave-master',
  templateUrl: './leave-master.component.html',
  styleUrls: ['./leave-master.component.css']
})
export class LeaveMasterComponent implements OnInit {

  constructor(private router: Router,public  leaveMasterDataService: ShareDataService,
              private crudOperationsService:CrudOperationsService) {
  }
  public  Subscription:any;
  public leaveMasterData:any;
  public lMasterId:any="";
  ngOnInit(): void {
    this.Subscription = this.leaveMasterDataService.currentMessage.subscribe(message => this.leaveMasterData = message);
    this.crudOperationsService.getList('api').subscribe((data:any)=>{
        
    })
  }
  public headers:any=["Leave Type","Description","Entitlement", "Branch", "Grade","Division", "Remarks","Action"];
  public employees:any=[
    {leaveType:'TT',description:'Testing',entitlement:'Fixed',branch:'tt',grade:'A',division:'dss',remarks:'dss'},
    {leaveType:'TT',description:'Testing',entitlement:'Fixed',branch:'tt',grade:'A',division:'dss',remarks:'dss'}   ];

    addLeaveMaster(){
      this.leaveMasterDataService.changeMessage('Add');
      this.router.navigateByUrl('HRMS/Leave-attendance/add-leave-master');
    }
    editLeaveMaster(data:any){
      this.leaveMasterDataService.changeMessage(data);
      this.router.navigateByUrl('HRMS/Leave-attendance/add-leave-master');
    }
    ngOnDestroy() {
      this.Subscription.unsubscribe();
    }
    deleteItem(id:any){
      this.lMasterId=id;
    }
    deleteSelected(){
        this.crudOperationsService.delete(this.lMasterId).subscribe((data:any)=>{

        })
    }
}
