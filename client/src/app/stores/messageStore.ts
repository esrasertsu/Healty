import {observable, action, computed, runInAction, reaction,makeObservable} from 'mobx';
import { toast } from 'react-toastify';
import agent from '../api/agent';
import { setMessageProps } from '../common/util/util';
import { IChatRoom, IMessage } from '../models/message';

import { store } from './rootStore';

const LIMIT = 10;
export default class MessageStore {

    constructor(){
        makeObservable(this);
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
                    store.userStore.hubConnection === null ? 
                    store.userStore.createHubConnection(true).then(()=>{this.loadMessages(this.chatRoomId!)})
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
            if(store.userStore.hubConnection!.state === "Disconnected")
            toast.error("Please refresh the page!");
            
            await store.userStore.hubConnection!.invoke("SendMessage", values);
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
            runInAction(() => {
                
                this.chatRooms = chatRooms;
                this.loadingChatRooms = false;
                chatRooms.forEach((chatRoom) =>{
                    chatRoom.userStatus && 
                    store.userStore.setUserOnline(chatRoom.userName);
                    this.messageRegistery.set(chatRoom.id, null);
                });
            })
            } catch (error) {
                console.log(error);
                runInAction(() => {
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
            runInAction( () => {
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
                runInAction(() => {
                    messages.forEach(async(message) =>{
                        setMessageProps(message,store.userStore.user!);
                        messageList.push(message);
                        if(message.username !== store.userStore.user!.userName)
                        {
                            
                            var values = {
                                id:message.id,
                                chatRoomId: message.chatRoomId,
                                seen: true
                            }
    
                            await store.userStore.hubConnection!.invoke('SetMessageSeenJustAfterLooked',values  );
                        }
                    });
                    this.messageRegistery.get(id) !== null 
                    ?
                    this.messageRegistery.get(id)!.push(...messageList)
                    :  
                    this.messageRegistery.set(id,messageList)
                    this.messageCount = messageCount;
                    const crIndex = this.chatRooms!.findIndex(x => x.id === id);
                    store.userStore.notificationCount > 0 &&
                    store.userStore.setNotificationCount(
                        store.userStore.notificationCount - this.chatRooms![crIndex].unReadMessageCount 
                    );
                    this.chatRooms![crIndex].unReadMessageCount = 0;
                    this.loadingMessages = false;

                })
                } catch (error) {
                    console.log(error);
                    runInAction(() => {
                      this.loadingMessages = false
                    });
                }

        
      
    };


 
    

}
