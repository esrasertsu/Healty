import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import {observable, action, computed, runInAction, reaction} from 'mobx';
import { SyntheticEvent } from 'react';
import { toast } from 'react-toastify';
import agent from '../api/agent';
import { setMessageProps } from '../common/util/util';
import { IChatRoom, IMessage } from '../models/message';

import { RootStore } from './rootStore';

const LIMIT = 10;
export default class MessageStore {

    rootStore:RootStore;
    constructor(rootStore: RootStore){
        this.rootStore = rootStore;

        reaction(
            () => this.chatRoomId,
            () => {
                debugger;
                if(this.chatRoomId !== null)
                {
                    this.setPage(0);
                    if(this.messageRegistery.get(this.chatRoomId)!==null){
                        this.messageRegistery.delete(this.chatRoomId);
                    }
                    this.messageRegistery.set(this.chatRoomId, null);
                    this.rootStore.userStore.hubConnection === null ? 
                    this.rootStore.userStore.createHubConnection().then(()=>{this.loadMessages(this.chatRoomId!)})
                    : 
                    this.loadMessages(this.chatRoomId!);
                }
                }
        )
       
    }


    @observable message: IMessage | null = null;
    @observable loadingMessages : boolean = false;
    @observable loadingChatRooms : boolean = true;
    @observable chatRooms : IChatRoom[] | null = null;
    @observable chatRoomId : string | null = null;
    @observable prevChatRoomId : string | null = null;
    @observable messageRegistery = new Map();

    @observable messageCount = 0;
    @observable page = 0;
    @observable stoppingHubConnection:boolean = true;


    @computed get totalPages(){
        return Math.ceil(this.messageCount / LIMIT);
    }

    @action setPage = (page:number) =>{
        this.page = page;
    }
    @action setChatRoomId = (id:string|null) =>{
        this.chatRoomId = id;
    }
    // @action setPrevChatRoomId = (id:string | null) =>{
    //     this.prevChatRoomId = id;
    // }
    // @action createHubConnection = (chatRoomId: string) => {
    //     debugger;
    //     this.hubConnection = new HubConnectionBuilder()
    //     .withUrl('http://localhost:5000/message',{
    //         accessTokenFactory: () => this.rootStore.commonStore.token!
    //     })
    //         .configureLogging(LogLevel.Information)
    //         .build();

    //     this.hubConnection
    //     .start()
    //     .then(() => console.log(this.hubConnection!.state))
    //     .then(() => {
    //         if(this.hubConnection!.state === 'Connected')
    //         {
    //             this.hubConnection!.invoke('AddToChat', chatRoomId);
    //         }
    //     }).then(() => {
    //         if(this.hubConnection!.state === 'Connected')
    //         {
    //             this.setPage(0);
    //             this.loadMessages(chatRoomId);
    //         }
    //     })
    //     .catch(error => 
    //         console.log('Error establishing connection:', error));


    //     this.hubConnection.on('ReceiveMessage', message => {
    //         runInAction(() => {
    //             debugger;
    //             message.createdAt= new Date();
    //             this.messageRegistery.set(message.id, message);
    //             const crIndex = this.chatRooms!.findIndex(x => x.id === this.chatRoomId);
    //             this.chatRooms![crIndex].lastMessage = message.body;
    //         })
    //     })

    //     this.hubConnection.on('Send', message => {
    //         toast.info(message);
    //     })
    // };


    // @action stopHubConnection = (nextConnection:string|null) => {
    //     let crId = null;
    //     debugger;
    //     if(nextConnection != null)
    //     {
    //         crId =  this.prevChatRoomId;
    //     }else {
    //         crId = this.chatRoomId;
    //     }
    //     this.hubConnection!.invoke('RemoveFromChat', crId)
    //     .then(() => {
    //         debugger;
    //         this.hubConnection!.stop();
    //     })
    //     .then(() => {
    //         debugger;
    //         console.log('Connection stopped');
    //         nextConnection && this.createHubConnection(nextConnection)})
    //     .catch(err => console.log(err))
    // }


    @action addComment = async (values: any) => {
        debugger;
        values.chatRoomId = this.chatRoomId;
        try {
            await this.rootStore.userStore.hubConnection!.invoke("SendMessage", values);
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
                this.loadingChatRooms = false;
                debugger;
                chatRooms.forEach((chatRoom) =>{
                    this.messageRegistery.set(chatRoom.id, null);
                });
            })
            } catch (error) {
                console.log(error);
                runInAction('Loading chat rooms error',() => {
                  this.loadingChatRooms = false
                });
            }
    };


    @action seenMessageUpdate = async(message:IMessage) => {
        try {
            await agent.Messages.seenMessage(message);
            // runInAction('Seen message', () => {
            // });
        } catch (error) {
            runInAction('Seen message error', () => {
              message.seen=false;
            });
            console.log(error);
        }
    }


    @computed get messagesByDate(){
        debugger;
        // return this.activities.sort((a,b) => Date.parse(a.date) - Date.parse(b.date))
      //  return Array.from(this.activityRegistery.values()).sort((a,b) => Date.parse(a.date) - Date.parse(b.date))
          return this.groupMessagesByDate(
              Array.from(
                  this.messageRegistery.get(this.chatRoomId) !== null && 
                  this.messageRegistery.get(this.chatRoomId)!
                  ));
     }
 
     groupMessagesByDate(messages: IMessage[]){
         const sortedMessages = messages.sort(
             (a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
         )
 
         return Object.entries(sortedMessages.reduce((messages, message) =>{
             debugger;
             const date = new Date(message.createdAt).toISOString().split('T')[0];
             messages[date] = messages[date] ? [...messages[date], message]: [message];
             return messages;
          },
        {} as {[key:string]: IMessage[]}));
     }

    @action loadMessages = async (id:string) => {
        debugger;
            let messageList:IMessage[] = [];
            this.chatRoomId = id;
            this.loadingMessages = true;
            try {
                const messagesEnvelope = await agent.Messages.listMessages(id,LIMIT,this.page);
                const {messages, messageCount } = messagesEnvelope;
                runInAction('Loading messages',() => {
                    messages.forEach((message) =>{
                        setMessageProps(message,this.rootStore.userStore.user!);
                        messageList.push(message);
                    });
                    this.messageRegistery.get(id) !== null 
                    ?
                    this.messageRegistery.get(id).push(...messageList)
                    :  
                    this.messageRegistery.set(id,messageList)
                    this.messageCount = messageCount;
                    const crIndex = this.chatRooms!.findIndex(x => x.id === id);
                    this.rootStore.userStore.notificationCount > 0 &&
                    this.rootStore.userStore.setNotificationCount(
                        this.rootStore.userStore.notificationCount - this.chatRooms![crIndex].unReadMessageCount 
                    );
                    this.chatRooms![crIndex].unReadMessageCount = 0;
                    this.loadingMessages = false;

                })
                } catch (error) {
                    console.log(error);
                    runInAction('Loading messages error',() => {
                      this.loadingMessages = false
                    });
                }

        
      
    };


 
    

}
