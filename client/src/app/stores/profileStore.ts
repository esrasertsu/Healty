import { action, observable, runInAction, computed, reaction } from "mobx";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { IPhoto, IProfile } from "../models/profile";
import { RootStore } from "./rootStore";

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
    @observable loadingProfile = true;

    @observable uploadingPhoto = false;
    @observable loadingForPhotoDeleteMain = false;
    @observable loading = false;
    @observable followings: IProfile[] = []
    @observable activeTab: number = 0;

    @computed get isCurrentUser(){
        if (this.rootStore.userStore.user && this.profile){
            return this.rootStore.userStore.user.userName === this.profile.userName;
        }else {
            return false;
        }
    }

    @action setActiveTab = (activeIndex: number) => {
        this.activeTab = activeIndex;
    }
    
    @action loadProfile = async (username: string) =>{
        this.loadingProfile = true;

        try {
            const profile = await agent.Profiles.get(username);
            runInAction(()=>{
                this.profile = profile;
                this.loadingProfile = false;
            })
        } catch (error) {
            runInAction(()=>{
                this.loadingProfile = false;
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

}