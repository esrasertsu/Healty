
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
    parent:string | null;
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
        { key:"Psikoloji", value: "#FA9639"},
        { key:"Meditasyon", value: "#E36034" },
        { key:"Spor", value: "#2B4CA9"},
        { key:"Diyet", value: "#38A0BF"}
    
      ];


      export const borderColors = [
        { key:"Psikoloji", value: "#FA9639"},
        { key:"Meditasyon", value: "#E36034" },
        { key:"Spor", value: "#2B4CA9"},
        { key:"Diyet", value: "#38A0BF"}
    
      ];