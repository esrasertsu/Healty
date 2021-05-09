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
    comments: IProfileComment[]
}


export class ProfilesFilterFormValues {
    category: string = '';
    subCategory: string = '';
 
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
