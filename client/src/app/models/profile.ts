export interface IProfile {
    displayName: string,
    userName: string,
    bio: string,
    image: string,
    isFollowing: boolean,
    followingCount: number,
    followerCount: number,
    photos: IPhoto[]
}

export interface IPhoto {
    id: string,
    url: string,
    isMain: boolean
}