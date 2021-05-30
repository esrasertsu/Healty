import { action, observable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { ICity } from "../models/location";
import { RootStore } from "./rootStore";

export default class CommonStore {
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;

        reaction(
            () => this.token,
            token => {
                if(token) {
                    window.localStorage.setItem('jwt', token);
                } else {
                    window.localStorage.removeItem('jwt');
                }
            }
        )
    }

    @observable token: string | null = window.localStorage.getItem('jwt');
    @observable appLoaded  = false;

    @observable activeMenu  = -1;
    @observable loadingCities = false;
    @observable cities: ICity[] = [];
    @observable cityRegistery = new Map();

    @action setToken = (token: string | null) => {
        this.token = token;
    }

    @action setAppLoaded = () => {
        this.appLoaded = true;
    }

    @action setActiveMenu = (index: number) => {
        this.activeMenu = index;
    }

    @action loadCities = async () =>{
        this.loadingCities = true;

        try {
            const list = await agent.Cities.list();
            runInAction(()=>{
                this.cities = list;
                list.forEach((city) =>{
                    //set props, Activity store'a bakıp kullanıcı commentini belirleme işlemi yapabilirsin..
                    this.cityRegistery.set(city.key, city);
                });
                this.loadingCities = false;
            })
        } catch (error) {
            runInAction(()=>{
                this.loadingCities = false;
            })
            console.log(error);
        }
    }
}