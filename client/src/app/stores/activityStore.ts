import {observable, action, computed, configure, runInAction} from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import agent from '../api/agent';
import { IActivity } from '../models/activity';

configure({enforceActions: 'always'});

class ActivityStore {
    @observable activityRegistery = new Map();
    @observable activities: IActivity[] = [];
    @observable selectedActivity: IActivity | undefined;
    @observable loadingInitial = false;
    @observable editMode = false;
    @observable submitting = false;
    @observable target = '';

    @computed get activitiesByDate(){
       // return this.activities.sort((a,b) => Date.parse(a.date) - Date.parse(b.date))
       return Array.from(this.activityRegistery.values()).sort((a,b) => Date.parse(a.date) - Date.parse(b.date))
    }

    @action loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            runInAction('Loading activities',() => {
                activities.forEach((activity) =>{
                    activity.date = activity.date.split('.')[0];
                    //this.activities.push(activity);
                    this.activityRegistery.set(activity.id, activity);
                });
                this.loadingInitial = false
            })
            } catch (error) {
                console.log(error);
                runInAction(() => {
                  this.loadingInitial = false
                });
            }
    };

    @action createActivity = async (activity: IActivity) =>{
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            runInAction('Creating activity', () => {
                this.activityRegistery.set(activity.id, activity);
                this.editMode = false;
                this.submitting = false;
            });
        } catch (error) {
            runInAction('Creating activity error', () => {
                this.submitting = false;
            });
            console.log(error);
        }
    };

    @action selectActivity = ( id: string) => {
        this.selectedActivity = this.activityRegistery.get(id);// this.activities.find(a => a.id === id);
        this.editMode = false;
    };

    @action editActivity = async (activity: IActivity) =>{
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            runInAction('Editing activity', () => {
            this.activityRegistery.set(activity.id, activity);
            this.selectedActivity = activity;
            this.editMode = false;
            this.submitting = false;
            });
        } catch (error) {
            runInAction('Editing activity error', () => {
                this.submitting = false;
            });
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

    @action openCreateForm = () => {
        this.editMode = true;
        this.selectedActivity = undefined;
    }

    @action openEditForm = (id: string) => {
        this.selectedActivity = this.activityRegistery.get(id);
        this.editMode = true;
    }

    @action cancelSelectedActivity = () =>{
        this.selectedActivity = undefined;
    }

    @action cancelFormOpen = () => {
        this.editMode = false;
    }
}

export default createContext(new ActivityStore())