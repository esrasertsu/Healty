import { action, observable, reaction, runInAction } from "mobx";
import React from "react";
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
    @observable userCity  = "";

    @observable activeMenu  = -1;
    @observable loadingCities = false;
    @observable cities: ICity[] = [];
    @observable cityRegistery = new Map();

    @action setToken = (token: string | null) => {
        this.token = token;
    }
    @action setUserCity = (city: string) => {
        this.userCity = city;
        this.rootStore.profileStore.setProfileFilterForm({...this.rootStore.profileStore.profileFilterForm, cityId:city})
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

    @action getUserLocation = async () => {

        var setUserCity = this.setUserCity;
        var cityRegistery = this.cityRegistery;

        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          };

        if (navigator.geolocation) {
            navigator.permissions
              .query({ name: "geolocation" })
              .then(function (result) {
                if (result.state === "granted") {
                  console.log(result.state);
                  navigator.geolocation.getCurrentPosition((pos:any) => success(pos,setUserCity,cityRegistery));
                  //If granted then you can directly call your function here
                } else if (result.state === "prompt") {
                  console.log(result.state);
                  navigator.geolocation.getCurrentPosition((pos:any) => success(pos,setUserCity,cityRegistery), errors, options);
                } else if (result.state === "denied") {
                    debugger;
                  //If denied then you have to show instructions to enable location
                }
                result.onchange = function () {
                  console.log(result.state);
                };
              });
          } else {
            alert("Sorry Not available!");
          }
        }
    
}

function success(pos:any,setUserCity:any,cityRegistery:Map<any,any>) {
    const geocoder = new google.maps.Geocoder();

    var crd = pos.coords;
    debugger;


    var latlng = new window.google.maps.LatLng(crd.latitude, crd.longitude);
    

    geocoder!.geocode(
      {'location': latlng}, 
    function(results, status) {
        if (status == "OK") {
            debugger;
            var addressComponentLength =results.filter(x => x.types.includes("postal_code"))[0].address_components.length;
            var cityName = results.filter(x => x.types.includes("postal_code"))[0].address_components[addressComponentLength-2].long_name;
            //setUserCity(cityName);

           // alert("city name is: " + cityName); 
                 var userCity = Array.from(cityRegistery.values()).filter(x => x.text === cityName);
                if (cityName && userCity.length > 0) {
                    setUserCity(userCity[0].key);
                   // alert("city name is: " + userCity[0].key);
                    // debugger;
                    // var add= results[6].formatted_address ;
                    // var  value=add.split(",");
    
                    // var count=value.length;
                    // var country=value[count-1];
                    // var city=value[count-2];
                }
                else  {
                    alert("address not found");
                }
        }
         else {
            alert("Geocoder failed due to: " + status);
        }
    })

 }

function errors(err: any): void {
    console.warn(`ERROR(${err.code}): ${err.message}`);
   }
