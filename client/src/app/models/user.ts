export interface IUser {
    userName : string;
    displayName: string;
    token: string;
    image?: string;
    role: string;
    isOnline: boolean;
}

export interface IUserFormValues {
    email: string;
    password: string;
    displayName?: string;
    userName?: string;
}