
export interface ICategory {
    key: string;
    text: string;
    value: string;
}

export interface ISubCategory {
    key: string;
    text: string;
    value: string;
}

export interface IAllCategoryList {
    key: string;
        text: string;
        value: string;
        parent: string | null;
        childNames: string[] | null;
        childIds: string[] | null;
        blogCount: number;
    }