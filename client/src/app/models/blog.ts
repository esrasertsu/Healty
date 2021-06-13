import { ICategory, ISubCategory } from "./category";

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
    photo : string;
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



export interface IBlogUpdateFormValues extends Partial<IBlog>{
}

export class BlogUpdateFormValues implements IBlogUpdateFormValues{
    id?: string = undefined;
    categories: ICategory[] = [];
    subCategories: ISubCategory[] = [];
    subCategoryIds: string[] =[];
    categoryId: string  ="";
    description: string = "";
    

    constructor(init?: IBlogUpdateFormValues){
        Object.assign(this, init);
    }
}



