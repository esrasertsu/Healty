import {observable, action, computed, runInAction, makeObservable} from 'mobx';
import { toast } from 'react-toastify';
import agent from '../api/agent';
import { IOrder } from '../models/order';
import { RootStore } from './rootStore';
import { history } from '../..';

const LIMIT = 6;
export default class OrderStore {

    rootStore:RootStore;
    constructor(rootStore: RootStore){
        this.rootStore = rootStore;
        makeObservable(this);


       
    }

   
    @observable orderRegistery = new Map<string,IOrder>();
    
    @observable order: IOrder | null = null;
    @observable loadingOrders = false;
    @observable loadingOrder = false;
  
    @observable orderCount = 0;
    @observable orderPage = 0;



    @action setOrderPage = (index:number) =>{
        this.orderPage = index;
    }


    @computed get totalOrderPages(){
        return Math.ceil(this.orderCount / 5);
    }

    @action deleteOrderRegisteryItem = (id:string) => {
        this.orderRegistery.delete(id);
    }

    @action clearOrderRegistery = () => {
        this.orderRegistery.clear();
    }


    @computed get orderList(){
          return Array.from(this.orderRegistery.values());
     }


    @action getOrders = async () => {
        this.loadingOrders = true;
        try {
            const ordersEnvelope = await agent.Order.list(5, this.orderPage ? this.orderPage * 5 : 0);
            const {orderList, orderCount } = ordersEnvelope;
            runInAction(() => {
                orderList.forEach((order) =>{
                    this.orderRegistery.set(order.id, order);
                });
                this.orderCount = orderCount;
                this.loadingOrders = false;
            })
            } catch (error) {
                console.log(error);
                runInAction(() => {
                  this.loadingOrders = false
                });
            }
    }

    @action getOrderDetails = async (id:string) => {
      
            this.loadingOrder = true;
            try {
                let order = await agent.Order.details(id);
                runInAction(() => {
                    this.order = order;
                    this.loadingOrder = false;
                })
                return order;
                } catch (error) {
                    runInAction(() => {
                      this.loadingOrder = false
                    });
                    console.log(error);
                }
            
    };

    
    getOrder = (id:string) => {
        return this.orderRegistery.get(id);
    }

    @action deleteOrder = async (orderId: string) =>{

        this.loadingOrders = true;
        try {
           await agent.Order.deleteOrder(orderId);
            runInAction(async() => {
                this.deleteOrderRegisteryItem(orderId);
                this.loadingOrders = false;
               // this.target = '';
                history.push(`/orders`);
            });

        } catch (error) {
            runInAction(() => {
                this.loadingOrders = false;
            });
            toast.error('Problem Processing refund payment');
            console.log(error);
        }
    };


 

}
