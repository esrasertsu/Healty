 import React, { useContext} from "react";
// import {
//   GoogleMap,
//   useLoadScript,
//   Marker,
//   InfoWindow
// } from "@react-google-maps/api";
// import usePlacesAutocomplete, {
//   getGeocode,
//   getLatLng,
// } from "use-places-autocomplete";
// import {
//   Combobox,
//   ComboboxInput,
//   ComboboxPopover,
//   ComboboxList,
//   ComboboxOption,
// } from "@reach/combobox";
// import { formatRelative } from "date-fns";

// import "@reach/combobox/styles.css";
// import mapStyles from "../search/mapStyles";
import { IActivityMapItem, IActivityLocation } from "../../../app/models/activity";
// import { useStore } from "../../../app/stores/rootStore";
 import { observer } from "mobx-react-lite";
// import { LoadingComponent } from "../../../app/layout/LoadingComponent";
// import { LoadScriptUrlOptions } from "@react-google-maps/api/dist/utils/make-load-script-url";
// import { Button, Segment } from "semantic-ui-react";

// const mapContainerStyle = {
//   height: "60vh",
// };
// const options = {
//   styles: mapStyles,
//   zoomControl: true,
// };
// const center = {
//   lat: 38.4237,
//   lng: 27.1428,
// };
// const libraries = ["places"] as LoadScriptUrlOptions["libraries"];
// const markerList : IActivityMapItem[] = [];

interface IProps{
    centerLocation: IActivityLocation;
 }

 const ActivityDetailsMap: React.FC<IProps> = ({centerLocation}) => {
 return (
 <>
 </>
 );
//    // const REACT_APP_GOOGLE_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string;
//    const { isLoaded, loadError } = useLoadScript({
//       googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
//       //libraries:["places"] düzgün çalışıyor ama console a hata veriyor 
//       libraries
//   });

//   const rootStore = useStore();
//   const {setMarkers,markers,selected, setSelected} = rootStore.activityStore;
  
//    const mapRef = React.useRef<google.maps.Map | null>(null);
//   const onMapClick = React.useCallback((e) => {

//     const item : IActivityMapItem = { lat: e.latLng.lat(),
//         lng: e.latLng.lng(),
//         time: new Date() };
    
//       markerList.push(item);
//       setMarkers(markerList);
//   }, [setMarkers]);

//   const onMapLoad = React.useCallback((map: google.maps.Map) => {
//     mapRef.current = map;
//   }, []);

//   const panTo = React.useCallback(({ lat, lng } : google.maps.LatLng | google.maps.LatLngLiteral)  => {
//      mapRef.current!.panTo(new google.maps.LatLng( lat as number, lng as number ))
//      mapRef.current!.setZoom(14);
//   }, []);

//    if (loadError) return <LoadingComponent content='Loading Activities'/>
//    if (!isLoaded) return <LoadingComponent content='Loading Activities'/>

//   return (
//     <Segment>
//       {/* <h1>
//         Location in map{" "}
//       </h1> */}
//      {/* <Locate panTo={panTo} />
//      <Search panTo={panTo} />  */}

//       <GoogleMap
//         id = "map"
//         mapContainerStyle={mapContainerStyle}
//         zoom={12}
//         center={centerLocation}
//         options={options as google.maps.MapOptions} 
//        // onClick={onMapClick}
//         onLoad={onMapLoad}
//       >
//           <InfoWindow
//             position={{ lat: centerLocation.lat, lng: centerLocation.lng }}
//             onCloseClick={() => {
//               setSelected(null);
//             }}
//           >
//             <div>
//               <h2>
//                 <span role="img" aria-label="bear">
//                   🐻
//                 </span>{" "}
//                 Alert
//               </h2>
//             </div>
//           </InfoWindow>
//         ) 
//       </GoogleMap>
//     </Segment>
//   );
// }

// const Locate = ({ panTo }: any) => {
//   return (
//     <Button
//       className="locate"
//       content="Locate"
//       onClick={() => {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             panTo({
//               lat: position.coords.latitude,
//               lng: position.coords.longitude,
//             });
//           },
//           () => null
//         );
//       }}
//     >
//       {/* <img src="/compass.svg" alt="" /> */}
//     </Button>
//   );
// }

// const Search = ({ panTo }: any) => {
  
//   const {
//     ready,
//     value,
//     suggestions: { status, data },
//     setValue,
//     clearSuggestions,
//   } = usePlacesAutocomplete({
//     requestOptions: {
//       location: { lat: () => 43.6532, lng: () => -79.3832 } as google.maps.LatLng,
//       radius: 100 * 1000,
//     },
//   });

//   // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest

//   const handleInput = (e: any) => {
//     setValue(e.target.value);
//   };

//   const handleSelect = async (address: string) => {
//     setValue(address, false);
//     clearSuggestions();

//     try {
//       const results = await getGeocode({ address });
//       const { lat, lng } = await getLatLng(results[0]);
//       panTo({ lat, lng });
//     } catch (error) {
//       console.log("😱 Error: ", error);
//     }
//   };

//   return (
//     <Segment className="search">
//       <Combobox onSelect={handleSelect}>
//         <ComboboxInput
//           value={value}
//           onChange={handleInput}
//           disabled={!ready}
//           placeholder="Search your location"
//         />
//         <ComboboxPopover>
//           <ComboboxList>
//             {status === "OK" &&
//               data.map(({ id, description }) => (
//                 <ComboboxOption key={id} value={description} />
//               ))}
//           </ComboboxList>
//         </ComboboxPopover>
//       </Combobox>
//     </Segment>
//   );
 }
export default observer(ActivityDetailsMap)