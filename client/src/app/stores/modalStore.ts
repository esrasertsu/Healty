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
        image:false,
        footer:null,
        dimmer:"blurring",
        closeOnDimmerClick:true
    }

    @action openModal = (header:any, content: any, image:any, footer:any, dimmer?:string,closeOnDimmerClick?:boolean) =>{
        this.modal.open = true;
        this.modal.body = content;
        this.modal.header = header;
        this.modal.image = image;
        this.modal.footer = footer;
        this.modal.dimmer = dimmer === "inverted" ? "inverted" : "blurring";
        this.modal.closeOnDimmerClick = closeOnDimmerClick === true ? true :false;
    }

    @action closeModal = () => {
        this.modal.open = false;
        this.modal.body = null;
        this.modal.header = null;
        this.modal.image = false;
        this.modal.footer = null;
    }
}