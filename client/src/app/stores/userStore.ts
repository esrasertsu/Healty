import { action, computed, observable, runInAction } from "mobx";
import { HttpTransportType, HubConnection, HubConnectionBuilder, JsonHubProtocol, LogLevel } from '@microsoft/signalr';
import { history } from "../..";
import agent from "../api/agent";
import { ITrainerCreationFormValues, ITrainerFormValues, IUser, IUserFormValues, TrainerCreationFormValues, TrainerFormValues } from "../models/user";
import { RootStore } from "./rootStore";
import { toast } from 'react-toastify';
import { IMessage } from "../models/message";
import { ISubMerchantInfo, SubMerchantInfo } from "../models/user";

export default class UserStore {

    refreshTokenTimeout :any;

    rootStore:RootStore;
    constructor(rootStore: RootStore){
        this.rootStore = rootStore;
    }

    @observable user: IUser | null = null;
    @observable.ref hubConnection : HubConnection | null = null;
    
    @observable initialMessages: IMessage[]  = [];
    @observable onlineUsers: String[]  = [];

    @observable notificationCount: number = 0;
    @computed get isLoggedIn() {return !!this.user}
    @observable trainerForm: ITrainerFormValues = new TrainerFormValues();
    @observable tranierCreationForm : ITrainerCreationFormValues = new TrainerCreationFormValues();
    @observable trainerRegistering = false;
    @observable loadingUserInfo = false;
    @observable trainerFormMessage = false;
    @observable resendEmailVeriMessage = false;
    @observable errorMessage = "";
    @observable loadingFbLogin = false;
    @observable loggingOut = false;

    @observable subMerchantForm: ISubMerchantInfo = new SubMerchantInfo();

    
    @action setTrainerFormMessage = (value: boolean) => {
        this.trainerFormMessage = value;
    }

    @action setloadingUserInfo = (value:boolean) =>{
        this.loadingUserInfo = value;
    }

    @action setResendEmailVeriMessage = (value: boolean) =>{
         this.resendEmailVeriMessage = value;
    }

    @action setLoadingFbLogin = (value: boolean) => {
        this.loadingFbLogin = value;
    }
    @action setLoggingOut = (value: boolean) => {
        this.loggingOut = value;
    }

    @action setsubMerchantFormValues = (info: ISubMerchantInfo) => {
        this.subMerchantForm = info;
    }
    @action setErrorMessage = (value: string) => {
        this.errorMessage = value;
    }

    @action setTrainerForm = (form: ITrainerFormValues) => {
        this.trainerForm = form;
    }
    @action setTrainerCreationForm = (form: ITrainerCreationFormValues) => {
        this.tranierCreationForm = form;
    }

    @action setInitialMessageNull = () => {
        this.initialMessages = [];
    }

    @action clearCurrentUser = () => {
        this.user = null;
    }

    @action setHubConnectionNull = () =>{
        this.hubConnection = null;
    }
    @action settrainerRegisteringFalse = () =>{
        this.trainerRegistering = false;
    }
    
    @action setNotificationCount = (count:number) =>{
        this.notificationCount = count;
    }

    @action setUserOffline = (username:string) =>{
        var index = this.onlineUsers.indexOf(username);
                if (index > -1) {
                    this.onlineUsers.splice(index, 1);
                }
    }

    @action setUserOnline = (username:string) =>{
        var index = this.onlineUsers.indexOf(username);
                if (index === -1) {
                    this.onlineUsers.push(username);
                }
    }
    @action login = async (values : IUserFormValues,location:string) =>{
        try {
            debugger;
            const user = await agent.User.login(values);
            runInAction(()=>{
                this.user = user;
                this.hubConnection === null && this.createHubConnection(false);
            })
            this.rootStore.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
            this.rootStore.modalStore.closeModal();
            if(location!==null && location !=="")
              history.push(location);
            else
              window.location.reload();

        } catch (error) {
            if((error as any).data.errors.EmailVerification!==undefined)
            {
                this.setResendEmailVeriMessage(true);
            }
            throw error;
        }
    }

    @action register = async (values: IUserFormValues,location:string) =>{
        try {
           await agent.User.register(values);
         
            this.rootStore.modalStore.closeModal();
            history.push(`/user/registerSuccess?email=${values.email}`);
            this.hubConnection === null && this.createHubConnection(false);

        } catch (error) {
            throw error;
        }
    }

    @action userNameAndPhoneCheck = async (username: string, email: string, phone: string) =>{
        try {
            this.trainerRegistering = true;
            
            const response = await agent.User.userNameAndPhoneCheck(username,email,phone);
            runInAction(()=>{
                this.trainerRegistering = false;
            })
            return response;

        } catch (error) {
            if((error as any).data.errors.Email!==undefined)
            {
                this.setTrainerFormMessage(true);
                this.setErrorMessage((error as any).data.errors.Email);
            }
            if((error as any).data.errors.UserName!==undefined)
              {
                this.setTrainerFormMessage(true);
                this.setErrorMessage((error as any).data.errors.UserName);
              }  
              if((error as any).data.errors.Phone!==undefined)
              {
                this.setTrainerFormMessage(true);
                this.setErrorMessage((error as any).data.errors.Phone);
              }  
            this.settrainerRegisteringFalse();
            throw error;

        }
    }


    @action registerTrainer = async (values: ITrainerFormValues) =>{
        try {
            this.trainerRegistering = true;
            
            const user = await agent.User.registerTrainer(values);
            runInAction(()=>{
                this.trainerRegistering = false;
               
            })
           return true
           

        } catch (error) {
            this.trainerRegistering = false;
            throw error;

        }
    }


    @action registerWaitingTrainer = async (values: ITrainerCreationFormValues) =>{
        try {
            this.trainerRegistering = true;
            
            const user = await agent.User.registerWaitingTrainer(values);
            runInAction(()=>{
                this.settrainerRegisteringFalse();
                if(user)
                {
                    this.user = user;
                    this.hubConnection === null && this.createHubConnection(false);
                    this.rootStore.commonStore.setToken(user.token);
                    this.startRefreshTokenTimer(user);
                    this.rootStore.modalStore.closeModal();
                    history.push(`/TrainerRegister/${user.userName}`);
                }
            })

           
        } catch (error) {
            this.settrainerRegisteringFalse();
            throw error;

        }
    }

    @action createHubConnection = async (updateUserAsOnline : boolean) => {

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
        .withUrl(process.env.REACT_APP_API_MESSAGE_URL!,options)
        .withHubProtocol(protocol)
        .build();

     this.hubConnection.serverTimeoutInMilliseconds = 1000*60*63;

     this.hubConnection
        .start()
        .then(() => console.log(this.hubConnection!.state))
        .then(async() => {
            if(this.hubConnection!.state === 'Connected')
            {

                await this.hubConnection!.invoke('SetUserOnline');
                if(updateUserAsOnline)
                   await agent.User.update(true);
                runInAction(() => {

                    this.rootStore.messageStore.loadChatRooms().then(() => {
                        let count = 0; 
                        this.rootStore.messageStore.chatRooms &&  
                        this.rootStore.messageStore.chatRooms.forEach((chatroom)=>{
                            this.hubConnection!.invoke('AddToChat', chatroom.id);
                            count = count + chatroom.unReadMessageCount;
                        })
                        this.setNotificationCount(count);
     
                })
                })
            }
        })
        .catch(error => 
            console.log('Error establishing connection:', error));


            this.hubConnection!.on('ReceiveMessage', message => {
                runInAction(() => {
                    message.createdAt= new Date();
                    this.initialMessages.push(message);
                    if(this.rootStore.messageStore.messageRegistery.get(message.chatRoomId) !==null &&
                    this.rootStore.messageStore.messageRegistery.get(message.chatRoomId) !==undefined)
                     {
                        this.rootStore.messageStore.messageRegistery.get(message.chatRoomId)!.findIndex(x => x.id === message.id) < 0 &&
                        this.rootStore.messageStore.messageRegistery.get(message.chatRoomId)!.push(message)
                     }
                    else
                    this.rootStore.messageStore.messageRegistery.set(message.chatRoomId, this.initialMessages);
                    
                    //mesajın göndericisi şuanki user değilse ve şuanki user'ın baktığı chatroom mesajın chatroom'u ise seen true'ya çek
                    const crIndex = this.rootStore.messageStore.chatRooms!.findIndex(x => x.id === message.chatRoomId);
                    this.rootStore.messageStore.chatRooms![crIndex].lastMessage = message.body;
                    if(message.username !== this.user!.userName && 
                        message.chatRoomId !== this.rootStore.messageStore.chatRoomId)
                        {
                            this.notificationCount = this.notificationCount + 1;
                            this.rootStore.messageStore.chatRooms![crIndex].unReadMessageCount = this.rootStore.messageStore.chatRooms![crIndex].unReadMessageCount +1;
                            toast.info(message.displayName +" kişisinden mesajınız var");
                        }
                    else if(message.username !== this.user!.userName &&  
                            message.chatRoomId === this.rootStore.messageStore.chatRoomId)
                            {
                                var values = {
                                    id:message.id,
                                    chatRoomId: message.chatRoomId,
                                    seen: true
                                }
                                
                                try {
                                    this.hubConnection!.invoke('SeenMessage',values  );
                                } catch (error) {
                                    console.log(error);
                                }
                            }
                })
            })
    
            this.hubConnection!.on('Online', user => {
                runInAction(() => {
                    this.setUserOnline(user);
                   // toast.info(user +" online")
                })
            })

            this.hubConnection!.on('Offline', user => {
                runInAction(() => {
                    this.setUserOffline(user);
                   // toast.info(user +" offline")
                }
            )
            })

            this.hubConnection!.on('MessageSeen', message => {
                    this.rootStore.messageStore.setMessageSeen(message);
            })

            this.hubConnection!.on('NewChatRoomAdded', (chatRoomId,userName,senderName) => {
                runInAction(async() => {
                   await this.hubConnection!.invoke('AddToChat',chatRoomId).then(()=>
                     this.handleNewlyAddedChatRoom(senderName)
                    );
                })
            })

            
    }

    @action handleNewlyAddedChatRoom = async (senderName:string,) => {
        this.notificationCount = this.notificationCount + 1;
        //ilk mesajdan sonraki her mesajı haber vermek istiyorsan buraya b chatroom yarat
        toast.info(senderName +" kişisinden mesajınız var")
    }

    @action  stopHubConnection = async () => {
        if(this.hubConnection && this.hubConnection!.state === 'Connected')
        {
            await this.hubConnection!.invoke('SetUserOffline');
            const b = await agent.User.update(false);
            runInAction(async() => {
                await Promise.all(
                    this.rootStore.messageStore.chatRooms!.map(async(chatroom)=>{
                      const a =  await this.hubConnection!.invoke('RemoveFromChat', chatroom.id)
                    })
                )
    
            })
            
            .catch(err =>{ console.log(err);
              })
        }
    }

    @action refreshToken = async  () =>{
        this.stopRefreshTokenTimer();
        try {
            const user = await agent.User.refreshToken();
            runInAction(() =>
            {
                this.user = user;
            })
            this.rootStore.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
        } catch (error) {
            console.log(error);
        }
    }

    @action getUser = async () =>{
        try{
            const user = await agent.User.current();
            runInAction(() => {
                this.user = user;

            });
            if(user)
            {
                this.rootStore.commonStore.setToken(user.token);
                this.startRefreshTokenTimer(user);
            }
            return user;
        }catch(error){
            console.log(error);
        }
    }

    @action getSubMerchantInfo = async () =>{
        try{
            const subMerchant = await agent.User.getSubMerchantInfo();
            return subMerchant;

        }catch(error){
            console.log(error);
        }
    }

    @action createSubMerchant = async (values: ISubMerchantInfo) =>{
        try{
            const res = await agent.User.createSubMerchant(values);
            runInAction(() => {
                if(res)
                    this.user!.isSubMerchant = true;

            });

            return res;
        }catch(error){
            console.log(error);
        }
    }

    @action editSubMerchant = async (values: ISubMerchantInfo) =>{
        try{
            const res = await agent.User.editSubMerchant(values);
            runInAction(() => {
                if(res)
                  this.user!.isSubMerchant = true;

            });

            return res;
        }catch(error){
            console.log(error);
        }
    }

    @action logout = async () => {
        this.loggingOut = true;
            await this.stopHubConnection();
            runInAction(async()=>{
                this.hubConnection &&
                     await this.hubConnection!.stop();
                console.log('Connection stopped');
                this.setHubConnectionNull();
                this.rootStore.messageStore.setPage(0);
                this.rootStore.messageStore.clearMessageRegistery();
                this.setInitialMessageNull();
                this.rootStore.messageStore.setChatRoomId(null);
                this.rootStore.messageStore.setChatRoomsEmpty();
                this.rootStore.activityStore.setPage(0);
                this.rootStore.activityStore.clearActivityRegistery();
                this.rootStore.profileStore.setPage(0);
                this.rootStore.profileStore.clearProfileRegistery();
                this.rootStore.activityStore.setOrderPage(0);
                this.rootStore.activityStore.clearOrderRegistery();
                this.clearCurrentUser();
                this.stopRefreshTokenTimer();
                this.rootStore.commonStore.setToken(null);
                this.setLoggingOut(false);
                history.push("/");
            })
           
            
          
    }

    @action fbLogin = async (response:any,location:string) => {
        this.loadingFbLogin = true;
        try{
            const user = await agent.User.fbLogin(response.accessToken);
            console.log(user);
            runInAction(() => {
                this.user = user;
                this.hubConnection === null && this.createHubConnection(false);
                this.rootStore.commonStore.setToken(user.token);
                this.startRefreshTokenTimer(user);
                this.rootStore.modalStore.closeModal();
                this.setLoadingFbLogin(false);
            });
       
            if(location!==null && location !=="")
              history.push(location);
            else
              window.location.reload();
        }catch(error){
            this.setLoadingFbLogin(false);
            throw error;
        }
    }


    private startRefreshTokenTimer(user: IUser){
        const jwtToken = JSON.parse(atob(user.token.split('.')[1]));
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60*1000);
        
        this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout);
    }

    private stopRefreshTokenTimer(){
       clearTimeout(this.refreshTokenTimeout);
    }
}