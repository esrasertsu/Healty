import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import {observable, action, computed, runInAction} from 'mobx';
import { SyntheticEvent } from 'react';
import { toast } from 'react-toastify';
import { history } from '../..';
import agent from '../api/agent';
import { createAttendee, setActivityProps } from '../common/util/util';
import { IActivity, IActivityMapItem } from '../models/activity';
import { RootStore } from './rootStore';

export default class ActivityStore {

    rootStore:RootStore;
    constructor(rootStore: RootStore){
        this.rootStore = rootStore;
    }

    @observable activityRegistery = new Map();
    @observable activity: IActivity | null = null;
    @observable loadingInitial = false;
    @observable loadingActivity = false;
    
    @observable submitting = false;
    @observable target = '';
    @observable loading = false;

    @observable markers : IActivityMapItem[] | null = null;
    @observable selected : IActivityMapItem | null = null;

    @observable.ref hubConnection : HubConnection | null = null;

    @action createHubConnection = (activityId: string) => {
        this.hubConnection = new HubConnectionBuilder()
        .withUrl('http://localhost:5000/chat',{
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


    @action setLoadingInitial = (lp : boolean) =>{
        this.loadingInitial = lp;
    }

    @action setMarkers = (markers : IActivityMapItem[]) =>{
        this.markers = markers;
    }

    @action setSelected = (selected : IActivityMapItem | null) =>{
        this.selected = selected;
    }

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
            const activities = await agent.Activities.list();
            runInAction('Loading activities',() => {
                activities.forEach((activity) =>{
                    setActivityProps(activity,this.rootStore.userStore.user!)
                    this.activityRegistery.set(activity.id, activity);
                });
                this.loadingInitial = false
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
            return activity;
        } 
        else{
            this.loadingActivity = true;
            try {
                activity = await agent.Activities.details(id);
                runInAction('Getting activity',() => {
                    setActivityProps(activity,this.rootStore.userStore.user!)
                    this.activity = activity;
                    this.activityRegistery.set(activity.id, activity);
                    this.loadingActivity = false
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

    @action createActivity = async (activity: IActivity) =>{
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            const attendee = createAttendee(this.rootStore.userStore.user!);
            attendee.isHost = true;
            let attendees = [];
            attendees.push(attendee);
            activity.attendees = attendees;
            activity.comments = [];
            activity.isHost = true;            
            runInAction('Creating activity', () => {
                this.activityRegistery.set(activity.id, activity);
                this.submitting = false;
            });
            history.push(`/activities/${activity.id}`);
        } catch (error) {
            runInAction('Creating activity error', () => {
                this.submitting = false;
            });
            toast.error('Problem submitting data');
            console.log(error);
        }
    };

    @action editActivity = async (activity: IActivity) =>{
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            runInAction('Editing activity', () => {
            this.activityRegistery.set(activity.id, activity);
            this.activity = activity;
            this.submitting = false;
            });
            history.push(`/activities/${activity.id}`);
        } catch (error) {
            runInAction('Editing activity error', () => {
                this.submitting = false;
            });
            toast.error('Problem submitting data');
            console.log(error);
        }
    }

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await agent.Activities.delete(id);
            runInAction('Deleting activitiy', () => {
                this.activityRegistery.delete(id);
                this.submitting = false;
                this.target = '';
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

}
