import { action, observable, runInAction, computed, reaction } from "mobx";
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { toast } from "react-toastify";
import agent from "../api/agent";
import { IPhoto, IProfile, IProfileBlog, IProfileComment, IUserActivity } from "../models/profile";
import { RootStore } from "./rootStore";
import { IMessageForm } from "../models/message";

const LIMIT = 5;

export default class ProfileStore{
    rootStore: RootStore
    constructor(rootStore: RootStore){
        this.rootStore = rootStore

        reaction(
            () => this.activeTab,
            activeIndex => {
                if(activeIndex ===3 || activeIndex===4)
                {
                    const predicate = activeIndex ===4 ? 'followers' : 'following';
                    this.loadFollowings(predicate);
                }else{
                    this.followings = [];
                }
            }
        )
    }

    @observable profile: IProfile | null = null;
    @observable commentRegistery = new Map();
    @observable profileRegistery = new Map();
    @observable blogRegistery = new Map();
    @observable loadingProfile = true;
    @observable loadingProfiles = true;
    @observable uploadingPhoto = false;
    @observable submittingComment = false;
    @observable loadingForPhotoDeleteMain = false;
    @observable loading = false;
    @observable loadingComments = true;
    @observable loadingBlogs = true;
    @observable followings: IProfile[] = [];
    @observable activeTab: number = 0;
    @observable profileList: IProfile[] = [];
    @observable commentCount = 0;
    @observable commentPage = 0;

    @observable blogCount = 0;
    @observable blogPage = 0;
    @observable userActivities: IUserActivity[] = [];
     @observable profileBlogs: IProfileBlog[] = [];
     @observable profileComments: IProfileComment[] = [];

    @observable loadingActivities = false;
    @observable submittingMessage = false;

    @observable.ref hubConnection : HubConnection | null = null;
    @computed get isCurrentUser(){
        if (this.rootStore.userStore.user && this.profile){
            return this.rootStore.userStore.user.userName === this.profile.userName;
        }else {
            return false;
        }
    }

    @computed get totalPages(){
        return Math.ceil(this.commentCount / LIMIT);
    }
    @action setCommentPage = (page:number) =>{
        this.commentPage = page;
    }

    @action setBlogPagination = (page:number) =>{
        this.blogPage = page;
    }

    @computed get totalBlogPages(){
        debugger;
        return Math.ceil(this.blogCount / LIMIT);
    }

    @computed get getCommentsByDate(){
        debugger;
        // return this.activities.sort((a,b) => Date.parse(a.date) - Date.parse(b.date))
      //  return Array.from(this.activityRegistery.values()).sort((a,b) => Date.parse(a.date) - Date.parse(b.date))
          return Array.from(this.commentRegistery.values());
     }
 
     @computed get getBlogsByDate(){
        // return this.activities.sort((a,b) => Date.parse(a.date) - Date.parse(b.date))
      //  return Array.from(this.activityRegistery.values()).sort((a,b) => Date.parse(a.date) - Date.parse(b.date))
          return Array.from(this.blogRegistery.values());
     }

    @action setActiveTab = (activeIndex: number) => {
        this.activeTab = activeIndex;
    }
    
    @action setLoadingProfile = (lp : boolean) =>{
        this.loadingProfile = lp;
    }

    
    @action setLoadingProfiles = (lp : boolean) =>{
        this.loadingProfiles = lp;
    }

    @action sendTrainerComment = async (comment: IProfileComment) =>{
        debugger;
        comment.username= this.profile!.userName;
        this.submittingComment = true;
        try {
            var newComment = await agent.Profiles.createComment(comment);
            runInAction('Creating comment', () => {
                this.commentRegistery.set(newComment.id, newComment);
                this.submittingComment = false;
            });
        } catch (error) {
            runInAction('Creating post error', () => {
                this.submittingComment = false;
            });
            toast.error('Problem submitting data');
            console.log(error);
        }
    };

    @action loadComments = async (username: string) =>{
        debugger;
        this.loadingComments = true;

        try {
            const commentListEnvelope = await agent.Profiles.listComments(username, LIMIT, this.commentPage);
            const {profileComments, profileCommentCount } = commentListEnvelope;

            runInAction(()=>{
                profileComments.forEach((comment) =>{
                    //set props, Activity store'a bakıp kullanıcı commentini belirleme işlemi yapabilirsin..
                    this.commentRegistery.set(comment.id, comment);
                });
                this.profileComments = profileComments;
                this.commentCount = profileCommentCount;
                this.loadingComments = false;
            })
        } catch (error) {
            runInAction(()=>{
                this.loadingComments = false;
            })
            console.log(error);
        }
    }

    @action loadBlogs = async (username: string) =>{
        debugger;
        this.loadingBlogs = true;

        try {
            const profileBlogListEnvelope = await agent.Profiles.listBlogs(username, 4, this.blogPage);
            const {profileBlogs, profileBlogsCount } = profileBlogListEnvelope;

            runInAction(()=>{
                profileBlogs.forEach((blog) =>{
                    //set props, Activity store'a bakıp kullanıcı commentini belirleme işlemi yapabilirsin..
                    this.blogRegistery.set(blog.id, blog);
                });
                this.profileBlogs = profileBlogs;
                this.blogCount = profileBlogsCount;
                this.loadingBlogs = false;
            })
        } catch (error) {
            runInAction(()=>{
                this.loadingBlogs = false;
            })
            console.log(error);
        }
    }

    getProfile = (username:string) => {
        return this.profileRegistery.get(username);
    }
    @action loadProfile = async (username: string) =>{
       debugger;
            this.loadingProfile = true;
            this.setCommentPage(0);
            this.setBlogPagination(0);
            this.commentRegistery.clear();
            this.blogRegistery.clear();
            try {
                const profile = await agent.Profiles.get(username);
                runInAction(()=>{
                    this.profile = profile;
                    this.profileRegistery.set(profile.userName, profile);
                    this.loadingBlogs = true;
                    this.loadingComments = true;
                    this.loadBlogs(profile.userName);
                    this.loadComments(profile.userName);
                    this.loadingProfile = false;
                })
            } catch (error) {
                runInAction(()=>{
                    this.loadingProfile = false;
                })
                console.log(error);
            }
        
        
    }
    @action loadProfiles = async () =>{
        this.loadingProfiles = true;

        try {
            var role = "tra";
            const profileList = await agent.Profiles.list(role);
            runInAction('Loading profiles',()=>{

                profileList.forEach((profile) =>{
                   // setActivityProps(activity,this.rootStore.userStore.user!)
                    this.profileRegistery.set(profile.userName, profile);
                });

                this.profileList = profileList;
                this.loadingProfiles = false;
            })
        } catch (error) {
            runInAction(()=>{
                this.loadingProfiles = false;
            })
            console.log(error);
        }
    }
    @action uploadPhoto = async (file: Blob) => {
        this.uploadingPhoto = true;

        try {
            const photo = await agent.Profiles.uploadPhoto(file);
            runInAction(() => {
                if(this.profile)
                {
                    this.profile.photos.push(photo);
                    if(photo.isMain && this.rootStore.userStore.user)
                    {
                        this.rootStore.userStore.user.image = photo.url;
                        this.profile.image = photo.url;
                    }
                }

                this.uploadingPhoto = false;
            })
        } catch (error) {
            console.log(error);
            toast.error('Problem uploading photo');
            runInAction(() => {
                this.uploadingPhoto = false;
            })
            
        }
    }


    @action setMainPhoto = async (photo: IPhoto) => {
        this.loadingForPhotoDeleteMain = true;

        try {
            await agent.Profiles.setMainPhoto(photo.id);
            runInAction(() => {
                this.rootStore.userStore.user!.image = photo.url;
                this.profile!.photos.find(e => e.isMain)!.isMain = false;
                this.profile!.photos.find(e => e.id === photo.id)!.isMain = true;
                this.profile!.image = photo.url;
                this.loadingForPhotoDeleteMain = false;

            })
        } catch (error) {
            console.log(error);
            toast.error('Problem setting main photo');
            runInAction(() => {
                this.loadingForPhotoDeleteMain = false;
            })
            
        }
    }

    @action deletePhoto = async (photo: IPhoto) => {
        this.loadingForPhotoDeleteMain = true;

        try {
            await agent.Profiles.deletePhoto(photo.id);
            runInAction(() => {
                
                    this.profile!.photos = this.profile!.photos.filter(e => e.id !== photo.id);
                    this.loadingForPhotoDeleteMain = false;

            })
        } catch (error) {
            console.log(error);
            toast.error('Problem deleting photo');
            runInAction(() => {
                this.loadingForPhotoDeleteMain = false;
            })
            
        }
    }

    @action follow = async (username: string) => {
        this.loading = true;
        try {
            await agent.Profiles.follow(username);
            runInAction(() =>{
                this.profile!.isFollowing = true;
                this.profile!.followerCount++;
                // this.followings = [...this.followings, this.profile!];
                this.loading = false;
                const predicate = this.activeTab ===4 ? 'followers' : this.activeTab === 3 ? 'following' : null ;
                debugger;
                if(predicate)
                 this.loadFollowings(predicate);
            })
        } catch (error) {
            toast.error('Problem following user');
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    @action unfollow = async (username: string) => {
        this.loading = true;
        try {
            await agent.Profiles.unfollow(username);
            runInAction(() =>{
                this.profile!.isFollowing = false;
                this.profile!.followerCount--;
                // this.followings = this.followings.filter(x => x.userName === username);
                this.loading = false;
                const predicate = this.activeTab ===4 ? 'followers' : this.activeTab === 3 ? 'following' : null ;
                debugger;
                if(predicate)
                 this.loadFollowings(predicate);
            })
        } catch (error) {
            toast.error('Problem unfollowing user');
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    @action loadFollowings = async (predicate: string) => {
        this.loading = true;
        try {
            const profiles = await agent.Profiles.listFollowings(this.profile!.userName, predicate);
            runInAction(() =>{
                this.followings = profiles;
                this.loading = false;
            })
        } catch (error) {
            toast.error('Problem loading following users');
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    @action loadUserActivities = async (username: string, predicate?: string) => {
        this.loadingActivities = true;
        try {
            
            const activities = await agent.Profiles.listActivities(username, predicate!);
            runInAction(() =>{
                this.userActivities = activities;
                this.loadingActivities = false;
            })
        } catch (error) {
            toast.error('Problem loading activities users');
            runInAction(() => {
                this.loadingActivities = false;
            })
        }

    }


    @action sendMessageFromProfile = async (message: IMessageForm) =>{
        debugger;
        message.receiver= this.profile!.userName;
        this.submittingMessage = true;
        try {
            await agent.Profiles.sendMessage(message);
            runInAction('Sending message', () => {
                this.submittingMessage = false;
            });
        } catch (error) {
            runInAction('Sending message error', () => {
                this.submittingMessage = false;
            });
            toast.error('Problem sending message');
            console.log(error);
        }
    };

}