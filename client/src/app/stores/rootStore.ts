import UserStore from "./userStore";
import ActivityStore from './activityStore';
import { createContext, useContext } from "react";
import { configure } from "mobx";
import CommonStore from "./commonStore";
import ModalStore from "./modalStore";
import ProfileStore from "./profileStore";
import BlogStore from "./blogStore";
import CategoryStore from "./categoryStore";
import MessageStore from "./messageStore";
import ContractStore from "./contractStore";
import OrderStore from "./orderStore";

configure({enforceActions: 'always'});

interface IStore {
    activityStore: ActivityStore;
    userStore: UserStore;
    commonStore: CommonStore;
    modalStore: ModalStore;
    profileStore: ProfileStore;
    blogStore: BlogStore;
    categoryStore: CategoryStore;
    messageStore: MessageStore;
    contractStore: ContractStore;
    orderStore: OrderStore;
}

export const store: IStore = {
    activityStore: new ActivityStore(),
    userStore: new UserStore(),
    commonStore: new CommonStore(),
    modalStore: new ModalStore(),
    profileStore: new ProfileStore(),
    blogStore: new BlogStore(),
    categoryStore: new CategoryStore(),
    messageStore: new MessageStore(),
    contractStore: new ContractStore(),
    orderStore: new OrderStore(),
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}