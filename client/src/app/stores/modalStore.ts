import { action, makeObservable, observable } from "mobx";
import { RootStore } from "./rootStore";
import { history } from '../../index';

export default class ModalStore {
    rootStore : RootStore;
    constructor(rootStore: RootStore){
        this.rootStore = rootStore;
        makeObservable(this);

    }

    @observable.shallow modal = {
        open: false,
        body: null,
        header: null,
        image:false,
        footer:null,
        dimmer:"blurring",
        closeOnDimmerClick:true,
        redirectPage:"",
        className:""
    }

    @action openModal = (header:any, content: any, image:any, footer:any, dimmer?:string,closeOnDimmerClick?:boolean,className?:string
      //  redirectPage?:string
        ) =>{
        this.modal.open = true;
        this.modal.body = content;
        this.modal.header = header;
        this.modal.image = image;
        this.modal.footer = footer;
        this.modal.dimmer = dimmer === "inverted" ? "inverted" : "blurring";
        this.modal.closeOnDimmerClick = closeOnDimmerClick === false ? false :true;
        this.modal.className = className || "";
       // this.modal.redirectPage=redirectPage ? redirectPage : "";
    }

    @action closeModal = () => {
        this.modal.open = false;
        this.modal.body = null;
        this.modal.header = null;
        this.modal.image = false;
        this.modal.footer = null;
        // if(this.modal.redirectPage && this.modal.redirectPage!=="")
        //  history.push(this.modal.redirectPage);
    }
}