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
    date: Date;
    username: string;
    displayName: string;
    userImage: string;
    photo : string;
}

export interface IPostFormValues extends Partial<IBlog>{
    time?: Date
}
export class PostFormValues {
    id?: string = undefined;
    title: string = '';
    category: string = '';
    description:string = '';

}

