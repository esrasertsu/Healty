import { action, observable } from "mobx";
import { RootStore } from "./rootStore";

export default class ModalStore {
    rootStore : RootStore;
    constructor(rootStore: RootStore){
        this.rootStore = rootStore;
    }

    @observable.shallow modal = {
        open: false,
        body: null,
        header: null
    }

    @action openModal = (header:any, content: any) =>{
        this.modal.open = true;
        this.modal.body = content;
        this.modal.header = header;
    }

    @action closeModal = () => {
        this.modal.open = false;
        this.modal.body = null;
        this.modal.header = null;
    }
}