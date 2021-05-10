import { ISubCategory } from "./category";

export interface IBlogsEnvelope {
    blogs: IBlog[];
    blogCount: number;
}
export interface IBlog {
    id: string;
    title: string;
    description: string;
    summary: string;
    categoryId: string;
    subCategoryIds: string[];
    categoryName: string;
    subCategoryNames: string[];
    date: Date;
    username: string;
    displayName: string;
    userImage: string;
    photo : Blob;
}

export interface IPostFormValues extends Partial<IBlog>{
    file: Blob;

}
export class PostFormValues {
    id?: string = undefined;
    title: string = '';
    categoryId: string = '';
    description:string = '';
    subCategoryIds: string[] = [];
    photo: string ="";

}


