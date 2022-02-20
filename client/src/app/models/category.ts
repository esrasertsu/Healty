
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
        { key:"Psikoloji", value: "#db6173"},
        { key:"Meditasyon", value: "#6B5ACC" },
        { key:"Spor", value: "#325AA7"},
        { key:"Diyet", value: "#05A2A2"}
    
      ];


      export const borderColors = [
        { key:"Psikoloji", value: "#e28593"},
        { key:"Meditasyon", value: "#8170e2" },
        { key:"Spor", value: "#406bbc"},
        { key:"Diyet", value: "#00b8b8"}
    
      ];