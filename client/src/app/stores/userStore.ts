import { action, computed, observable, runInAction } from "mobx";
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { history } from "../..";
import agent from "../api/agent";
import { ITrainerCreationFormValues, ITrainerFormValues, IUser, IUserFormValues, TrainerCreationFormValues, TrainerFormValues } from "../models/user";
import { RootStore } from "./rootStore";
import { toast } from 'react-toastify';
import { IMessage } from "../models/message";

export default class UserStore {
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

    @observable trainerRegisteredSuccess = false;
    @observable trainerFormMessage = false;
    @observable errorMessage = "";

    
    @action setTrainerFormMessage = (value: boolean) => {
        this.trainerFormMessage = value;
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
            const user = await agent.User.login(values);
            runInAction(()=>{
                this.user = user;
                this.hubConnection === null && this.createHubConnection();
            })
            this.rootStore.commonStore.setToken(user.token);
            this.rootStore.modalStore.closeModal();
            history.push(location);
        } catch (error) {
            throw error;
        }
    }

    @action register = async (values: IUserFormValues,location:string) =>{
        try {
            const user = await agent.User.register(values);
            runInAction(()=>{
                this.user = user;
            })
            this.rootStore.commonStore.setToken(user.token);
            this.rootStore.modalStore.closeModal();
            history.push(location);
            this.hubConnection === null && this.createHubConnection();

        } catch (error) {
            throw error;
        }
    }

    @action isUserNameAvailable = async (username: string, email: string) =>{
        try {
            this.trainerRegistering = true;
            
            const response = await agent.User.isUserNameAvailable(username,email);
            runInAction(()=>{
                this.trainerRegistering = false;
            })
            return response;

        } catch (error) {
            if(error.data.errors.Email!==undefined)
            {
                this.setTrainerFormMessage(true);
                this.setErrorMessage(error.data.errors.Email);
            }
            if(error.data.errors.UserName!==undefined)
              {
                this.setErrorMessage(error.data.errors.UserName);
                this.setTrainerFormMessage(true);
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
                this.trainerRegisteredSuccess = true;
            })
           
           

        } catch (error) {
            this.trainerRegistering = false;
            throw error;

        }
    }

    @action createHubConnection = async () => {
        this.hubConnection = new HubConnectionBuilder()
        .withUrl('http://localhost:5000/message',{
            accessTokenFactory: () => this.rootStore.commonStore.token!
        })
            .configureLogging(LogLevel.Information)
            .withAutomaticReconnect()
            .build();

     this.hubConnection
        .start()
        .then(() => console.log(this.hubConnection!.state))
        .then(async() => {
            if(this.hubConnection!.state === 'Connected')
            {

                await this.hubConnection!.invoke('SetUserOnline');
                const b = await agent.User.update(true);
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
                    toast.info(user +" online")
                })
            })

            this.hubConnection!.on('Offline', user => {
                runInAction(() => {
                    this.setUserOffline(user);
                    toast.info(user +" offline")
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

    @action getUser = async () =>{
        try{
            const user = await agent.User.current();
            runInAction(() => {
                this.user = user;

            })
        }catch(error){
            console.log(error);
        }
    }

    @action logout = async () => {
       
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
                this.clearCurrentUser();
                this.rootStore.commonStore.setToken(null);
                history.push('/');
            })
          
    }
}