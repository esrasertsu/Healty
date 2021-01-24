
export interface IPost {
    id: string;
    title: string;
    description: string;
    category: string;
    createdAt: Date;
    username: string;
    image: string;
    displayName : string;
}

export interface IPostFormValues extends Partial<IPost>{
    time?: Date
}
export class PostFormValues {
    id?: string = undefined;
    title: string = '';
    category: string = '';
    description:string = '';

}

