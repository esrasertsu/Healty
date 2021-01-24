export interface IActivity {
    id: string;
    title: string;
    description: string;
    category: string;
    date: Date;
    city: string;
    venue: string;
    attendees: IAttendee[];
    isGoing:boolean;
    isHost: boolean;
    comments: IComment[];
}

export interface IComment {
    id: string;
    createdAt: Date;
    body: string;
    username: string;
    image: string;
    displayName : string;
}
export interface IActivityFormValues extends Partial<IActivity>{
    time?: Date
}

export class ActivityFormValues implements IActivityFormValues {
    id?: string = undefined;
    title: string = '';
    category: string = '';
    description:string = '';
    date?: Date = undefined;
    time?: Date = undefined;
    city: string = '';
    venue:string = '';

    constructor(init?: IActivityFormValues){
        if(init && init.date)
        {
            init.time = init.date
        }
        Object.assign(this, init);
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

