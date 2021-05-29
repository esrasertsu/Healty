import { ICategory, ISubCategory } from "./category";

export interface IProfile {
    displayName: string,
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
    isOnline: boolean,
    responseRate: number
}

export interface IAccessibility{
    id: string,
    name: string
}

export class ProfilesFilterFormValues {
    category: string = '';
    subCategoryIds: string[] = [];
 
}

export interface IPhoto {
    id: string,
    url: string,
    isMain: boolean
}

export interface IUserActivity {
    id: string,
    title: string,
    category: string,
    date: Date
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

export class ProfileFormValues {
    id?: string = undefined;
    categories: string = '';
    subCategories: string[] = [];
    displayName: string = '';
    bio: string= '';
    experienceYear: number = 0;
    experience:string = '';
    certificates:string = '';
    dependency:string = '';
    accessibilities: string[] = [];
}