import { action, computed, makeObservable, observable, runInAction } from "mobx";
import agent from "../api/agent";
import { RootStore } from "./rootStore";
import { IAllCategoryList, IAllCategoryOption, ICategory, IPredicate, ISubCategory } from "../models/category";
const LIMIT = 10;
export default class ContractStore{
    rootStore: RootStore
    constructor(rootStore: RootStore){
        this.rootStore = rootStore;
        makeObservable(this);

    }
    @observable contract : string = "";
    @observable MSSContract: any ="";
    @observable OnBilContract: any ="";

    @observable loadingContracts = false;

    @action setLoadingContracts = (lp : boolean) =>{
        this.loadingContracts = lp;
    }

  
    @action loadContract = async (id:string) =>{
        this.loadingContracts = true;
        try {
            const contract = await agent.Contract.get(id);
            runInAction(()=>{
                this.contract = contract;
                this.loadingContracts = false;
            })
        } catch (error) {
            runInAction(()=>{
                this.loadingContracts = false;
            })
            console.log(error);
        }
    
    }

    @action loadMSSContract = async (id:string) =>{
        this.loadingContracts = true;
        try {
            const contract = await agent.Contract.get(id);
            runInAction(()=>{
                this.MSSContract = contract;
                this.loadingContracts = false;
            })
        } catch (error) {
            runInAction(()=>{
                this.loadingContracts = false;
            })
            console.log(error);
        }
    
    }

    @action loadOnBilContract = async (id:string) =>{
        this.loadingContracts = true;
        try {
            const contract = await agent.Contract.get(id);
            runInAction(()=>{
                this.OnBilContract = contract;
                this.loadingContracts = false;
            })
        } catch (error) {
            runInAction(()=>{
                this.loadingContracts = false;
            })
            console.log(error);
        }
    
    }

}