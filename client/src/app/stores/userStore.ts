import { action, computed, observable, runInAction } from "mobx";
import { history } from "../..";
import agent from "../api/agent";
import { IUser, IUserFormValues } from "../models/user";
import { RootStore } from "./rootStore";

export default class UserStore {
    rootStore:RootStore;
    constructor(rootStore: RootStore){
        this.rootStore = rootStore;
    }

    @observable user: IUser | null = null;

    @computed get isLoggedIn() {return !!this.user}

    @action login = async (values : IUserFormValues) =>{
        try {
            const user = await agent.User.login(values);
            runInAction(()=>{
                this.user = user;
            })
            this.rootStore.commonStore.setToken(user.token);
            this.rootStore.modalStore.closeModal();
            history.push('activities');
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
            this.rootStore.messageStore.stopHubConnection(null);
            this.rootStore.messageStore.setHubConnectionNull();
            this.rootStore.messageStore.setPage(0);
            this.rootStore.messageStore.messageRegistery.clear();
            this.rootStore.messageStore.setChatRoomId(null);
        }
       
        this.user = null;
        history.push('/');
    }
}