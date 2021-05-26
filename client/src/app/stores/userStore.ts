import { action, computed, observable, runInAction } from "mobx";
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { history } from "../..";
import agent from "../api/agent";
import { IUser, IUserFormValues } from "../models/user";
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

    @observable notificationCount: number = 0;
    @computed get isLoggedIn() {return !!this.user}

    @action setHubConnectionNull = () =>{
        this.hubConnection = null;
    }

    
    @action setNotificationCount = (count:number) =>{
        this.notificationCount = count;
    }

    @action login = async (values : IUserFormValues) =>{
        try {
            const user = await agent.User.login(values);
            runInAction(()=>{
                this.user = user;
            })
            this.rootStore.commonStore.setToken(user.token);
            this.rootStore.modalStore.closeModal();
            this.createHubConnection();
            history.push('/');
        } catch (error) {
            throw error;
        }
    }

    @action register = async (values: IUserFormValues) =>{
        try {
            const user = await agent.User.register(values);
            this.rootStore.commonStore.setToken(user.token);
            this.rootStore.modalStore.closeModal();
            history.push('activities');
        } catch (error) {
            throw error;
        }
    }

    @action createHubConnection = async () => {
        debugger;
        this.hubConnection = new HubConnectionBuilder()
        .withUrl('http://localhost:5000/message',{
            accessTokenFactory: () => this.rootStore.commonStore.token!
        })
            .configureLogging(LogLevel.Information)
            .build();

       await this.hubConnection
        .start()
        .then(() => console.log(this.hubConnection!.state))
        .then(async() => {
            if(this.hubConnection!.state === 'Connected')
            {
                this.rootStore.messageStore.loadChatRooms().then(() => {
                    let count = 0; 
                    debugger;
                    this.rootStore.messageStore.chatRooms &&  
                    this.rootStore.messageStore.chatRooms.forEach((chatroom)=>{
                        this.hubConnection!.invoke('AddToChat', chatroom.id);
                        count = count + chatroom.unReadMessageCount;
                    })
                    this.setNotificationCount(count);
 
            })
            }
        })
        .catch(error => 
            console.log('Error establishing connection:', error));

            this.hubConnection.on('ReceiveMessage', message => {
                runInAction(() => {
                    debugger;
                    message.createdAt= new Date();
                    this.initialMessages.push(message);
                    this.rootStore.messageStore.messageRegistery.get(message.chatRoomId)!==null ?
                    this.rootStore.messageStore.messageRegistery.get(message.chatRoomId)!.push(message):
                    this.rootStore.messageStore.messageRegistery.set(message.chatRoomId, this.initialMessages);
                    //mesajın göndericisi şuanki user değilse ve şuanki user'ın baktığı chatroom mesajın chatroom'u ise seen true'ya çek
                    const crIndex = this.rootStore.messageStore.chatRooms!.findIndex(x => x.id === message.chatRoomId);
                    this.rootStore.messageStore.chatRooms![crIndex].lastMessage = message.body;
                    if(message.username !== this.user!.userName && 
                        message.chatRoomId !== this.rootStore.messageStore.chatRoomId)
                        {
                            this.notificationCount = this.notificationCount + 1;
                            this.rootStore.messageStore.chatRooms![crIndex].unReadMessageCount = this.rootStore.messageStore.chatRooms![crIndex].unReadMessageCount +1;
                            toast.info(message.displayName +" kişisinden 1 mesajınız var");
                        }
                    else if(message.username !== this.user!.userName &&  
                            message.chatRoomId === this.rootStore.messageStore.chatRoomId)
                            {
                               message.seen = true;
                               this.rootStore.messageStore.seenMessageUpdate(message);
                            }
                })
            })
    
            this.hubConnection.on('Send', message => {
                toast.info(message);
            })
    }

    @action  stopHubConnection = async () => {
        this.rootStore.messageStore.chatRooms &&  

        await Promise.all(
            this.rootStore.messageStore.chatRooms!.map(async(chatroom)=>{
              const a =  await this.hubConnection!.invoke('RemoveFromChat', chatroom.id)
            })
        )
        .then(() => {
            debugger;
            this.hubConnection!.stop();
        })
        .then(() => {
            debugger;
            console.log('Connection stopped');
        })
        .catch(err => console.log(err))
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

    @action logout = () => {
        this.rootStore.commonStore.setToken(null);
        if(this.rootStore.messageStore.chatRoomId!== null)
        {
            this.stopHubConnection();
            this.setHubConnectionNull();
            this.rootStore.messageStore.setPage(0);
            this.rootStore.messageStore.messageRegistery.clear();
            this.initialMessages = [];
            this.rootStore.messageStore.setChatRoomId(null);
        }
       
        this.user = null;
        history.push('/');
    }
}