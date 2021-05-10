import { action, computed, observable, reaction, runInAction } from "mobx";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { IBlog, IPostFormValues } from "../models/blog";
import { RootStore } from "./rootStore";
import { history } from '../..';
import { SyntheticEvent } from 'react';
import { IProfileBlog } from "../models/profile";

const LIMIT = 8;

export default class BlogStore{
    rootStore: RootStore
    constructor(rootStore: RootStore){
        this.rootStore = rootStore;
        
        reaction(
            () => this.predicate.keys(),
            () => {
                debugger;
                this.page=0;
                this.blogRegistery.clear();
                this.loadBlogs();
            }
        )
    }
    @observable blogRegistery = new Map();
    @observable moreuserblogRegistery = new Map();
    @observable post: IBlog | null = null;
    @observable loadingPosts = true;
    @observable loadingPost = true;
    @observable loadingForDelete = true;
    @observable submitting = false;
    @observable postList: IBlog[] = [];
    @observable postRegistery = new Map();
    @observable target = '';
    @observable blogCount = 0;
    @observable predicate = new Map();
    @observable page = 0;

    @observable userBlogs: IProfileBlog[] = [];
    @observable loadingUserBlogs = true;

    @action setPage = (page:number) =>{
        this.page = page;
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
                params.append(key, value);
        })
        return params;
    }

    @action setPredicate = (predicate:string, value:string) => {
        this.predicate.clear();
        if(predicate !== 'all')
        {
            this.predicate.set(predicate,value);
        }
    }

    @action setLoadingPosts = (lp : boolean) =>{
        this.loadingPosts = lp;
    }

    @computed get getBlogsByDate(){
        debugger;
        // return this.activities.sort((a,b) => Date.parse(a.date) - Date.parse(b.date))
      //  return Array.from(this.activityRegistery.values()).sort((a,b) => Date.parse(a.date) - Date.parse(b.date))
          return Array.from(this.blogRegistery.values());
     }

    @action loadBlogs = async () =>{
        debugger;
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
        debugger;
        this.loadingUserBlogs = true;

        try {
            const profileBlogListEnvelope = await agent.Profiles.listBlogs(username, 5, 0);
            const {profileBlogs, profileBlogsCount } = profileBlogListEnvelope;

            runInAction(()=>{
                profileBlogs.forEach((blog) =>{
                    //set props, Activity store'a bakıp kullanıcı commentini belirleme işlemi yapabilirsin..
                    this.blogRegistery.set(blog.id, blog);
                });
                debugger;
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
        debugger;
       // this.moreuserblogRegistery.clear();

    
            this.loadingPost = true;
            try {
                let post = await agent.Blogs.details(id);
                runInAction('Getting post',() => {
                    debugger;
                    this.post = post;
                    this.loadUserBlogs(post.username);
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

    @action createPost = async (post: IPostFormValues) =>{
        debugger;
        this.submitting = true;
        try {
            await agent.Blogs.create(post);
            runInAction('Creating post', () => {
                this.submitting = false;
            });
            history.push(`/blog/${post.id}`);

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