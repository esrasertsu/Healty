import { ICategory, ISubCategory } from "./category";
import { ICity } from "./location";
import { IPhoto } from "./profile";

export interface IActivitiesEnvelope {
    activities: IActivity[];
    activityCount: number;
}
export interface IActivity {
    id: string;
    title: string;
    description: string;
    categories: ICategory[];
    subCategories: ISubCategory[];
    date: Date;
    city: ICity,
    venue: string;
    address:string;
    attendees: IAttendee[];
    attendancyLimit?: number;
    attendanceCount:number;
    price?:number;
    levels: ILevel[];
    isGoing:boolean;
    isHost: boolean;
    comments: IComment[];
    online: boolean,
    photos: IPhoto[],
    videos: IPhoto[],
    mainImage: IPhoto,
    activityJoinDetails: IActivityOnlineJoinInfo

}
export interface ILevel {
    key: string;
    text: string;
    value: string;
}
export interface IComment {
    id: string;
    createdAt: Date;
    body: string;
    username: string;
    image: string;
    displayName : string;
}


export interface ILevel {
    key: string;
    text: string;
    value: string;
}

export interface IActivitySelectedFilter {
    key: string;
    text: string;
    value: string;
}

export interface IActivityFormValues extends Partial<IActivity>{
    time?: Date,
    subCategoryIds: string[],
    categoryIds: string[],
    cityId:string,
    levelIds: string[],
    photo?: Blob;

}

export class ActivityFormValues implements IActivityFormValues {
    id?: string = undefined;
    title: string = '';
    subCategories: ISubCategory[] = [];
    categories: ICategory[] = [];
    description:string = '';
    date?: Date = undefined;
    time?: Date = undefined;
    cityId:string = "";
    venue:string = '';
    address:string = '';
    levels: ILevel[] = [];
    online: boolean = false;
    subCategoryIds: string[] =[];
    categoryIds: string[] =[];
    levelIds: string[] =[];
    price?: number;
    attendancyLimit?: number;
    photo?: Blob=undefined;
    mainImage?: IPhoto = undefined;
    constructor(init?: IActivityFormValues){
        if(init && init.date)
        {
            init.time = init.date
        }


        if(init)
        {   
            debugger;
        init.categoryIds = [];
        init.subCategoryIds=[];
        init.levelIds =[];
        init.cityId = init.city ? init.city.value : "";
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
        
                    init.levels!.forEach(s=>
                        {
                            init.levelIds.push(s.value.toString())
        
                        }
                        );
                        Object.assign(this, init);

                    }
  
    }
}

export interface IAttendee{
    userName: string;
    displayName: string;
    image: string;
    isHost: boolean;
    userRole: string;
    isFollowing?: boolean;
}


export interface IActivitySearch {
    _id: string,
    accommodates: number,
         bathrooms : number,
         bed_type :  string ,
         bedrooms : number,
         beds : number,
         date_from : Date,
         date_to : Date,
         has_availability : boolean,
         host_image :  string ,
         host_name :  string ,
         image : string ,
         listing_url :  string ,
         location: {
            lat: number,
            long : number
        },
         name :  string ,
         price : number,
         property_type :  string ,
         room_type :  string 
}

export interface IActivityMapItem {
        lat: number,
        lng : number,
        time : Date,

}

export interface IActivityLocation {
    lat: number,
    lng : number
}


export interface IActivityOnlineJoinInfo {
    id: string;
    zoom: boolean;
    activityUrl?: string;
    meetingId?: string;
    meetingPsw?: string;

}

export class ActivityOnlineJoinInfo implements IActivityOnlineJoinInfo {

    id: string = "";
    zoom: boolean = false;
    activityUrl? : string = undefined;
    meetingId? :string = undefined;
    meetingPsw? :string = undefined;

}