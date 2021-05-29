import { action, computed, observable, reaction, runInAction } from "mobx";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { IBlog, IPostFormValues } from "../models/blog";
import { RootStore } from "./rootStore";
import { history } from '../..';
import { SyntheticEvent } from 'react';
import { IProfileBlog } from "../models/profile";
import CategoryStore from "./categoryStore";

const LIMIT = 9;

export default class BlogStore{
    rootStore: RootStore;
    constructor(rootStore: RootStore){
        this.rootStore = rootStore;
        
        reaction(
            () => this.predicate.keys() ,
            () => {
                if(!this.clearedBeforeNewPredicateComing)
                {
                    this.page=0;
                    this.blogRegistery.clear();
                    this.rootStore.categoryStore.getPredicateTexts(this.predicate);
                    this.loadBlogs();
                }
                
            }
        )
    }
    @observable blogRegistery = new Map();
    @observable moreuserblogRegistery = new Map();
    @observable post: IBlog | null = null;
    @observable loadingPosts = true;
    @observable clearedBeforeNewPredicateComing = false;
    @observable loadingPost = true;
    @observable loadingForDelete = true;
    @observable submitting = false;
    @observable postList: IBlog[] = [];
    @observable sameCategoryBlogs: IBlog[] = [];
    @observable postRegistery = new Map();
    @observable target = '';
    @observable blogCount = 0;
    @observable sameCatBlogCount = 0;
    @observable predicate = new Map();
    @observable page = 0;
    @observable predicateDisplayName:string ="";

    @observable userBlogs: IProfileBlog[] = [];
    @observable loadingUserBlogs = true;

    @action setPage = (page:number) =>{
        this.page = page;
    }
    @action setPredicateDisplayName = (name:string) =>{
        this.predicateDisplayName = name;
    }
    @computed get totalPages(){
        return Math.ceil(this.blogCount / LIMIT);
    }
    @computed get isCurrentUserAuthor(){
        if (this.rootStore.userStore.user && this.post){
            return this.rootStore.userStore.user.userName === this.post!.username;
        }else {
            return false;
        }
    }
    @computed get axiosParams(){
        const params = new URLSearchParams();
        params.append('limit', String(LIMIT));
        params.append('offset', `${this.page ? this.page * LIMIT : 0}`);
        this.predicate.forEach((value,key) => {
            if(key === "subCategoryIds")
            {   
                value.forEach((item:string) =>{
                params.append(key, item);
            })
            }
            else 
              params.append(key, value);
        })
        return params;
    }

    @action setClearedBeforeNewPredicateComing = (value: boolean) => {
        this.clearedBeforeNewPredicateComing =value;
    }

    @action setPredicate = (predicate:string, value:string | string[]) => {
        if(predicate !== 'all')
        {
            if(value && value.length>0)
            {
                this.setClearedBeforeNewPredicateComing(true);
                this.clearPredicates(predicate);
                this.setClearedBeforeNewPredicateComing(false);
                this.predicate.set(predicate,value);
            }
            else this.clearPredicates(predicate);
        }else {
            this.setClearedBeforeNewPredicateComing(false);
            this.clearPredicates(null);
        }
    }
    @action clearPredicates = (pre:string|null) => {
        if(pre)
          this.predicate.delete(pre);
        else
          this.predicate.clear();
       
    }

    @action removeOnePredicate = (key:string) => {
        this.predicate.delete(key);
    }
    @action removeSubCatPredicate = (deleteValue:string) => {
       let values:string[] = this.predicate.get("subCategoryIds");
       values = values.filter(x=> x != deleteValue);
       this.setPredicate("subCategoryIds",values);
    }
    @action setLoadingPosts = (lp : boolean) =>{
        this.loadingPosts = lp;
    }

    @computed get getBlogsByDate(){
        // return this.activities.sort((a,b) => Date.parse(a.date) - Date.parse(b.date))
      //  return Array.from(this.activityRegistery.values()).sort((a,b) => Date.parse(a.date) - Date.parse(b.date))
          return Array.from(this.blogRegistery.values());
     }
     @action clearBlogRegistery = () => {
        this.blogRegistery.clear();
       
    }
    @action loadBlogs = async () =>{
        this.loadingPosts = true;

        try {
            const blogsEnvelope = await agent.Blogs.list(this.axiosParams);
            const {blogs, blogCount } = blogsEnvelope;
            runInAction('Loading blogs',()=>{
                blogs.forEach((blog) =>{
                  //  setActivityProps(activity,this.rootStore.userStore.user!)
                    this.blogRegistery.set(blog.id, blog);
                });
                this.blogCount = blogCount;
                this.loadingPosts = false;
            })
        } catch (error) {
            runInAction(()=>{
                this.loadingPosts = false;
            })
            console.log(error);
        }
    }

    @action loadUserBlogs = async (username: string) =>{
        this.loadingUserBlogs = true;

        try {
            const profileBlogListEnvelope = await agent.Profiles.listBlogs(username, 5, 0);
            const {profileBlogs, profileBlogsCount } = profileBlogListEnvelope;

            runInAction(()=>{
                this.userBlogs = profileBlogs;
                this.blogCount = profileBlogsCount;
                this.loadingUserBlogs = false;
            })
        } catch (error) {
            runInAction(()=>{
                this.loadingUserBlogs = false;
            })
            console.log(error);
        }
    }
    
    @action loadBlog = async (id:string) => {
    
            this.loadingPost = true;
            try {
                let post = await agent.Blogs.details(id);
                runInAction('Getting post',() => {
                    this.post = post;
                    this.loadUserBlogs(post.username);
                    this.loadSameCategoryBlogs(post.subCategoryIds);
                    this.loadingPost = false;
                })
                return post;
                } catch (error) {
                    runInAction('Getting post error',() => {
                      this.loadingPost = false
                    });
                    console.log(error);
                }
      
    };


    @action loadSameCategoryBlogs = async (subCategoryNames:string[]) =>{
        this.loadingPost = true;

        try {

            const params = new URLSearchParams();
            params.append('limit', String(5));
            params.append('offset', String(0));
            subCategoryNames.forEach((item) => {
                    params.append("subCategoryIds", item);
            })
            const blogsEnvelope = await agent.Blogs.list(params);
            const {blogs, blogCount } = blogsEnvelope;
            runInAction('Loading blogs',()=>{
                this.sameCategoryBlogs =blogs;
                this.sameCatBlogCount = blogCount;
                this.loadingPost = false;
            })
        } catch (error) {
            runInAction(()=>{
                this.loadingPost = false;
            })
            console.log(error);
        }
    }

    @action createPost = async (post: IPostFormValues) =>{
        this.submitting = true;
        try {
            const blog = await agent.Blogs.create(post);
            runInAction('Creating post', () => {
                this.submitting = false;
                this.blogRegistery.set(blog.id, blog);
                history.push(`/blog/${blog.id}`);

            });

        } catch (error) {
            runInAction('Creating post error', () => {
                this.submitting = false;
            });
            toast.error('Problem submitting data');
            console.log(error);
        }
    };

    @action editPost = async (post: IBlog) =>{
        this.submitting = true;
        try {
            await agent.Blogs.update(post);
            runInAction('Editing post', () => {
            this.postRegistery.set(post.id, post);
            this.post = post;
            this.submitting = false;
            });
            history.push(`/posts/${post.id}`);
        } catch (error) {
            runInAction('Editing post error', () => {
                this.submitting = false;
            });
            toast.error('Problem submitting data');
            console.log(error);
        }
    }

    @action deletePost = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await agent.Activities.delete(id);
            runInAction('Deleting post', () => {
                this.postRegistery.delete(id);
                this.submitting = false;
                this.target = '';
            });
        } catch (error) {
            runInAction('Deleting post error', () => {
                this.submitting = false;
                this.target = '';
            });
            console.log(error);
        }
    }

}