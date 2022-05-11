import { HttpTransportType, HubConnection, HubConnectionBuilder, JsonHubProtocol, LogLevel } from '@microsoft/signalr';
import {observable, action, computed, runInAction, reaction, toJS,makeObservable} from 'mobx';
import { SyntheticEvent } from 'react';
import { toast } from 'react-toastify';
import { history } from '../..';
import ProfileDashboardPopularProfiles from '../../features/profiles/ProfileDashboardPopularProfiles';
import agent from '../api/agent';
import { createAttendee, setActivityProps } from '../common/util/util';
import { ActivityFormValues, ActivityOnlineJoinInfo, ActivityStatus, IActivity, IActivityFormValues, IActivityMapItem, IActivityOnlineJoinInfo, IActivityReview, IActivitySelectedFilter, ILevel, IPaymentCardInfo, IPaymentUserInfoDetails, IPersonalActivity, PaymentUserInfoDetails } from '../models/activity';
import { IOrder } from '../models/order';
import { RootStore } from './rootStore';

const LIMIT = 6;
export default class ActivityStore {

    rootStore:RootStore;
    constructor(rootStore: RootStore){
        this.rootStore = rootStore;
        makeObservable(this);


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
    @observable personalActivityRegistery = new Map<string, IPersonalActivity>();
    @observable orderRegistery = new Map<string,IOrder>();
    @observable activity: IActivity | null = null;
    @observable order: IOrder | null = null;
    @observable savedActivities: IActivity[] = [];
    @observable loadingInitial = false;
    @observable loadingActivity = false;
    @observable loadingOrders = false;
    @observable loadingOrder = false;
    @observable levelList: ILevel[] = [];
    @observable activitySelectedFilters: IActivitySelectedFilter[] =[];
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
    @observable orderCount = 0;
    @observable personalActivityCount = 0;
    @observable orderPage = 0;

    @observable personalActivityPage = 0;
    @observable predicate = new Map();
    @observable activityForm: IActivityFormValues = new ActivityFormValues();
    @observable activityOnlineJoinInfo: IActivityOnlineJoinInfo = new ActivityOnlineJoinInfo();
    @observable activityUserPaymentInfo: IPaymentUserInfoDetails = new PaymentUserInfoDetails();
   @observable personalActStatus:string = "";


    /* Aktivite Filtre observeleri */
    @observable activeIndex = -1;
    @observable categoryIds:string[] = []
    @observable subCategoryIds:string[] = []
    @observable levelIds:string[] = []
    @observable cityId:string = ""

    @observable activeUserPreIndex = 0;

    @observable isOnline = false;
    @observable loadingPaymentPage = false;
    @observable loadingRefundPaymentPage = false;
    @observable selectedStartDate : Date | undefined = new Date();
    @observable selectedEndDate: Date | undefined = new Date();

    @action setActiveIndex = (index:number) =>{
        this.activeIndex = index;
    }
    @action setActivity = (ac:IActivity | null) =>{
        this.activity = ac;
    }
    @action setActiveUserPreIndex = (index:number) =>{
        this.activeUserPreIndex = index;
    }
    @action setSelectedStartDate = (date:Date | undefined ) =>{
        this.selectedStartDate = date;
    }
    @action setSelectedEndDate = (date:Date | undefined ) =>{
        this.selectedEndDate = date;
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
    @action setOrderPage = (index:number) =>{
        this.orderPage = index;
    }

    @action setPersonalActivityPage = (index:number) =>{
        this.personalActivityPage = index;
    }
    @action setPersonalActStatus = (status:string) =>{
        this.personalActStatus = status;
    }

    @action setActivitySelectedFilters = (selectedFilters:IActivitySelectedFilter[]) => {
        this.activitySelectedFilters = selectedFilters;
    }
    /* ---- */

    
    @computed get totalPages(){
        return Math.ceil(this.activityCount / LIMIT);
    }

    @computed get totalOrderPages(){
        return Math.ceil(this.orderCount / 5);
    }

    @computed get totalPersonalActPages(){
        return Math.ceil(this.personalActivityCount / 5);
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
    @action deleteOrderRegisteryItem = (id:string) => {
        this.orderRegistery.delete(id);
    }
    @action clearActivityRegistery = () => {
        this.activityRegistery.clear();
    }

    @action clearOrderRegistery = () => {
        this.orderRegistery.clear();
    }

    @action clearPersonalActRegistery = () => {
        this.personalActivityRegistery.clear();
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


    @computed get personalActAxiosParams(){
        const params = new URLSearchParams();
        params.append('limit', String(LIMIT));
        params.append('offset', `${this.personalActivityPage ? this.personalActivityPage * LIMIT : 0}`);

        params.append("userName", this.rootStore.userStore.user!.userName)
        params.append("status", this.personalActStatus)

      
        return params;
    }
 

    @action createHubConnection = (activityId: string) => {
    
        const protocol = new JsonHubProtocol();
    
        // let transport to fall back to to LongPolling if it needs to
        const transport = HttpTransportType.WebSockets | HttpTransportType.LongPolling;

        const options = {
            transport,
            logMessageContent: true,
            logger: LogLevel.Warning,
            accessTokenFactory: () => this.rootStore.commonStore.token!
          };
    
        this.hubConnection = new HubConnectionBuilder()
        .withUrl(process.env.REACT_APP_API_CHAT_URL!,options)
        .withHubProtocol(protocol)
        .build();

        this.hubConnection.serverTimeoutInMilliseconds = 1000*60*63;

            this.hubConnection!
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
          //  toast.info(message);
        })
        this.hubConnection.onclose(() => setTimeout(this.createHubConnection(activityId), 5000));
        return "";
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

    @computed get orderList(){
          return Array.from(this.orderRegistery.values());
     }

     @computed get personalActivityList(){
        return Array.from(this.personalActivityRegistery.values());
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
            runInAction(() => {
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
                runInAction(() => {
                  this.loadingInitial = false
                });
            }
    };


    @action getTrainerActivities = async () => {
        this.loadingActivity = true;
        try {
            const activitiesEnvelope = await agent.Activities.listPersonalActs(this.personalActAxiosParams);
            const {activities, activityCount } = activitiesEnvelope;
            runInAction(() => {
                activities.forEach((activity) =>{
                    activity.date = new Date(activity.date);
                    activity.endDate = new Date(activity.endDate);
                    this.personalActivityRegistery.set(activity.id, activity);
                });
                this.personalActivityCount = activityCount;
                this.loadingActivity = false;
                this.rootStore.categoryStore.allCategoriesOptionList.length === 0 && this.rootStore.categoryStore.loadAllCategoryList();
            })
            } catch (error) {
                console.log(error);
                runInAction(() => {
                  this.loadingActivity = false
                });
            }
    };

    


    @action getOrders = async () => {
        this.loadingOrders = true;
        try {
            const ordersEnvelope = await agent.Order.list(5, this.orderPage ? this.orderPage * 5 : 0);
            const {orderList, orderCount } = ordersEnvelope;
            runInAction(() => {
                orderList.forEach((order) =>{
                    this.orderRegistery.set(order.id, order);
                });
                this.orderCount = orderCount;
                this.loadingOrders = false;
            })
            } catch (error) {
                console.log(error);
                runInAction(() => {
                  this.loadingOrders = false
                });
            }
    }

    @action loadActivity = async (id:string) => {
        this.loadingActivity = true;
        let activity = this.getActivity(id);

        if(activity){
            this.activity = activity;
            this.rootStore.categoryStore.loadAllCategoryList();
            this.loadingActivity = false;
            return toJS(activity);
        } 
        else{
            try {
                let activity = await agent.Activities.details(id);
                runInAction(() => {
                    setActivityProps(activity,this.rootStore.userStore.user!)
                    this.rootStore.categoryStore.loadAllCategoryList();
                    this.activity = activity;
                    this.loadingActivity = false;
                })
                return activity;
                } catch (error) {
                    runInAction(() => {
                      this.loadingActivity = false
                    });
                    console.log(error);
                }
            }
    };

    @action setAcitivityChannel = (channel:string) =>{
        this.activity!.channelName = channel;
    }

    @action updateActivityChannel = async (id:string,channelName:string) => {
        try {
            let response = await agent.Activities.editOnlineJoinInfo(id,channelName)
            runInAction(() => {
                this.activity && 
                this.setAcitivityChannel(channelName);
            })
            } catch (error) {
                console.log(error);
            }
    }
    @action getOrderDetails = async (id:string) => {
      
            this.loadingOrder = true;
            try {
                let order = await agent.Order.details(id);
                runInAction(() => {
                    this.order = order;
                    this.loadingOrder = false;
                })
                return order;
                } catch (error) {
                    runInAction(() => {
                      this.loadingOrder = false
                    });
                    console.log(error);
                }
            
    };

    

    @action clearActivity = () => {
        this.activity = null;
    }

    getActivity = (id:string) => {
        return this.activityRegistery.get(id);
    }

    getOrder = (id:string) => {
        return this.orderRegistery.get(id);
    }

    @action createActivity = async (activity: IActivityFormValues) =>{
        this.submitting = true;
        try {
           await agent.Activities.create(activity);
            //const attendee = createAttendee(this.rootStore.userStore.user!);
            // attendee.isHost = true;
            // let attendees = [];
            // attendees.push(attendee);
            // activity.attendees = attendees;
            // activity.comments = [];
            // activity.isHost = true;            
            runInAction( () => {
              //  setActivityProps(newAct,this.rootStore.userStore.user!)
              //  this.activityRegistery.set(newAct.id, newAct);
              //  this.activity = newAct;
              this.submitting = false;
            });
            
            return true;

        } catch (error) {
            runInAction(() => {
                this.submitting = false;
            });
            toast.error('Problem submitting data');
            console.log(error);
            return false;
        }
    };

    @action editActivity = async (activity: IActivityFormValues) =>{
        this.submitting = true;
        try {
            var activityReturned = await agent.Activities.update(activity);
            runInAction(() => {
            setActivityProps(activityReturned,this.rootStore.userStore.user!)
            this.activityRegistery.delete(activity.id);
            this.activityRegistery.set(activity.id, activityReturned);
            this.activity = activityReturned;
            this.submitting = false;
            history.push(`/activities/${activity.id}`);

            });
        } catch (error) {
            runInAction(() => {
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
            runInAction( () => {
                this.activityRegistery.delete(id);
                this.submitting = false;
                this.target = '';
                history.push(`/activities`);
            });
        } catch (error) {
            runInAction( () => {
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
        runInAction(() => {
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
                    this.activity.attendanceCount = this.activity.attendanceCount-1;
                    this.activityRegistery.set(this.activity.id, this.activity);
                    this.loading = false;
                }
            })
        } catch (error) {
            runInAction( () => {
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

    @action generateAgoraToken = async (channelName:string,activityId:string) =>{

        const params = new URLSearchParams();
        params.append('channelName', channelName);
        params.append('activityId',  activityId);

        this.generatingToken = true;

        try {
            const response = await agent.Agora.generateToken(params);
            runInAction(()=>{
                this.generatingToken = false;
            })
            return response;
        } catch (error) {
            runInAction(()=>{
                this.generatingToken = false;
            })
            console.log(error);
            return "";
        }
    }


    @action updateOnlineJoinInfo = async (form: IActivityOnlineJoinInfo) =>{
    //     this.submittingJoinInfo = true;
    //     try {
    //         form.id = this.activity!.id;
    //         const result = await agent.Activities.editOnlineJoinInfo(form);
    //         runInAction(() => {
    //             this.submittingJoinInfo = false;
    //             this.activity!.activityJoinDetails = new ActivityOnlineJoinInfo();
    //             this.activity!.activityJoinDetails.activityUrl = form.activityUrl;
    //             this.activity!.activityJoinDetails.meetingId = form.meetingId;
    //             this.activity!.activityJoinDetails.meetingPsw = form.meetingPsw;
    //             this.activity!.activityJoinDetails.zoom = form.zoom;


    //    });
    //     } catch (error) {
    //         runInAction(() => {
    //             this.submittingJoinInfo = false;
    //         });
    //         toast.error('Problem updating join details');
    //         console.log(error);
    //     }
    };


    @action getActivityPaymentPage = async (count:number,activityId:string) =>{
        this.loadingPaymentPage = true;

        try {
            const result = await agent.Payment.getActivityPaymentPage(count,activityId);
            runInAction(() => {
                this.loadingPaymentPage = false;
               console.log(result);
            });
            return result;

        } catch (error) {
            runInAction( () => {
                this.loadingPaymentPage = false;
            });
            toast.error('Problem opening payment content');
            console.log(error);
        }
    };

    @action getUserPaymentDetailedInfo = async (details:IPaymentUserInfoDetails) =>{
        this.loadingPaymentPage = true;
        try {
            const res = await agent.Payment.getUserPaymentDetailedInfo(details);
            runInAction(() => {
                this.loadingPaymentPage = false;
            });

            return res;

        } catch (error) {
            runInAction(() => {
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
            runInAction(() => {
                this.loadingPaymentPage = false;
            });
            return res;

        } catch (error) {
            runInAction(() => {
                this.loadingPaymentPage = false;
            });
            toast.error(error.data.errors);//uyarı pop up'ı gösterilecek
            console.log(error);
        }
    };

    @action refundPayment = async (paymentTransactionId:string, activityId: string, orderId: string) =>{
        this.loadingRefundPaymentPage = true;
        try {
            const res = await agent.Payment.refundPayment(paymentTransactionId, activityId, orderId);
            runInAction(async() => {
                this.loadingRefundPaymentPage = false;
                if(res.status === "success")
                {
                    let activity = await this.loadActivity(activityId);                    
                    runInAction(() => {
                        activity.isGoing = false;
                        this.deleteActivityRegisteryItem(activity.id);
                        this.activityRegistery.set(activity.id, res);
                        this.deleteOrderRegisteryItem(orderId);
                        this.order!.orderStatus = res.status;
                        this.orderRegistery.set(orderId, this.order!);
                    });

                
                }
            });
            return res;

        } catch (error) {
            runInAction( () => {
                this.loadingRefundPaymentPage = false;
            });
            toast.error('Problem Processing refund payment');
            console.log(error);
        }
    };


    @action deleteOrder = async (orderId: string) =>{
        this.loadingRefundPaymentPage = true;
        try {
           await agent.Order.deleteOrder(orderId);
            runInAction(async() => {
                this.deleteOrderRegisteryItem(orderId);
                this.loadingRefundPaymentPage = false;
               // this.target = '';
                history.push(`/orders`);
            });

        } catch (error) {
            runInAction(() => {
                this.loadingRefundPaymentPage = false;
            });
            toast.error('Problem Processing refund payment');
            console.log(error);
        }
    };


    @action save = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.save(id);
            runInAction(() =>{
                this.loading = false;

            })
        } catch (error) {
            toast.error('Favorilere eklenemedi.');
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    @action unsave = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.unsave(id);
            runInAction(() =>{
                this.loading = false;
               
            })
        } catch (error) {
            toast.error('Favorilerden çıkarılamadı.');
            runInAction(() => {
                this.loading = false;
            })
        }
    }


    @action getSavedActivities = async () => {
        this.loading = true;
        try {
            const savedList = await agent.Activities.getSavedActivities();
            runInAction(() =>{
                this.savedActivities = savedList;
                this.loading = false;
               
            })
        } catch (error) {
            toast.error('Kaydettiğin aktiviteler getirilemedi.');
            runInAction(() => {
                this.loading = false;
            })
        }
    }


    @action sendReview = async (comment: IActivityReview)=>{
        this.submitting = true;
        try {
            var newComment = await agent.Activities.sendReview(comment);
            runInAction(() => {
              //  this.commentRegistery.set(newComment.id, newComment);
                this.submitting = false;
                toast.success('Aktivite hakkındaki yorumunuz en yakın zamanda değerlendirilip yayınlanmak üzere tarafımıza iletildi.');
            });
        } catch (error) {
            runInAction( () => {
                this.submitting = false;
            });
            toast.error('Problem submitting data');
            console.log(error);
        }
    };


    @action changeActivityStatus = async (id:string, status:ActivityStatus) =>{
        this.loadingActivity = true;
        try {
            await agent.Activities.updateActivityStatus(id,status.toString());
            runInAction(() => {
                this.loadingActivity = false;
                toast.success('Aktivite statüsü değiştirme işleminiz başarılı.');
                this.activity!.status = status;
            })
        } catch (error) {
            console.log(error);
            toast.error('Problem changing status');
            runInAction(() => {
                this.loadingActivity = false;
            })
            
        }

    }

}
