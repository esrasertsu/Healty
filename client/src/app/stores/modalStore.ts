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
        header: null,
        image:false
    }

    @action openModal = (header:any, content: any, image:any) =>{
        this.modal.open = true;
        this.modal.body = content;
        this.modal.header = header;
        this.modal.image = image;
    }

    @action closeModal = () => {
        this.modal.open = false;
        this.modal.body = null;
        this.modal.header = null;
        this.modal.image = false;
    }
}