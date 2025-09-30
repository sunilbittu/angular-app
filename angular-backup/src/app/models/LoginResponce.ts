export interface userResponce{

  
    userName: string;
    contactName: string ;
    contactNumber: number ;
    email: string ;
    roles : [] ;
    token : string ;

    organizationRegistration : {

        id: number;
        orgName : string;
        orgAddress : string;
        city : string;
        orgEmail : string;
        orgNumber : number
    }

}