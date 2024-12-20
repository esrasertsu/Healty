import { action, observable, runInAction, computed, reaction, makeObservable } from "mobx";
import { toast, ToastPosition } from "react-toastify";
import agent from "../api/agent";
import { IAccessibility, IPhoto, IProfile, IProfileBlog, IProfileComment, IProfileFilterFormValues, IProfileFormValues, IRefencePic, IUserActivity, ProfileFilterFormValues, ProfileFormValues } from "../models/profile";
import { store } from "./rootStore";
import { IMessageForm } from "../models/message";

const LIMIT = 10; //axios'u düzeltmeyi unutma

export default class ProfileStore{

    constructor(){
        makeObservable(this);

        reaction(
            () => this.activeTab,
            activeIndex => {
                this.updatedProfile= false;
                if(this.profile && this.profile.role=== "Trainer" && (activeIndex ===3 || activeIndex===4))
                {
                    const predicate = activeIndex ===4 ? 'followers' : 'following';
                    if(store.userStore.isLoggedIn)
                     this.loadFollowings(predicate);
                }if(this.profile && this.profile.role !== "Trainer" && (activeIndex ===2 || activeIndex===3))
                {
                    const predicate = activeIndex ===3 ? 'followers' : 'following';
                    if(store.userStore.isLoggedIn)
                        this.loadFollowings(predicate);
                }else{
                    this.followings = [];
                }
            }
        )
    }

    @observable profile: IProfile | null = null;
    @observable commentRegistery = new Map<string,IProfileComment>();
    @observable profileRegistery = new Map();
    @observable popularProfileRegistery = new Map();

    @observable popularProfileList: IProfile[] = [];
    @observable blogRegistery = new Map();
    @observable loadingProfile = true;
    @observable updatingProfile = false;
    @observable loadingPopularProfiles = true;
    @observable loadingOnlyProfiles = false;
    
    @observable loadingAccessibilities = false;
    @observable uploadingPhoto = false;
    @observable uploadingCoverImage = false;
    @observable submittingVideo = false;
    @observable submittingComment = false;
    @observable loadingForPhotoDeleteMain = false;
    @observable loading = false;
    @observable loadingComments = true;
    @observable loadingBlogs = true;
    @observable followings: IProfile[] = [];
    @observable activeTab: number = 0;
    @observable profileList: IProfile[] = [];
    @observable accessibilities: IAccessibility[] = [];
    @observable commentCount = 0;
    @observable commentPage = 0;
    @observable profilePageCount = 0;

    @observable blogCount = 0;
    @observable blogPage = 0;
    @observable userActivities: IUserActivity[] = [];
     @observable profileBlogs: IProfileBlog[] = [];
     @observable profileComments: IProfileComment[] = [];

    @observable loadingActivities = false;
    @observable submittingMessage = false;
    @observable updatedProfile = false;
    @observable deletingDocument = false;
    @observable profileForm: IProfileFormValues = new ProfileFormValues();
    @observable profileFilterForm: IProfileFilterFormValues = new ProfileFilterFormValues();

    @observable sortingInput ="";
    @observable loadingReferencePics = false;
    @observable uploadingReferencePics = false;
    @observable referencePics: IPhoto[] = [];
    @observable deletingReferencePic = false;
    @observable navSearchValue = "";
    @observable profileSearchAreaValue ="";
    @observable totalProfilePage = 0;
    @observable page = 0;
    @computed get isCurrentUser(){
        if (store.userStore.user && this.profile){
            return store.userStore.user.userName === this.profile.userName;
        }else {
            return false;
        }
    }
    @computed get totalProfileListPages(){
        return Math.ceil(this.profilePageCount / LIMIT);
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
    @action setPage = (page:number) =>{
        this.page = page;
    }
    @action setTotalProfilePage = (page:number) =>{
        this.profilePageCount = page;
    }
    @action setProfileNull = () =>{
        this.profile = null;
    }
    @action setSortingInput= (sort:string) =>{
        this.sortingInput = sort;
    }
    @computed get totalBlogPages(){
        return Math.ceil(this.blogCount / LIMIT);
    }

    @action clearProfileRegistery = () => {
        this.profileRegistery.clear();
    }

    @action setNavSearchValue = (value:string) => {
        this.navSearchValue = value;
    }

    @action setprofileSearchAreaValue = (value:string) => {
        this.profileSearchAreaValue = value;
    }

    @action clearPopularProfileRegistery = () => {
        this.popularProfileRegistery.clear();
    }

    @computed get getCommentsByDate(){
        // return this.activities.sort((a,b) => Date.parse(a.date) - Date.parse(b.date))
      //  return Array.from(this.activityRegistery.values()).sort((a,b) => Date.parse(a.date) - Date.parse(b.date))
          return Array.from(this.commentRegistery.values());
     }
 
    // @computed get getBlogsByDate(){
        // return this.activities.sort((a,b) => Date.parse(a.date) - Date.parse(b.date))
      //  return Array.from(this.activityRegistery.values()).sort((a,b) => Date.parse(a.date) - Date.parse(b.date))
       //   return Array.from(this.blogRegistery.values());
   //  }

    @action setActiveTab = (activeIndex: number) => {
        this.activeTab = activeIndex;
    }
    
    @action setProfileForm = (profile: IProfileFormValues) => {
        this.profileForm = profile;
    }
    @action setProfileFilterForm = (profile: IProfileFilterFormValues) => {
        this.profileFilterForm = profile;
    }
    
    @action clearProfileFilterForm = () => {
        this.profileFilterForm = new ProfileFilterFormValues();
    }
    @action setLoadingProfile = (lp : boolean) =>{
        this.loadingProfile = lp;
    }
    @action setuploadingReferencePics = (lp : boolean) =>{
        this.uploadingReferencePics = lp;
    }

    @action setupdatingProfile = (lp : boolean) =>{
        this.updatingProfile = lp;
    }

    

    
    @action setLoadingPopularProfiles = (lp : boolean) =>{
        this.loadingPopularProfiles = lp;
    }

    @action setUpdatedProfile = (up: boolean) =>{
        this.updatedProfile = up;
    }


    @action setReferencePics = (refPics:IPhoto[]) =>{
        this.referencePics = refPics;
    }

    @action sendTrainerComment = async (comment: IProfileComment) =>{
        comment.username= this.profile!.userName;
        this.submittingComment = true;
        try {
            var newComment = await agent.Profiles.createComment(comment);
            runInAction(() => {
              //  this.commentRegistery.set(newComment.id, newComment);
                this.submittingComment = false;
                toast.success('Uzman hakkındaki yorumunuz en yakın zamanda değerlendirilip yayınlanmak üzere tarafımıza iletildi.');
            });
        } catch (error) {
            runInAction( () => {
                this.submittingComment = false;
            });
            toast.error('Problem submitting data');
            console.log(error);
        }
    };

    @action loadComments = async (username: string) =>{
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
        this.loadingBlogs = true;

        try {
            const profileBlogListEnvelope = await agent.Profiles.listBlogs(username, 4, this.blogPage);
            const {profileBlogs, profileBlogsCount } = profileBlogListEnvelope;

            runInAction(()=>{
                // profileBlogs.forEach((blog) =>{
                //     //set props, Activity store'a bakıp kullanıcı commentini belirleme işlemi yapabilirsin..
                //     this.blogRegistery.set(blog.id, blog);
                // });
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
    

        this.updatedProfile = false;             
        return this.profileRegistery.get(username);
    }
    @action loadProfile = async (username: string) =>{
       
            this.setLoadingProfile(true);
            this.updatedProfile = false;             
            this.setCommentPage(0);
            this.setBlogPagination(0);
            this.commentRegistery.clear();
            this.blogRegistery.clear();
            try {
                const profile = await agent.Profiles.get(username);
                runInAction(()=>{
                    this.profile = profile;
                    this.loadingBlogs = true;
                    this.loadingComments = true;
                    this.loadUserActivities(profile.userName);
                    this.loadBlogs(profile.userName);
                    this.loadComments(profile.userName);
                    this.loadUserReferencePics(profile.userName);
                    this.setLoadingProfile(false);
                    this.loadAccessibilities();
                    store.categoryStore.loadCategories();

                })
                return profile;
            } catch (error) {
                runInAction(()=>{
                    this.setLoadingProfile(false);
                })
                console.log(error);
            }
        
        
    }

    @computed get axiosParams(){
        const params = new URLSearchParams();
        params.append('limit', String(10));
        params.append('offset', `${this.page ? this.page * 10 : 0}`);
            
        if(this.profileFilterForm.categoryId !== "")
        {   
          params.append("categoryId", this.profileFilterForm.categoryId);
        }
        if(this.profileFilterForm.subCategoryIds.length > 0)
        {  
            this.profileFilterForm.subCategoryIds.map((subId) => (
                params.append("subCategoryIds", subId)
            )); 
        }
        if(this.profileFilterForm.cityId !== "")
        {   
          params.append("cityId", this.profileFilterForm.cityId);
        }
        if(this.profileFilterForm.accessibilityId !== "")
        {   
          params.append("accessibilityId", this.profileFilterForm.accessibilityId);
        }

        if(this.sortingInput !== "")
        {   
          params.append("sort", this.sortingInput);
        }
      
        return params;
    }


    @action loadPopularProfiles = async () =>{
        this.loadingPopularProfiles = true;
        this.loadingOnlyProfiles = true;
        try {
            var params = this.axiosParams;
            const popularProfiles= await agent.Profiles.popularlist(this.axiosParams);
            runInAction(()=>{
                popularProfiles.forEach((profile) =>{
                    this.popularProfileRegistery.set(profile.userName, profile);
                });
                this.popularProfileList=popularProfiles;
                this.loadingPopularProfiles = false;
                if(popularProfiles.length > 0)
                    this.loadProfiles(params);
                else
                {
                    this.clearProfileRegistery();   
                    this.profileList = [];
                    this.loadingOnlyProfiles = false;
                }  
             
            })
        } catch (error) {
            runInAction(()=>{
                this.loadingPopularProfiles = false;
            })
            console.log(error);
        }
    }

    @action loadProfiles = async (params?:URLSearchParams) =>{
        this.loadingOnlyProfiles = true;
        try {
            const profilesEnvelope= await agent.Profiles.list(params ? params : this.axiosParams);
            const {profileList, profileCount } = profilesEnvelope;

            runInAction(()=>{
                profileList.forEach((profile) =>{
                    this.profileRegistery.set(profile.userName, profile);
                });
                this.profileList = profileList;
                this.setTotalProfilePage(profileCount);
                this.loadingOnlyProfiles = false;
            })
        } catch (error) {
            runInAction(()=>{
                this.loadingOnlyProfiles = false;
            })
            console.log(error);
        }
    }

    @action updateProfile = async (profileDto: Partial<IProfileFormValues>) =>{
        this.setupdatingProfile(true);
                    try {
                    const pro = await agent.Profiles.updateProfile(profileDto);
                    runInAction(()=>{

                        if(pro.displayName !== store.userStore.user!.displayName){
                            store.userStore.user!.displayName = pro.displayName!;
                        }
                        this.profile = pro;  
                        this.updatedProfile = true; 
                        this.setupdatingProfile(false);
 
                    })
                } catch (error) {
                    this.setupdatingProfile(false);
                    toast.error('Problem saving changes');
                }
               // }
 
    }

    @action deleteDocument = async (id:string) =>{
        this.deletingDocument = true;
        try {
            await agent.Profiles.deleteDocument(id);
            runInAction(() => {
                if(this.profile)
                {
                    this.profile.certificates = this.profile.certificates.filter(e => e.id !== id);
                    this.profileForm.certificates = this.profileForm.certificates!.filter(e => e.id !== id);
                    this.deletingDocument = false;
                    toast.success('Dokuman silme işleminiz başarılı.');
                }else if(store.userStore.user)
                {
                    store.userStore.trainerForm.certificates = store.userStore.trainerForm.certificates!.filter(e => e.id !== id);
                    this.deletingDocument = false;
                    toast.success('Dokuman silme işleminiz başarılı.');
                }
            })
        } catch (error) {
            console.log(error);
            toast.error('Problem deleting document');
            runInAction(() => {
                this.deletingDocument = false;
            })
            
        }
    }

    @action deleteComment = async (id:string) =>{
        this.submittingComment = true;
        try {
            await agent.Profiles.deleteComment(id);
            runInAction(() => {
                this.commentRegistery.delete(id);
                this.submittingComment = false;
            });
        } catch (error) {
            runInAction( () => {
                this.submittingComment = false;
            });
            toast.error('Problem submitting data');
            console.log(error);
        }
    }

    @action reportComment = async (id:string, body:string) =>{
        this.submittingComment = true;
        try {
            await agent.Profiles.reportComment(id,body);
            runInAction(() => {
                toast.success('En yakın zamanda değerlendirilmek üzere şikayetiniz tarafımıza iletildi.');
                this.submittingComment = false;
            });
        } catch (error) {
            runInAction( () => {
                this.submittingComment = false;
            });
            toast.error('Problem submitting data');
            console.log(error);
        }
    }

    @action uploadPhoto = async (file: Blob,name:string) => {
        this.uploadingPhoto = true;

        try {
            const photo = await agent.Profiles.uploadPhoto(file,name);
            runInAction(() => {
                if(this.profile)
                {
                    this.profile.photos.push(photo);
                    if(photo.isMain && store.userStore.user)
                    {
                        store.userStore.user.image = photo.url;
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

    @action uploadCoverPic = async (file: Blob,setImageChange: React.Dispatch<React.SetStateAction<boolean>>, name:string) => {
        this.uploadingCoverImage = true;

        try {
            const photo = await agent.Profiles.uploadCoverPic(file,name);
            runInAction(() => {
                if(this.profile)
                {
                    
                    if(photo.isCoverPic && store.userStore.user)
                    {
                        setImageChange(false);
                        this.profile.coverImage = photo.url;
                    }
                }

                this.uploadingCoverImage = false;
            })
        } catch (error) {
            console.log(error);

            if((error as any).status === 400)
            toast.warning('Cover photo has been already updated');
            else 
            toast.error('Problem uploading cover photo');

            runInAction(() => {
                this.uploadingCoverImage = false;
            })
            
        }
    }


    @action setMainPhoto = async (photo: IPhoto, name: string) => {
        this.loadingForPhotoDeleteMain = true;

        try {
            await agent.Profiles.setMainPhoto(photo.id, name);
            runInAction(() => {
                store.userStore.user!.image = photo.url;
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

    @action deletePhoto = async (photo: IPhoto, name: string) => {
        this.loadingForPhotoDeleteMain = true;

        try {
            await agent.Profiles.deletePhoto(photo.id, name);
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

    @action uploadProfileVideo = async (url: string, name:string) =>{
        this.submittingVideo = true;
        try {
            var result = await agent.Profiles.uploadProfileVideo(url, name);
            runInAction( () => {
                this.profile!.videoUrl =url;
                this.submittingVideo = false;
            });
        } catch (error) {
            runInAction( () => {
                this.submittingVideo = false;
            });
            toast.error('Problem submitting data');
            console.log(error);
        }
    };

    @action follow = async (username: string) => {
        this.loading = true;
        try {
            await agent.Profiles.follow(username);
            runInAction(() =>{
                this.loading = false;

                if(this.profile && this.profile.userName === username)
                {
                    this.profile!.isFollowing = true;
                    this.profile!.followerCount++;
                    // this.followings = [...this.followings, this.profile!];
                    const predicate = this.activeTab ===4 ? 'followers' : this.activeTab === 3 ? 'following' : null ;
                    if(predicate)
                    this.loadFollowings(predicate);
                }
            })
        } catch (error) {
            toast.error('Favorilere eklenemedi.');
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
                this.loading = false;

                if(this.profile && this.profile.userName === username)
                {
                    this.profile.isFollowing = false;
                    this.profile!.followerCount--;
                    // this.followings = this.followings.filter(x => x.userName === username);
                    const predicate = this.activeTab ===4 ? 'followers' : this.activeTab === 3 ? 'following' : null ;
                    if(predicate)
                     this.loadFollowings(predicate);
                }
               
            })
        } catch (error) {
            toast.error('Favorilerden çıkarılamadı.');
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


    groupActivitiesByDate = (activities:IUserActivity[]) : {[key:string]:IUserActivity[]} =>{
    return activities.reduce((accs,activity) =>{
         const date = activity.date.toISOString().split('T')[0];
         accs[date] = accs[date] ? [...accs[date],activity] : [activity]
        return accs;
       },{} as {[key:string]:IUserActivity[]})
    }

    @action loadUserActivities = async (username: string, predicate?: string) => {
        this.loadingActivities = true;
        try {
            
            const activities = await agent.Profiles.listActivities(username, predicate!);
            runInAction(() =>{
                const a = this.groupActivitiesByDate(activities);
                debugger;
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
        message.receiver= this.profile!.userName;
        this.submittingMessage = true;
        try {
            const newMessage = await agent.Profiles.sendMessage(message);
            runInAction(() => {
                this.submittingMessage = false;
                this.profile!.hasConversation = true;

                // if(store.messageStore.chatRooms!==null)
                // store.messageStore.chatRooms.push(new ChatRoom(newMessage.chatRoomId))
                // else {
                //     store.messageStore.chatRooms = [];
                //     store.messageStore.chatRooms.push(new ChatRoom(newMessage.chatRoomId));
                // }
                const senderName = store.userStore.user!.displayName;

                store.userStore.hubConnection === null ? 
                store.userStore.createHubConnection(true).then(()=>{
                    store.userStore.hubConnection!.invoke('AddToNewChat', newMessage.chatRoomId, this.profile!.userName,senderName);
                })
                : 
                store.userStore.hubConnection!.invoke('AddToNewChat', newMessage.chatRoomId, this.profile!.userName,senderName);

            });
            return newMessage.chatRoomId;

        } catch (error) {
            runInAction(() => {
                this.submittingMessage = false;
            });
            toast.error('Problem sending message');
            console.log(error);
            return null;
        }
    };


    @action loadAccessibilities = async () =>{
             this.loadingAccessibilities = true;
             try {
                 const accessibilities = await agent.Profiles.getAccessibilities();
                 runInAction(()=>{
                     this.accessibilities = accessibilities;
                     this.loadingAccessibilities = false;
                 })
             } catch (error) {
                 runInAction(()=>{
                     this.loadingAccessibilities = false;
                 })
                 console.log(error);
             }
         
         
     }


     @action saveReferencePics = async (photos: any[], deletedPhotos: any[]) => {
        this.setuploadingReferencePics(true);

        try {
            const pics = await agent.Profiles.updateReferencePics(photos,deletedPhotos, this.profile!.userName);
            runInAction(() => {
                if(this.profile)
                {
                    this.setReferencePics(pics);
                    this.setuploadingReferencePics(false);

                }

            })
        } catch (error) {
            console.log(error);
            toast.error('Problem uploading');
            runInAction(() => {
                this.setuploadingReferencePics(false);
            })
            
        }
    }

     @action loadUserReferencePics = async (username:string) =>{
        this.loadingReferencePics = true;
        try {
            const refPics = await agent.Profiles.getReferencePics(username);
            runInAction(()=>{
                this.referencePics = refPics;
                this.loadingReferencePics = false;
            })
        } catch (error) {
            runInAction(()=>{
                this.loadingReferencePics = false;
            })
            console.log(error);
        }
    
    
}

@action deleteReferencePic = async (id: string) => {
    this.deletingReferencePic = true;

    try {
        await agent.Profiles.deleteReferencePic(id);
        runInAction(() => {
            
                this.referencePics = this.referencePics.filter(e => e.id !== id);
               this.deletingReferencePic = false;

        })
    } catch (error) {
        console.log(error);
        toast.error('Problem deleting pic');
        runInAction(() => {
           this.deletingReferencePic = false;
        })
        
    }
}

@action getSavedProfiles = async () => {
    this.loading = true;
    try {
        const profiles = await agent.Profiles.listFollowings(store.userStore.user!.userName, 'following');
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