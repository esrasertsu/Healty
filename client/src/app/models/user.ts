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
}

export interface IUserFormValues {
    email: string;
    password: string;
    displayName?: string;
    userName?: string;
}


export interface ITrainerFormValues {
    email: string;
    password: string;
    displayName?: string;
    userName?: string;
    experienceYear:number;
    accessibilities: IAccessibility[];
    city: ICity;
    dependency:string;
    categories: ICategory[];
    subCategories: ISubCategory[];
    photo: Blob;

}