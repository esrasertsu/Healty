import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import {observable, action, computed, runInAction, reaction, toJS} from 'mobx';
import { SyntheticEvent } from 'react';
import { toast } from 'react-toastify';
import { history } from '../..';
import agent from '../api/agent';
import { createAttendee, setActivityProps } from '../common/util/util';
import { ActivityFormValues, ActivityOnlineJoinInfo, IActivity, IActivityFormValues, IActivityMapItem, IActivityOnlineJoinInfo, ILevel, IPaymentCardInfo, IPaymentUserInfoDetails, PaymentUserInfoDetails } from '../models/activity';
import { RootStore } from './rootStore';

const LIMIT = 10;
export default class ActivityStore {

    rootStore:RootStore;
    constructor(rootStore: RootStore){
        this.rootStore = rootStore;

        reaction(
            () => this.predicate.keys(),
            () => {
                if(!this.clearPredicateBeforeSearch)
                {
                    this.page=0;
                    this.activityRegistery.clear();
                    this.loadActivities();
                }
            }
        )
    }

    @observable activityRegistery = new Map();
    @observable activity: IActivity | null = null;
    @observable loadingInitial = false;
    @observable loadingActivity = false;
    @observable levelList: ILevel[] = [];
    @observable loadingLevels = false;
    @observable generatingToken = false;
    @observable submittingJoinInfo = false;
    @observable zoomResponse = "";
    @observable clearPredicateBeforeSearch= false;
    @observable submitting = false;
    @observable target = '';
    @observable loading = false;

    @observable markers : IActivityMapItem[] | null = null;
    @observable selected : IActivityMapItem | null = null;

    @observable.ref hubConnection : HubConnection | null = null;
    @observable activityCount = 0;
    @observable page = 0;
    @observable predicate = new Map();
    @observable activityForm: IActivityFormValues = new ActivityFormValues();
    @observable activityOnlineJoinInfo: IActivityOnlineJoinInfo = new ActivityOnlineJoinInfo();
    @observable activityUserPaymentInfo: IPaymentUserInfoDetails = new PaymentUserInfoDetails();



    /* Aktivite Filtre observeleri */
    @observable activeIndex = -1;
    @observable categoryIds:string[] = []
    @observable subCategoryIds:string[] = []
    @observable levelIds:string[] = []
    @observable cityId:string = ""

    @observable activeUserPreIndex = 0;

    @observable isOnline = false;
    @observable loadingPaymentPage = false;
    @action setActiveIndex = (index:number) =>{
        this.activeIndex = index;
    }
    @action setActiveUserPreIndex = (index:number) =>{
        this.activeUserPreIndex = index;
    }

    @action setCategoryIds = (Ids : string[]) =>{
        this.categoryIds = Ids;
    }
    @action setSubCategoryIds = (Ids : string[]) =>{
        this.subCategoryIds = Ids;
    }

    @action setLevelIds = (Ids : string[]) =>{
        this.levelIds = Ids;
    }
    @action setCityId = (Id : string) =>{
        this.cityId = Id;
    }
    @action setIsOnline = (bool : boolean) =>{
        this.isOnline = bool;
    }
  
    /* ---- */

    
    @computed get totalPages(){
        return Math.ceil(this.activityCount / LIMIT);
    }

    @action setPage = (page:number) =>{
        this.page = page;
    }
    @action setActivityForm = (activity: IActivityFormValues) => {
        this.activityForm = activity;
    }
    @action setActivityOnlineJoinInfoForm = (activity: IActivityOnlineJoinInfo) => {
        this.activityOnlineJoinInfo = activity;
    }
    @action setActivityUserPaymentInfo = (info: IPaymentUserInfoDetails) => {
        this.activityUserPaymentInfo = info;
    }
    @action setPredicate = (predicate:string, value:string | Date| string[]| boolean) => {
        this.predicate.set(predicate,value);
    }
    @action setClearPredicateBeforeSearch = (clear:boolean) => {
        this.clearPredicateBeforeSearch = clear;
    }

    @action clearUserPredicates = () => {
        this.predicate.delete("isGoing");
        this.predicate.delete("isHost");
        this.predicate.delete("isFollowed");
        this.predicate.delete("all");
    }
    @action clearKeyPredicate = (key:string) => {
        this.predicate.delete(key);
    }
    @action deleteActivityRegisteryItem = (id:string) => {
        this.activityRegistery.delete(id);
    }

    @action clearActivityRegistery = () => {
        this.activityRegistery.clear();
    }

    
    @action setLoadingInitial = (lp : boolean) =>{
        this.loadingInitial = lp;
    }

    @action setMarkers = (markers : IActivityMapItem[]) =>{
        this.markers = markers;
    }

    @action setSelected = (selected : IActivityMapItem | null) =>{
        this.selected = selected;
    }
    @action setLoadingLevels = (lp : boolean) =>{
        this.loadingLevels = lp;
    }

    @computed get axiosParams(){
        const params = new URLSearchParams();
        params.append('limit', String(LIMIT));
        params.append('offset', `${this.page ? this.page * LIMIT : 0}`);
        this.predicate.forEach((value,key) => {
            if(key === 'startDate'){
                params.append(key, value.toISOString());
            }else if(key === 'endDate'){
                params.append(key, value.toISOString());
            }else if(key === 'categoryIds'){
                value.map((id:string) => (
                    params.append("categoryIds", id)
                )); 
            }
            else if(key === 'subCategoryIds'){
                value.map((id:string) => (
                    params.append("subCategoryIds", id)
                )); 
            }
            else if(key === 'levelIds'){
                value.map((id:string) => (
                    params.append("levelIds", id)
                )); 
            }
            else if(key === 'all'){
                params.append("isFollowed", "false")
                params.append("isGoing", "false")
                params.append("isHost", "false")
            } else if(key === 'isOnline'){
                params.append("isOnline", String(value))
            }else {
                params.append(key, value);
            }

        })
        return params;
    }


    @action createHubConnection = (activityId: string) => {
        this.hubConnection = new HubConnectionBuilder()
        .withUrl(process.env.REACT_APP_API_CHAT_URL!,{
            accessTokenFactory: () => this.rootStore.commonStore.token!
        })
            .configureLogging(LogLevel.Information)
            .build();

        this.hubConnection
        .start()
        .then(() => console.log(this.hubConnection!.state))
        .then(() => {
            if(this.hubConnection!.state === 'Connected')
            {
                this.hubConnection!.invoke('AddToGroup', activityId);
            }
        })
        .catch(error => 
            console.log('Error establishing connection:', error));


        this.hubConnection.on('ReceiveComment', comment => {
            runInAction(() => {
                this.activity!.comments.push(comment);
            })
        })

        this.hubConnection.on('Send', message => {
            toast.info(message);
        })
    };


    @action stopHubConnection = () => {
        this.hubConnection!.invoke('RemoveFromGroup', this.activity!.id)
        .then(() => {
            this.hubConnection!.stop();
        })
        .then(() => console.log('Connection stopped'))
        .catch(err => console.log(err))
    }

    @action addComment = async (values: any) => {
        values.activityId = this.activity!.id;
        try {
            await this.hubConnection!.invoke("SendComment", values);
        } catch (error) {
            console.log(error);
        }

    }
    @computed get activitiesByDate(){
       // return this.activities.sort((a,b) => Date.parse(a.date) - Date.parse(b.date))
     //  return Array.from(this.activityRegistery.values()).sort((a,b) => Date.parse(a.date) - Date.parse(b.date))
         return this.groupActivitiesByDate(Array.from(this.activityRegistery.values()));
    }

    groupActivitiesByDate(activities: IActivity[]){
        const sortedActivities = activities.sort(
            (a,b) => a.date.getTime() -b.date.getTime()
        )

        return Object.entries(sortedActivities.reduce((activities, activity) =>{
            const date = activity.date.toISOString().split('T')[0];
            activities[date] = activities[date] ? [...activities[date], activity]: [activity];
            return activities;
         },
       {} as {[key:string]: IActivity[]}));
    }

    @action loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activitiesEnvelope = await agent.Activities.list(this.axiosParams);
            const {activities, activityCount } = activitiesEnvelope;
            runInAction('Loading activities',() => {
                activities.forEach((activity) =>{
                    setActivityProps(activity,this.rootStore.userStore.user!)
                    this.activityRegistery.set(activity.id, activity);
                });
                this.activityCount = activityCount;
                this.loadingInitial = false;
                this.rootStore.categoryStore.allCategoriesOptionList.length === 0 && this.rootStore.categoryStore.loadAllCategoryList();
            })
            } catch (error) {
                console.log(error);
                runInAction('Loading activities error',() => {
                  this.loadingInitial = false
                });
            }
    };

    @action loadActivity = async (id:string) => {
        let activity = this.getActivity(id);

        if(activity){
            this.activity = activity;
            this.rootStore.categoryStore.loadAllCategoryList();
            return toJS(activity);
        } 
        else{
            this.loadingActivity = true;
            try {
                let activity = await agent.Activities.details(id);
                runInAction('Getting activity',() => {
                    setActivityProps(activity,this.rootStore.userStore.user!)
                    this.rootStore.categoryStore.loadAllCategoryList();
                    this.activity = activity;
                    this.activityRegistery.delete(activity.id);
                    this.activityRegistery.set(activity.id, activity);
                    this.loadingActivity = false;
                })
                return activity;
                } catch (error) {
                    runInAction('Getting activity error',() => {
                      this.loadingActivity = false
                    });
                    console.log(error);
                }
            }
    };

    @action clearActivity = () => {
        this.activity = null;
    }

    getActivity = (id:string) => {
        return this.activityRegistery.get(id);
    }

    @action createActivity = async (activity: IActivityFormValues) =>{
        this.submitting = true;
        try {
            var newAct = await agent.Activities.create(activity);
            //const attendee = createAttendee(this.rootStore.userStore.user!);
            // attendee.isHost = true;
            // let attendees = [];
            // attendees.push(attendee);
            // activity.attendees = attendees;
            // activity.comments = [];
            // activity.isHost = true;            
            runInAction('Creating activity', () => {
                setActivityProps(newAct,this.rootStore.userStore.user!)
                this.activityRegistery.set(newAct.id, newAct);
                this.activity = newAct;
                this.submitting = false;
                history.push(`/activities/${newAct.id}`);
            });
        } catch (error) {
            runInAction('Creating activity error', () => {
                this.submitting = false;
            });
            toast.error('Problem submitting data');
            console.log(error);
        }
    };

    @action editActivity = async (activity: IActivityFormValues) =>{
        debugger;
        this.submitting = true;
        try {
            var activityReturned = await agent.Activities.update(activity);
            runInAction('Editing activity', () => {
            setActivityProps(activityReturned,this.rootStore.userStore.user!)
            this.activityRegistery.delete(activity.id);
            this.activityRegistery.set(activity.id, activityReturned);
            this.activity = activityReturned;
            this.submitting = false;
            history.push(`/activities/${activity.id}`);

            });
        } catch (error) {
            runInAction('Editing activity error', () => {
                this.submitting = false;
            });
            

            console.log(error);
        }
    }

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        debugger;
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await agent.Activities.delete(id);
            runInAction('Deleting activitiy', () => {
                this.activityRegistery.delete(id);
                this.submitting = false;
                this.target = '';
                history.push(`/activities`);
            });
        } catch (error) {
            runInAction('Deleting activitiy error', () => {
                this.submitting = false;
                this.target = '';
            });
            console.log(error);
        }
    }

    @action attendActivity = async() => {
       const attendee = createAttendee(this.rootStore.userStore.user!);
       this.loading = true;
       try {
           await agent.Activities.attend(this.activity!.id);
           runInAction(()=>{
            if(this.activity){
                this.activity.attendees.push(attendee);
                this.activity.isGoing= true;
                this.activityRegistery.set(this.activity.id, this.activity);
                this.loading = false;
            }
           })


       }catch(err){
        runInAction('Deleting activitiy error', () => {
            this.loading = false;
        });
        toast.error('Problem signing up to activities');

       }
    }

    @action cancelAttendance = async() => {
        this.loading = true;

        try {
            await agent.Activities.unattend(this.activity!.id);
            runInAction(()=>{
                if(this.activity){
                    this.activity.attendees = this.activity.attendees.filter(a => a.userName !== this.rootStore.userStore.user!.userName);
                    this.activity.isGoing = false;
                    this.activityRegistery.set(this.activity.id, this.activity);
                    this.loading = false;
                }
            })
        } catch (error) {
            runInAction('Deleting activitiy error', () => {
                this.loading = false;
            });
            toast.error('Problem cancelling attendance');

        }
       
    }

    @action loadLevels = async () =>{
        this.loadingLevels = true;

        try {
            const levelList = await agent.Activities.listLevels();
            runInAction(()=>{
                this.levelList = levelList;
                this.loadingLevels = false;
            })
        } catch (error) {
            runInAction(()=>{
                this.loadingLevels = false;
            })
            console.log(error);
        }
    }


    @action generateZoomToken = async (meetingId:string,role:string) =>{

        const params = new URLSearchParams();
        params.append('activityId', this.activity!.id);
        params.append('meetingId', meetingId);
        params.append('role', role);

        this.generatingToken = true;

        try {
            const response = await agent.Zoom.generateToken(params);
            runInAction(()=>{
                this.zoomResponse = response;
                this.generatingToken = false;
            })
            return response;
        } catch (error) {
            runInAction(()=>{
                this.generatingToken = false;
            })
            return "";
            console.log(error);
        }
    }

    @action updateOnlineJoinInfo = async (form: IActivityOnlineJoinInfo) =>{
        this.submittingJoinInfo = true;
        try {
            form.id = this.activity!.id;
            const result = await agent.Activities.editOnlineJoinInfo(form);
            runInAction('Updating join details', () => {
                this.submittingJoinInfo = false;
                this.activity!.activityJoinDetails = new ActivityOnlineJoinInfo();
                this.activity!.activityJoinDetails.activityUrl = form.activityUrl;
                this.activity!.activityJoinDetails.meetingId = form.meetingId;
                this.activity!.activityJoinDetails.meetingPsw = form.meetingPsw;
                this.activity!.activityJoinDetails.zoom = form.zoom;


       });
        } catch (error) {
            runInAction('Updating join details error', () => {
                this.submittingJoinInfo = false;
            });
            toast.error('Problem updating join details');
            console.log(error);
        }
    };


    @action getActivityPaymentPage = async (count:number,activityId:string) =>{
        this.loadingPaymentPage = true;
        try {
            const result = await agent.Payment.getActivityPaymentPage(count,activityId);
            runInAction('Opening payment content', () => {
                this.loadingPaymentPage = false;
               console.log(result);
            });
            return result;

        } catch (error) {
            runInAction('Opening payment content error', () => {
                this.loadingPaymentPage = false;
            });
            toast.error('Problem opening payment content');
            console.log(error);
        }
    };

    @action getIyzicoPaymentPage = async (details:IPaymentUserInfoDetails) =>{
        this.loadingPaymentPage = true;
        try {
            const res = await agent.Payment.getIyzicoPaymentPage(details);
            runInAction('Opening payment content', () => {
                this.loadingPaymentPage = false;
            });

            return res;

        } catch (error) {
            runInAction('Opening payment content error', () => {
                this.loadingPaymentPage = false;
            });
            toast.error('Problem opening payment content');
            console.log(error);
        }
    };

    @action processPayment = async (details:IPaymentCardInfo) =>{
        this.loadingPaymentPage = true;
        try {
            const res = await agent.Payment.processPayment(details);
            runInAction('Processing payment', () => {
                this.loadingPaymentPage = false;
            });

            return res;

        } catch (error) {
            runInAction('Processing payment error', () => {
                this.loadingPaymentPage = false;
            });
            toast.error('Problem Processing payment');
            console.log(error);
        }
    };
}
