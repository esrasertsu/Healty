
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

export interface IPredicate {
    key: string; //id
    value: string; //text
    predicateName: string; //prediName
}

export interface IAllCategoryList {
    key: string;
        text: string;
        value: string;
        parentName: string | null;
        parentId: string | null;
        childNames: string[] | null;
        childIds: string[] | null;
        blogCount: number;
    }