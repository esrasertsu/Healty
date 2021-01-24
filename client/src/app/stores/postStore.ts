import { action, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { IPost } from "../models/post";
import { RootStore } from "./rootStore";
import { history } from '../..';
import { SyntheticEvent } from 'react';

export default class PostStore{
    rootStore: RootStore
    constructor(rootStore: RootStore){
        this.rootStore = rootStore
    }

    @observable post: IPost | null = null;
    @observable loadingPosts = true;
    @observable loadingPost = true;
    @observable loadingForDelete = true;
    @observable submitting = false;
    @observable postList: IPost[] = [];
    @observable postRegistery = new Map();
    @observable target = '';

    
    @action setLoadingPosts = (lp : boolean) =>{
        this.loadingPosts = lp;
    }

    @action loadPosts = async () =>{
        this.loadingPosts = true;

        try {
            const postList = await agent.Posts.list();
            runInAction(()=>{
                this.postList = postList;
                this.loadingPosts = false;
            })
        } catch (error) {
            runInAction(()=>{
                this.loadingPosts = false;
            })
            console.log(error);
        }
    }

    
    @action loadPost = async (id:string) => {
        let post =  this.postRegistery.get(id);

        if(post){
            this.post = post;
            return post;
        } 
        else{
            this.loadingPost = true;
            try {
                post = await agent.Posts.details(id);
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

    @action createPost = async (post: IPost) =>{
        this.submitting = true;
        try {
            await agent.Posts.create(post);
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

    @action editPost = async (post: IPost) =>{
        this.submitting = true;
        try {
            await agent.Posts.update(post);
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