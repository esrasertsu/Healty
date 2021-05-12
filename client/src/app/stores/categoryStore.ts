import { action, observable, runInAction } from "mobx";
import agent from "../api/agent";
import { RootStore } from "./rootStore";
import { IAllCategoryList, ICategory, IPredicate, ISubCategory } from "../models/category";

export default class CategoryStore{
    rootStore: RootStore
    constructor(rootStore: RootStore){
        this.rootStore = rootStore
    }

    @observable category: ICategory | null = null;
    @observable loadingCategories = true;
    @observable loadingAllDetailedList = true;
    @observable categoryList: ICategory[] = [];

    @observable subcategoryList: ISubCategory[] = [];

    @observable allDetailedList: IAllCategoryList[] = [];
    @observable loadingSubCategories = true;
    @observable categoryRegistery = new Map();
    @observable subCategoryRegistery = new Map();
    @observable allCategoriesRegistery = new Map<string,IAllCategoryList>();
    @observable predicateTexts: IPredicate[] = [];
    @observable target = '';

    @action getPredicateTexts = (predicate:Map<any,any>) =>{
        debugger;
        this.predicateTexts = [];
        Array.from(predicate.keys()).forEach(item => 
            {
                if(item==="subCategoryIds")
                  {
                    predicate.get(item).forEach((subCat:string) =>{
                        var cat =   this.allCategoriesRegistery.get(subCat);
                        if(cat)
                        {
                                const newPre:IPredicate = { key: cat!.key, value: cat!.text, predicateName: item};
                                this.predicateTexts.push(newPre);
                            }
                    })
                  }  
                else{ 
                    var cat =   this.allCategoriesRegistery.get(predicate.get(item));
                    if(cat)
                   {
                        const newPre:IPredicate = { key: cat!.key, value: cat!.text, predicateName: item};
                        this.predicateTexts.push(newPre);
                    }

                }
               
            }
            )
    }
    
    @action setLoadingCategories = (lp : boolean) =>{
        this.loadingCategories = lp;
    }

    @action loadCategories = async () =>{
        this.loadingCategories = true;

        try {
            const categoryList = await agent.Categories.list();
            runInAction(()=>{
                this.categoryList = categoryList;
                categoryList.forEach((cat) =>{
                    //set props, Activity store'a bakıp kullanıcı commentini belirleme işlemi yapabilirsin..
                    this.categoryRegistery.set(cat.key, cat);
                });
                this.loadingCategories = false;
            })
        } catch (error) {
            runInAction(()=>{
                this.loadingCategories = false;
            })
            console.log(error);
        }
    }


    @action loadSubCategories = async (categoryId:string) =>{
        this.loadingSubCategories = true;

        try {
            const subcategoryList = await agent.Categories.listSubCats(categoryId);
            runInAction(()=>{
                this.subcategoryList = subcategoryList;
                this.loadingSubCategories = false;
                subcategoryList.forEach((cat) =>{
                    //set props, Activity store'a bakıp kullanıcı commentini belirleme işlemi yapabilirsin..
                    this.subCategoryRegistery.set(cat.key, cat);
                });
            })
        } catch (error) {
            runInAction(()=>{
                this.loadingSubCategories = false;
            })
            console.log(error);
        }
    }


    @action loadAllCategoryList = async () =>{
        
            this.loadingAllDetailedList = true;

            try {
                const allDetailedList = await agent.Categories.listAll();
                runInAction(()=>{
                    this.allDetailedList = allDetailedList;
                    this.loadingAllDetailedList = false;
    
                    allDetailedList.forEach((item) =>{
                        //set props, Activity store'a bakıp kullanıcı commentini belirleme işlemi yapabilirsin..
                        this.allCategoriesRegistery.set(item.key, item);
                    });
                    
                })
            } catch (error) {
                runInAction(()=>{
                    this.loadingAllDetailedList = false;
                })
                console.log(error);
            }
    }
    
    // @action loadPost = async (id:string) => {
    //     let post =  this.postRegistery.get(id);

    //     if(post){
    //         this.post = post;
    //         return post;
    //     } 
    //     else{
    //         this.loadingPost = true;
    //         try {
    //             post = await agent.Posts.details(id);
    //             runInAction('Getting post',() => {
    //                 this.post = post;
    //                 this.postRegistery.set(post.id, post);
    //                 this.loadingPost = false
    //             })
    //             return post;
    //             } catch (error) {
    //                 runInAction('Getting post error',() => {
    //                   this.loadingPost = false
    //                 });
    //                 console.log(error);
    //             }


    //     }
      
    // };

    // @action createPost = async (post: IPost) =>{
    //     this.submitting = true;
    //     try {
    //         await agent.Posts.create(post);
    //         runInAction('Creating post', () => {
    //             this.postRegistery.set(post.id, post);
    //             this.submitting = false;
    //         });
    //         history.push(`/posts/${post.id}`);
    //     } catch (error) {
    //         runInAction('Creating post error', () => {
    //             this.submitting = false;
    //         });
    //         toast.error('Problem submitting data');
    //         console.log(error);
    //     }
    // };

    // @action editPost = async (post: IPost) =>{
    //     this.submitting = true;
    //     try {
    //         await agent.Posts.update(post);
    //         runInAction('Editing post', () => {
    //         this.postRegistery.set(post.id, post);
    //         this.post = post;
    //         this.submitting = false;
    //         });
    //         history.push(`/posts/${post.id}`);
    //     } catch (error) {
    //         runInAction('Editing post error', () => {
    //             this.submitting = false;
    //         });
    //         toast.error('Problem submitting data');
    //         console.log(error);
    //     }
    // }

    // @action deletePost = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    //     this.submitting = true;
    //     this.target = event.currentTarget.name;
    //     try {
    //         await agent.Activities.delete(id);
    //         runInAction('Deleting post', () => {
    //             this.postRegistery.delete(id);
    //             this.submitting = false;
    //             this.target = '';
    //         });
    //     } catch (error) {
    //         runInAction('Deleting post error', () => {
    //             this.submitting = false;
    //             this.target = '';
    //         });
    //         console.log(error);
    //     }
    // }

}