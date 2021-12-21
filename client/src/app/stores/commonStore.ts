import { action, computed, observable, reaction, runInAction,makeObservable } from "mobx";
import agent from "../api/agent";
import { ICity } from "../models/location";
import { RootStore } from "./rootStore";

export default class CommonStore {
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeObservable(this);

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
    @observable userCity  = "";
    @observable userCityPlaced  = false;

    @observable activeMenu  = -1;
    @observable loadingCities = false;
    @observable cities: ICity[] = [];
    @observable cityRegistery = new Map();
    @observable loadingDocs = false;

    @action setToken = (token: string | null) => {
        this.token = token;
    }
    @action setUserCity = (city: string) => {
        this.userCity = city;
        this.rootStore.profileStore.setProfileFilterForm({...this.rootStore.profileStore.profileFilterForm, cityId:city});
        this.userCityPlaced = true;
    }
    @action setUserCityPlaced = (bool: boolean) => {
        this.userCityPlaced = true;
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
                this.getUserLocation();
            })
        } catch (error) {
            runInAction(()=>{
                this.loadingCities = false;
            })
            console.log(error);
        }
    }

    @action loadTrainerDocuments = async (username:string) =>{
        this.loadingDocs = true;

        try {
            const list = await agent.Documents.list(username);
            runInAction(()=>{
              //  this.cities = list;
                list.forEach((city) =>{
                    //set props, Activity store'a bakıp kullanıcı commentini belirleme işlemi yapabilirsin..
                  //  this.cityRegistery.set(city.key, city);
                });
                this.loadingDocs = false;
                return list;
            })
        } catch (error) {
            runInAction(()=>{
                this.loadingDocs = false;
                return null;
            })
            console.log(error);
        }
    }


    @action uploadFile  = async (username:string,file:any, onUploadProgress:any) =>{
        this.loadingDocs = true;

        try {
            const list = await agent.Documents.upload(file,onUploadProgress,username);
            runInAction(()=>{
              //  this.cities = list;
                // list.forEach((city) =>{
                //     //set props, Activity store'a bakıp kullanıcı commentini belirleme işlemi yapabilirsin..
                //   //  this.cityRegistery.set(city.key, city);
                // });
                this.loadingDocs = false;
                return list;
            })
        } catch (error) {
            runInAction(()=>{
                this.loadingDocs = false;
                return null;
            })
            console.log(error);
        }
    }

    @action getUserLocation = async () => {

        var setUserCity = this.setUserCity;
        var cityRegistery = this.cityRegistery;
        var setUserCityPlaced = this.setUserCityPlaced;

        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          };

        if (navigator.geolocation && ( navigator.permissions && navigator.permissions.query )) {
            navigator.permissions
              .query({ name: "geolocation" })
              .then(function (result) {
                if (result.state === "granted") {
                  console.log(result.state);
           //       navigator.geolocation.getCurrentPosition((pos:any) => success(pos,setUserCity,cityRegistery,setUserCityPlaced));
                  //If granted then you can directly call your function here
                } else if (result.state === "prompt") {
                  console.log(result.state);
              //    navigator.geolocation.getCurrentPosition((pos:any) => success(pos,setUserCity,cityRegistery,setUserCityPlaced), errors, options);
                } else if (result.state === "denied") {
                    debugger;
                    setUserCityPlaced(true);
                  //If denied then you have to show instructions to enable location
                }
                result.onchange = function () {
                  console.log(result.state);
                };
              });
          } 
        }
    
}

function success(pos:any,setUserCity:any,cityRegistery:Map<any,any>,setUserCityPlaced:any) {
 
        const geocoder = new google.maps.Geocoder();

        var crd = pos.coords;
    
        var latlng = new window.google.maps.LatLng(crd.latitude, crd.longitude);
        
    
        // geocoder!.geocode(
        //   {'location': latlng}, 
        // function(results, status) {
        //     if (status === "OK") {
        //         var addressComponentLength =results.filter(x => x.types.includes("postal_code"))[0].address_components.length;
        //         var cityName = results.filter(x => x.types.includes("postal_code"))[0].address_components[addressComponentLength-2].long_name;
        //         //setUserCity(cityName);
    
        //        // alert("city name is: " + cityName); 
        //              var userCity = Array.from(cityRegistery.values()).filter(x => x.text === cityName);
        //             if (cityName && userCity.length > 0) {
        //                 //setUserCity(userCity[0].key); BURAYI AÇARSAN ŞEHİR OTO SEÇİLİ GELİR
        //             }
        //             else  {
        //                 alert("address not found");
        //             }
        //             setUserCityPlaced(true);
        //     }
        //      else {
        //         alert("Geocoder failed due to: " + status);
        //     }
        // })
    
   

 }

function errors(err: any): void {
    console.warn(`ERROR(${err.code}): ${err.message}`);
   }
