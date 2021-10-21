import { ICategory, ISubCategory } from "./category";
import { ICity } from "./location";
import { IAccessibility } from "./profile";

export interface IUser {
    userName : string;
    displayName: string;
    token: string;
    image?: string;
    role: string;
    isOnline: boolean;
    isSubMerchant:boolean;
}

export interface IUserFormValues {
    email: string;
    password: string;
    displayName?: string;
    userName?: string;
}

export interface ITrainerCreationFormValues {
    email: string;
    password: string;
    displayname: string;
    username: string;
    // phone:string;
}

export class TrainerCreationFormValues implements ITrainerCreationFormValues{
    email: string = "";
    password:string = "";
    displayname:string = "";
    username:string = "";
    // phone: string = "";
}

export interface ITrainerFormValues {
    email: string;
    password: string;
    displayname?: string;
    username?: string;
    experienceYear:number;
    accessibilities: IAccessibility[];
    city?: ICity|null;
    dependency:string;
    categories: ICategory[];
    subCategories: ISubCategory[];
    photo?: Blob|null;
    subCategoryIds: string[],
    categoryIds: string[],
    accessibilityIds: string[],
    cityId:string,
    description: string,
    certificates:File[],
    title: string


}

export class TrainerFormValues implements ITrainerFormValues{
    email: string = "";
    password:string = "";
    displayname:string = "";
    username:string = "";
    experienceYear: number = 0;
    experience:string = '';
    certificates:File[] =[];
    dependency:string = '';
    subCategoryIds: string[] =[];
    categoryIds: string[]  =[];
    accessibilityIds: string[] =[];
    categories: ICategory[] = [];
    subCategories: ISubCategory[] = [];
    cityId: string = "";
    photo?: Blob|null  = null;
    city?: ICity| null = null;
    accessibilities: IAccessibility[] = [];
    description: string ="";
    title: string="";

    constructor(init?: ITrainerFormValues){
        if(init)
        {    
            
            init.accessibilityIds = [];
            init.subCategoryIds=[];
            init.categoryIds=[];
            init.cityId = init.city ? init.city.value : "";
              init.accessibilities!.forEach(s=>
                {
                    init.accessibilityIds.push(s.value.toString())

                }
                );

                init.categories!.forEach(s=>
                    {
                        init.categoryIds.push(s.value.toString())
    
                    }
                    );
                    init.subCategories!.forEach(s=>
                        {
                            init.subCategoryIds.push(s.value.toString())
        
                        }
                        );

         }
        Object.assign(this, init);
    }
}



export interface ISubMerchantInfo {
    id?: string;
    subMerchantKey?: string;
    merchantType : string; 
    contactName : string;
    contactSurname : string;
    email: string;
    gsmNumber : string;
    // name: string;
    taxOffice : string;
    taxNumber? : number|null; 
    address : string;
    iban : string;
    identityNumber: string;
    legalCompanyTitle: string;
    hasSignedContract: boolean;

}


export class SubMerchantInfo implements ISubMerchantInfo {

    id?: string = undefined;
    subMerchantKey?: string = undefined;
    merchantType : string = ""; //0 şahıs 1 şirket
    contactName : string = "";
    contactSurname : string = "";
    email: string = "";
    gsmNumber : string = "";
    // name: string = "";
    taxOffice : string = "";
    taxNumber? : number|null = null;
    address : string = "";
    iban : string = "";
    identityNumber: string = "";
    legalCompanyTitle: string = "";
    hasSignedContract: boolean = true;


    constructor(init?: ISubMerchantInfo){
        if(init)
        {   
debugger;
             
             Object.assign(this, init);

        }
    }
}
