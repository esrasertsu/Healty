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

    @computed get isLoggedIn() {return !!this.user}

    @action setHubConnectionNull = () =>{
        this.hubConnection = null;
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
                    this.rootStore.messageStore.chatRooms &&  
                    this.rootStore.messageStore.chatRooms.forEach((chatroom)=>{
                        this.hubConnection!.invoke('AddToChat', chatroom.id);
                    })
 
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
                    this.rootStore.messageStore.messageRegistery.set(message.chatRoomId, this.initialMessages);;
                    const crIndex = this.rootStore.messageStore.chatRooms!.findIndex(x => x.id === message.chatRoomId);
                    this.rootStore.messageStore.chatRooms![crIndex].lastMessage = message.body;
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