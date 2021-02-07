export interface IProfile {
    displayName: string,
    userName: string,
    bio: string,
    image: string,
    isFollowing: boolean,
    followingCount: number,
    followerCount: number,
    photos: IPhoto[],
    starCount: number
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