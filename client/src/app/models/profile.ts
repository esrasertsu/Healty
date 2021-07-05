import { ICategory, ISubCategory } from "./category";
import { ICity } from "./location";

export interface IProfileEnvelope {
    profileList :IProfile[];
    profileCount: number;
    popularProfiles :IProfile[];
}
export interface IProfile {
    id:string,
    displayName: string,
    mainCategory: string,
    userName: string,
    bio: string,
    image: string,
    isFollowing: boolean,
    followingCount: number,
    followerCount: number,
    photos: IPhoto[],
    star: number,
    starCount: number,
    comments: IProfileComment[],
    hasConversation: boolean,
    experienceYear: number,
    experience:string,
    certificates:string,
    dependency:string,
    accessibilities: IAccessibility[],
    categories: ICategory[],
    subCategories: ISubCategory[],
    city: ICity,
    isOnline: boolean,
    responseRate: number,
    role: string

}

export interface IAccessibility{
    key: string;
    text: string;
    value: string;
}

export interface IPhoto {
    id: string,
    url: string,
    isMain: boolean
}

export interface IRefencePic {
    originalPublicId: string,
    originalUrl: string,
    thumbnailPublicId: string,
    thumbnailUrl: string,
    width: number,
    height: number,
    title: string
}

export interface IUserActivity {
    id: string,
    title: string,
    category: string,
    date: Date,
    photo: string
}

export interface IProfileCommentEnvelope {
    profileComments :IProfileComment[];
    profileCommentCount: number;
}
export interface IProfileComment {
    id: string;
    createdAt: Date;
    body: string;
    username: string;
    authorName: string;
    image: string;
    displayName : string;
    starCount: number;
    allowDisplayName: boolean;
}


export interface IProfileBlogsEnvelope {
    profileBlogs :IProfileBlog[];
    profileBlogsCount: number;
}


export interface IProfileBlog {
    id: string;
    title:string;
    description: string;
    categoryId:string;
    subCategoryIds:string[];
    date: Date;
    username: string;
    photo: string;
    displayName : string;
    userImage:string;
}

export interface IProfileFilterFormValues{
    // time?: Date
    subCategoryIds: string[],
    categoryId: string,
    accessibilityId: string,
    cityId:string,
    followingTrainers: boolean
}


export class ProfileFilterFormValues implements IProfileFilterFormValues{
    cityId:string = "";
    subCategoryIds: string[] =[];
    categoryId: string  ="";
    accessibilityId: string ="";
    followingTrainers:boolean= false;

    constructor(init?: IProfileFilterFormValues){
        //  if(init)
        // {    
        //     debugger;
        //     init.accessibilityIds = [];
        //     init.subCategoryIds=[];
        //     init.categoryId="";
        //     init.cityId = init.city ? init.city.value : "";
        //       init.accessibilities!.forEach(s=>
        //         {
        //             init.accessibilityIds.push(s.value.toString())

        //         }
        //         );

        //         init.categories!.forEach(s=>
        //             {
        //                 init.categoryIds.push(s.value.toString())
    
        //             }
        //             );

        //             init.subCategories!.forEach(s=>
        //                 {
        //                     init.subCategoryIds.push(s.value.toString())
        
        //                 }
        //                 );

        //  }
        Object.assign(this, init);
    }
}

export interface IProfileFormValues extends Partial<IProfile>{
    // time?: Date
    subCategoryIds: string[],
    categoryIds: string[],
    accessibilityIds: string[],
    cityId:string
}

export class ProfileFormValues implements IProfileFormValues{
    id?: string = undefined;
    cityId:string = "";
    categories: ICategory[] = [];
    subCategories: ISubCategory[] = [];
    displayName: string = '';
    bio: string= '';
    experienceYear: number = 0;
    experience:string = '';
    certificates:string = '';
    dependency:string = '';
    accessibilities: IAccessibility[] = [];
    subCategoryIds: string[] =[];
    categoryIds: string[]  =[];
    accessibilityIds: string[] =[];
    


    constructor(init?: IProfileFormValues){
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