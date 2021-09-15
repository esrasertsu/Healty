import {observable, action, computed, runInAction, reaction} from 'mobx';
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
    @observable messageRegistery = new Map<any, IMessage[]| null>();

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

    @action setChatRoomsEmpty = () =>{
        this.chatRooms = null;
    }
    @action clearMessageRegistery = () =>{
        this.messageRegistery.clear();
    }
    
    @action addComment = async (values: any) => {
        values.chatRoomId = this.chatRoomId;
        try {
            if(this.rootStore.userStore.hubConnection!.state === "Disconnected")
            toast.error("Please refresh the page!");
            
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
                chatRooms.forEach((chatRoom) =>{
                    chatRoom.userStatus && 
                    this.rootStore.userStore.setUserOnline(chatRoom.userName);
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
    @action setMessageSeen =  (message:IMessage) =>{
       var listMessages: IMessage[]|null = this.messageRegistery.get(message.chatRoomId)!;
       if(listMessages !==null)
        listMessages.filter(x => x.id === message.id)[0].seen = true;
    }


    @computed get messagesByDate(){

        // return this.activities.sort((a,b) => Date.parse(a.date) - Date.parse(b.date))
      //  return Array.from(this.activityRegistery.values()).sort((a,b) => Date.parse(a.date) - Date.parse(b.date))
          return this.groupMessagesByDate(
            this.messageRegistery.get(this.chatRoomId)! !== null ? this.messageRegistery.get(this.chatRoomId)! : []
             );
     }
 
     groupMessagesByDate(messages: IMessage[]){
         const sortedMessages = messages.slice().sort(
             (a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
         )
 
         return Object.entries(sortedMessages.reduce((messages, message) =>{
             const date = new Date(message.createdAt).toISOString().split('T')[0];
             messages[date] = messages[date] ? [...messages[date], message]: [message];
             return messages;
          },
        {} as {[key:string]: IMessage[]}));
     }

    @action loadMessages = async (id:string) => {
            let messageList:IMessage[] = [];
            this.chatRoomId = id;
            this.loadingMessages = true;
            try {
                const messagesEnvelope = await agent.Messages.listMessages(id,LIMIT,this.page);
                const {messages, messageCount } = messagesEnvelope;
                runInAction('Loading messages',() => {
                    messages.forEach(async(message) =>{
                        setMessageProps(message,this.rootStore.userStore.user!);
                        messageList.push(message);
                        if(message.username !== this.rootStore.userStore.user!.userName)
                        {
                            
                            var values = {
                                id:message.id,
                                chatRoomId: message.chatRoomId,
                                seen: true
                            }
    
                            await this.rootStore.userStore.hubConnection!.invoke('SetMessageSeenJustAfterLooked',values  );
                        }
                    });
                    this.messageRegistery.get(id) !== null 
                    ?
                    this.messageRegistery.get(id)!.push(...messageList)
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
