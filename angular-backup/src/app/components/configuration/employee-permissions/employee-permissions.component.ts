import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrudOperationsService } from 'src/app/services/crud-operations.service';
import { EmployeeMastersService } from '../../master/employee.masters.service';
declare var $: any;

@Component({
  selector: 'app-employee-permissions',
  templateUrl: './employee-permissions.component.html',
  styleUrls: ['./employee-permissions.component.css']
})
export class EmployeePermissionsComponent implements OnInit {
  public employeeId: any;
  public destinationPermissionsRoleList: any[]=[];
  public firstName: any;
  public lastName: any;
  public tempdestinationPermissionsRoleList: any;
  public updateButton: boolean=false;
  public employeePermissionId: any;

  constructor(private formBuilder: FormBuilder, private employeMasterService: EmployeeMastersService,public router: Router,
    private notification: NotifierService,private crudOperationsService:CrudOperationsService,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getAllEmployees();
  }
  
  public pageNumbers: any;
  public selectedPageNumber: number = 0;
  public employeeList!: any[];
  public companyId: number = Number(sessionStorage.getItem('companyId'));
  //public headers: any = ["Employee Id", "Employee Code", "Employee Name", "Branch", "Department", "Designation", "Division", "Grade", "Category", "Project", "Action"];
  public headers: any = ["Employee Id", "Employee Code", "Employee Name", "Branch", "Department", "Designation", "Role","Project", "Action"];
  public searchModel = '';
  p: number = 1;
  toggleLoader: boolean = false;
  //pagination
  itemsPerPage: any = 20;
  totalItems: any;
  currentPage: any;
  totalElements: number = 0;
  showingFrom: number = 0;
  showingTo: number = 0;
  public pageNumber: Number = 0;
  public submitted: boolean=false;
  public editButtonEnable!: boolean;
  public permissionRoleName: any;
  public permissionRoleId: any;
  public permissionsList: any[]=[];
  public rolesList: any[]=[];
  public destinationPermissionsList: any[]=[];
  public tempDestinationPermissionsList: any[]=[];
  public submitted2: boolean=false;
  public allSelectedInPermissions: boolean=false;
  public selectedList: any[]=[];
  public permissionsInStringFormat: any='';
  public permissionsRoleInStringFormat: any='';
  public isFormValuesSame:any;
  public searchItem:any;
  public searchInput:any;
  public toggleLoaderDestination:any;
  public checkIfalreadyExist:any;
  public originalPermissionList: any[]=[];
  public originalPermissionRoleList: any[]=[];
  public originalRestrictionList: any[]=[];
  public originalRestrictionRoleList: any[]=[];

    
  getRolePermissionDetails(t:any){

    this.permissionsInStringFormat='';
    this.permissionsRoleInStringFormat='';
    this.originalPermissionList=[];
    this.originalRestrictionList=[];
    this.originalPermissionRoleList=[];
    this.originalRestrictionRoleList=[];
    this.rolesList=[];
    this.destinationPermissionsRoleList=[];
    this.destinationPermissionsList=[];
    this.permissionsList=[];

    this.employeeId=t.employeeId;
    this.firstName=t.firstName;
    this.lastName=t.lastName;
    let api2:any="employeepermissions/dropdownList?employeeId="+this.employeeId+"&companyId="+this.companyId;
    this.crudOperationsService.getList(api2).subscribe((resp:any)=>{
      this.employeePermissionId=resp.data.empPermissionId;
      if(resp.data.empPermissions == "noPermissions"){
        this.updateButton=false;
      }else{
        this.updateButton=true;
      }
      this.originalPermissionList=resp.data.restircted;
      if(this.originalPermissionList != null){

      for (let i = 0; i < this.originalPermissionList.length; i++){
        let obj:any={
          "id":i,
          "permission":this.originalPermissionList[i]
        }
        this.permissionsList.push(obj);
      } }
// console.log("1-permissionsList",this.permissionsList);

      this.originalRestrictionList=resp.data.permissions;
      if(this.originalRestrictionList != null){
      for (let i = 0; i < this.originalRestrictionList.length; i++){
        let obj:any={
          "id":i+10000,
          "permission":this.originalRestrictionList[i]
        }
        this.destinationPermissionsList.push(obj);
      } 
    }
// console.log("2-destinationPermissionsList",this.destinationPermissionsList)

      this.originalPermissionRoleList=resp.data.permissionsRoles;
      if(this.originalPermissionRoleList != null){

      for (let i = 0; i < this.originalPermissionRoleList.length; i++){
        let obj:any={
          "id":i+100000,
          "permission":this.originalPermissionRoleList[i]
        }
        this.destinationPermissionsRoleList.push(obj);
      } }
      // console.log("3-destinationPermissionsRoleList",this.destinationPermissionsRoleList)


      this.originalRestrictionRoleList=resp.data.restirctedRoles;
      console.log(this.originalRestrictionRoleList,"asdfasdfadsf")
      if(this.originalRestrictionRoleList != null){
      for (let i = 0; i < this.originalRestrictionRoleList.length; i++){
        let obj:any={
          "id":i+1000000,
          "permission":this.originalRestrictionRoleList[i]
        }
        this.rolesList.push(obj);
      } }

// console.log("4-rolesList",this.rolesList)


    })
  }

  selectAll(event: any) {
    const checked = event.target.checked;
    this.permissionsList.forEach((item: any) => item.selected = checked);
  }

  onClickCheckBox(data:any) {
    const i = this.permissionsList.findIndex((obj: any) => obj.id == data.id);
    this.permissionsList[i].selected = !this.permissionsList[i].selected;
  }

  selectAll2(event: any) {
    const checked = event.target.checked;
    this.rolesList.forEach((item: any) => item.selected = checked);
  }

  onClickCheckBox2(data:any) {
    const i = this.rolesList.findIndex((obj: any) => obj.id == data.id);
    this.rolesList[i].selected = !this.rolesList[i].selected;
  }


  addRight() {
    const eItems = this.permissionsList.filter((item: any) => item.selected === true);
    if (eItems.length > 0) {
      eItems.forEach((element: any) => {
        this.destinationPermissionsList.push(element);
        if (this.permissionsList.indexOf(element) != -1) {
          this.permissionsList.splice(this.permissionsList.indexOf(element), 1);
          this.destinationPermissionsList.map(function (obj: any) {
            obj.selected = false;
          })
        }
      });}

      const eItems2 = this.rolesList.filter((item: any) => item.selected === true);
      if (eItems2.length > 0) {
        eItems2.forEach((element: any) => {
          this.destinationPermissionsRoleList.push(element);
          if (this.rolesList.indexOf(element) != -1) {
            this.rolesList.splice(this.rolesList.indexOf(element), 1);
            this.destinationPermissionsRoleList.map(function (obj: any) {
              obj.selected = false;
            })
          }
        });

          }      

  }

  addLeft() {
    const eItems = this.destinationPermissionsList.filter((item: any) => item.selected === true);
    if (eItems.length > 0) {
      eItems.forEach((element: any) => {
        this.permissionsList.push(element);
        if (this.permissionsList.indexOf(element) != -1) {
          this.destinationPermissionsList.splice(this.destinationPermissionsList.indexOf(element), 1);
          this.permissionsList.map(function (obj: any) {
            obj.selected = false;
          })
        }
      });}

      const eItems2 = this.destinationPermissionsRoleList.filter((item: any) => item.selected === true);
      if (eItems2.length > 0) {
        eItems2.forEach((element: any) => {
          this.rolesList.push(element);
          if (this.rolesList.indexOf(element) != -1) {
            this.destinationPermissionsRoleList.splice(this.destinationPermissionsRoleList.indexOf(element), 1);
            this.rolesList.map(function (obj: any) {
              obj.selected = false;
            })
          }
        });

          }      

  }

  onClickCheckBoxDestination(data: any) {
    const i = this.destinationPermissionsList.findIndex((obj: any) => obj == data);
    this.destinationPermissionsList[i].selected = !this.destinationPermissionsList[i].selected;
  }
  onClickCheckBoxDestination2(data: any) {
    const i = this.destinationPermissionsRoleList.findIndex((obj: any) => obj == data);
    this.destinationPermissionsRoleList[i].selected = !this.destinationPermissionsRoleList[i].selected;
  }


  update() {
    this.submitted2 = true;
    let employeeIdList = [];
   
    if (this.destinationPermissionsList.length > 0) {
for(let i=0;i< this.destinationPermissionsList.length ;i++){
  this.permissionsInStringFormat=this.permissionsInStringFormat.concat(this.destinationPermissionsList[i].permission).concat(",");
}}else{
  this.permissionsInStringFormat=null;
}
if (this.destinationPermissionsRoleList.length > 0) {
  for(let i=0;i< this.destinationPermissionsRoleList.length ;i++){
    this.permissionsRoleInStringFormat=this.permissionsRoleInStringFormat.concat(this.destinationPermissionsRoleList[i].permission).concat(",");
  }}else{
    this.permissionsRoleInStringFormat=null;
  }
  if(this.updateButton){
    var filterJson = {
      "emp":{"employeeId":this.employeeId},
      "empPermissions":this.permissionsInStringFormat,
      "rolesAssigned":this.permissionsRoleInStringFormat
    }
    let api = 'employeepermissions/'+this.employeePermissionId;
    this.crudOperationsService.update(filterJson, api)
      .subscribe((data: any) => {
        this.ngOnInit();
        this.onClick();
        this.submitted2=false;
  $('#rolePermission_modal').modal('hide');
        
        this.notification.notify('success', 'Resource Mapped Successfully!');
      },
        (error) => {
          this.notification.notify('error', error.error.message);
        })
  
  
  
  }else{
    var filterJson = {
      "emp":{"employeeId":this.employeeId},
      "empPermissions":this.permissionsInStringFormat,
      "rolesAssigned":this.permissionsRoleInStringFormat
    }
    let api = 'employeepermissions';
    this.crudOperationsService.create(filterJson, api)
      .subscribe((data: any) => {
        this.ngOnInit();
        this.onClick();
        this.submitted2=false;

  $('#rolePermission_modal').modal('hide');
        
        this.notification.notify('success', 'Resource Mapped Successfully!');
      },
        (error) => {
          this.notification.notify('error', error.error.message);
        })
  
  
  }

}

  clear(){

    this.rolesList=[];
    let api2:any="roles/dropdownList?companyId="+this.companyId;
    this.crudOperationsService.getList(api2).subscribe((resp:any)=>{
      let array1:any[]=resp.data;
      for (let i = 0; i < array1.length; i++){
        let obj:any={
          "id":i,
          "permission":array1[i]
        }
        this.rolesList.push(obj);
      } 
      
    })

    this.destinationPermissionsRoleList=[];
    this.permissionsList=[];
    let api:any="employee/getAllPermissions";
    this.crudOperationsService.getList(api).subscribe((resp:any)=>{
      let array1:any[]=resp.data;
      for (let i = 0; i < array1.length; i++){
        let obj:any={
          "id":i+10000,
          "permission":array1[i]
        }
        this.permissionsList.push(obj);
      } 
      
    })
    this.destinationPermissionsList=[];

  }

  onClick() {
    this.submitted2 = false;
    this.clear();
  }

  selectAllDestination(event: any) {
    const checked = event.target.checked;
    this.destinationPermissionsList.forEach((item: any) => item.selected = checked);
  }

  selectAllDestination2(event: any) {
    const checked = event.target.checked;
    this.destinationPermissionsRoleList.forEach((item: any) => item.selected = checked);
  }



  getAllEmployees() {
    this.spinner.show();
  
    let searchType = sessionStorage.getItem("employeeMasterType");
    if (searchType === "Male" || searchType === "Female") {
      this.searchModel = searchType.toLowerCase();
      sessionStorage.setItem('employeeMasterType', "All");
    }
  
    let url = `employee/search-list/${this.companyId}?search=${this.searchModel}&page=${this.pageNumber}&size=20`;
  
    this.crudOperationsService.getList(url).subscribe(
      async (data: any) => {
        let employees = data.data.content;
  
        let employeePromises = employees.map(async (employee: any) => {
          try {
            let roles = await this.fetchRolesByEmployeeId(employee.employeeId);
            employee.rolesAssigned = roles || [];
          } catch (error) {
            console.error("Error fetching roles for employee:", employee.id, error);
            employee.rolesAssigned = []; 
          }
          return employee;
        });
  
        this.employeeList = await Promise.all(employeePromises);

        console.log(this.employeeList)
        
        this.spinner.hide();
        
        this.handlePagination(data);
      },
      (error) => {
        this.spinner.hide();
        console.error(error);
      }
    );
  }
  
  fetchRolesByEmployeeId(employeeId: any): Promise<any[]> {
    let apiUrl = `employeepermissions/dropdownList?employeeId=${employeeId}&companyId=${this.companyId}`;
    
    return new Promise((resolve, reject) => {
      this.crudOperationsService.getList(apiUrl).subscribe(
        (resp: any) => resolve(resp.data.rolesAssigned || []),
        (error) => reject(error)
      );
    });
  }  

  handlePagination(data: any) {
    this.totalElements = data.data.totalElements;
    this.itemsPerPage = 20;
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
  pageChanged(event: any) {
    this.pageNumber = event - 1;
    this.getAllEmployees();
  }

  pageChange(id: number) {
    //alert(id);
    this.selectedPageNumber = id;
    let api: any = "employee/list_company/" + this.companyId
    this.crudOperationsService.getPaginationList(api, id)
      .subscribe((data: any) => {
        this.employeeList = data.data.content;
      })
  }
  //nextPage click
  nextPage() {
    //alert(this.selectedPageNumber);
    let page = this.selectedPageNumber + 1;
    let api: any = "employee/list_company/" + this.companyId
    this.crudOperationsService.getPaginationList(api, page)
      .subscribe((data: any) => {
        this.employeeList = data.data.content;
      })
  }
  //previous function
  previousPage() {
    let page = this.selectedPageNumber - 1;
    let api: any = "employee/list_company/" + this.companyId + "/?page=" + page
    this.crudOperationsService.getList(api)
      .subscribe((data: any) => {
        this.employeeList = data.data.content;
      })
  }

}
