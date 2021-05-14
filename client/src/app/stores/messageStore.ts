import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import {observable, action, computed, runInAction, reaction} from 'mobx';
import { SyntheticEvent } from 'react';
import { toast } from 'react-toastify';
import agent from '../api/agent';
import { IChatRoom, IMessage } from '../models/message';

import { RootStore } from './rootStore';

const LIMIT = 10;
export default class MessageStore {

    rootStore:RootStore;
    constructor(rootStore: RootStore){
        this.rootStore = rootStore;

       
    }

    @observable.ref hubConnection : HubConnection | null = null;
    @observable chatRoom: IChatRoom | null = null;

    @observable message: IMessage | null = null;
    @observable loadingMessages : boolean = false;
    @observable loadingChatRooms : boolean = true;
    @observable chatRooms : IChatRoom[] | null = null;
    @observable messageRegistery = new Map();
    @observable messageCount = 0;


    @action createHubConnection = (chatRoomId: string) => {
        this.hubConnection = new HubConnectionBuilder()
        .withUrl('http://localhost:5000/message',{
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
                this.hubConnection!.invoke('AddToChat', chatRoomId);
            }
        })
        .catch(error => 
            console.log('Error establishing connection:', error));


        this.hubConnection.on('ReceiveMessage', comment => {
            runInAction(() => {
                this.chatRoom!.messages.push(comment);
            })
        })

        this.hubConnection.on('Send', message => {
            toast.info(message);
        })
    };


    @action stopHubConnection = () => {
        this.hubConnection!.invoke('RemoveFromChat', this.chatRoom!.id)
        .then(() => {
            this.hubConnection!.stop();
        })
        .then(() => console.log('Connection stopped'))
        .catch(err => console.log(err))
    }

    @observable page = 0;


    @action addComment = async (values: any) => {
        values.chatRoomId = this.chatRoom!.id;
        try {
            await this.hubConnection!.invoke("SendMessage", values);
        } catch (error) {
            console.log(error);
        }

    }
    @computed get axiosParams(){
        const params = new URLSearchParams();
        params.append('limit', String(LIMIT));
        params.append('offset', `${this.page ? this.page * LIMIT : 0}`);
        return params;
    }


    @action loadChatRooms = async () => {
        this.loadingChatRooms = true;
        try {
            const chatRooms = await agent.Messages.list();
            runInAction('Loading chat rooms',() => {
                
                this.chatRooms = chatRooms;
                this.loadingChatRooms = false
            })
            } catch (error) {
                console.log(error);
                runInAction('Loading chat rooms error',() => {
                  this.loadingChatRooms = false
                });
            }
    };

    @action loadMessages = async (id:string) => {
        debugger;
            this.loadingMessages = true;
            try {
                const messagesEnvelope = await agent.Messages.listMessages(id,LIMIT,this.page);
                const {messages, messageCount } = messagesEnvelope;
                runInAction('Loading messages',() => {
                    messages.forEach((message) =>{
                       // setActivityProps(activity,this.rootStore.userStore.user!)
                        this.messageRegistery.set(message.id, message);
                    });
                    this.messageCount = messageCount;
                    this.loadingMessages = false
                })
                } catch (error) {
                    console.log(error);
                    runInAction('Loading messages error',() => {
                      this.loadingMessages = false
                    });
                }

        
      
    };


 
    

}
