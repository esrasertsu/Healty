import { action, computed, observable, reaction, runInAction } from "mobx";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { IBlog } from "../models/blog";
import { RootStore } from "./rootStore";
import { history } from '../..';
import { SyntheticEvent } from 'react';

const LIMIT = 6;

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

    
    @action loadBlog = async (id:string) => {
        let post =  this.postRegistery.get(id);
       // this.moreuserblogRegistery.clear();

        if(post){
            this.post = post;
            return post;
        } 
        else{
            this.loadingPost = true;
            try {
                post = await agent.Blogs.details(id);
                runInAction('Getting post',() => {
                    this.post = post;
                    this.postRegistery.set(post.id, post);
                    this.loadingPost = false
                })
                return post;
                } catch (error) {
                    runInAction('Getting post error',() => {
                      this.loadingPost = false
                    });
                    console.log(error);
                }


        }
      
    };
    // @action uploadPhoto = async (file: Blob) => {
    //     this.uploadingPhoto = true;

    //     try {
    //         const photo = await agent.Profiles.uploadPhoto(file);
    //         runInAction(() => {
    //             if(this.profile)
    //             {
    //                 this.profile.photos.push(photo);
    //                 if(photo.isMain && this.rootStore.userStore.user)
    //                 {
    //                     this.rootStore.userStore.user.image = photo.url;
    //                     this.profile.image = photo.url;
    //                 }
    //             }

    //             this.uploadingPhoto = false;
    //         })
    //     } catch (error) {
    //         console.log(error);
    //         toast.error('Problem uploading photo');
    //         runInAction(() => {
    //             this.uploadingPhoto = false;
    //         })
            
    //     }
    // }


    // @action setMainPhoto = async (photo: IPhoto) => {
    //     this.loadingForPhotoDeleteMain = true;

    //     try {
    //         await agent.Profiles.setMainPhoto(photo.id);
    //         runInAction(() => {
    //             this.rootStore.userStore.user!.image = photo.url;
    //             this.profile!.photos.find(e => e.isMain)!.isMain = false;
    //             this.profile!.photos.find(e => e.id === photo.id)!.isMain = true;
    //             this.profile!.image = photo.url;
    //             this.loadingForPhotoDeleteMain = false;

    //         })
    //     } catch (error) {
    //         console.log(error);
    //         toast.error('Problem setting main photo');
    //         runInAction(() => {
    //             this.loadingForPhotoDeleteMain = false;
    //         })
            
    //     }
    // }

    @action createPost = async (post: IBlog) =>{
        this.submitting = true;
        try {
            await agent.Blogs.create(post);
            runInAction('Creating post', () => {
                this.postRegistery.set(post.id, post);
                this.submitting = false;
            });
            history.push(`/posts/${post.id}`);
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