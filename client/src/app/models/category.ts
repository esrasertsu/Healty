
export interface ICategory {
    key: string;
    text: string;
    value: string;
}

export class Category implements ICategory {
    key: string = "";
    text: string = "";
    value: string= "";

    constructor(init: ICategory){
        this.key = init.key;
        this.value = init.value;
        this.text = init.text;
    }
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
export interface IAllCategoryOption{
    key: string;
    text: string;
    value: string;
    parentId: string | null;

}
    export const colors = [
        { key:"Psikoloji", value: "#c38a8a"},
        { key:"Meditasyon", value: "#e0c022" },
        { key:"Spor", value: "#2185d0"},
        { key:"Diyet", value: "#3a7949"}
    
      ];