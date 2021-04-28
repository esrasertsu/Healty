import React, { useContext} from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import { formatRelative } from "date-fns";

import "@reach/combobox/styles.css";
import mapStyles from "./mapStyles";
import { IActivityMapItem } from "../../../app/models/activity";
import { RootStoreContext } from "../../../app/stores/rootStore";
import { observer } from "mobx-react-lite";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";
import { LoadScriptUrlOptions } from "@react-google-maps/api/dist/utils/make-load-script-url";
import { Button, Segment } from "semantic-ui-react";

const mapContainerStyle = {
  height: "70vh",
  width: "41vw",
};
const options = {
  styles: mapStyles,
 // disableDefaultUI: true,
  zoomControl: true,
};
const center = {
  lat: 38.4237,
  lng: 27.1428,
};
const libraries = ["places"] as LoadScriptUrlOptions["libraries"];
const markerList : IActivityMapItem[] = [];

const ActivitySearchPage: React.FC = () => {
   // const REACT_APP_GOOGLE_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string;
   const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
      //libraries:["places"] düzgün çalışıyor ama console a hata veriyor 
      libraries
  });

  const geocoder = React.useRef<google.maps.Geocoder | null>(null);
  // const geocoder = new google.maps.Geocoder();
  // const infowindow = new google.maps.InfoWindow();


  const rootStore = useContext(RootStoreContext);
  const {setMarkers,markers,selected, setSelected} = rootStore.activityStore;
  
   const mapRef = React.useRef<google.maps.Map | null>(null);
  const onMapClick = React.useCallback((e) => {

    const item : IActivityMapItem = { 
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        time: new Date()
       };
    
      markerList.push(item);
      setMarkers(markerList);
  }, [setMarkers]);

  const onMapLoad = React.useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng } : google.maps.LatLng | google.maps.LatLngLiteral)  => {
     mapRef.current!.panTo(new google.maps.LatLng( lat as number, lng as number ))
     mapRef.current!.setZoom(18);
  }, []);

   if (loadError) return <LoadingComponent content='Loading Activities'/>
   if (!isLoaded) return <LoadingComponent content='Loading Activities'/>

  return (
    <div>
      {/* <h1>
        Bears{" "}
        <span role="img" aria-label="tent">
          ⛺️
        </span>
      </h1> */}
<Segment>
<Locate panTo={panTo} />
</Segment>
<Segment>
<Search panTo={panTo} /> 
</Segment>

      <GoogleMap
        id = "map"
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={center}
        options={options as google.maps.MapOptions} 
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {markers && markers!.map((marker: IActivityMapItem) => (
          <Marker
            key={`${marker.lat}-${marker.lng}`}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => {
              setSelected(marker);
            }}
            icon={{
              url: `/bear.svg`,
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
              scaledSize: new window.google.maps.Size(30, 30),
            }}
          />
        ))}

        {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <div>
              <h2>
                <span role="img" aria-label="bear">
                  🐻
                </span>{" "}
                Alert
              </h2>
              <p>Spotted {formatRelative(selected.time, new Date())}</p>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
}

const Locate = ({ panTo }: any) => {
  return (
    <Button
      className="locate"
      content="My Location"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null
        );
      }}
    >
      {/* <img src="/compass.svg" alt="" /> */}
    </Button>
  );
}



const Search = ({ panTo }: any) => {
  
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 43.6532, lng: () => -79.3832 } as google.maps.LatLng,
      radius: 100 * 1000,
    },
  });

  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest

  const handleInput = (e: any) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      panTo({ lat, lng });
    } catch (error) {
      console.log("😱 Error: ", error);
    }
  };

  return (
    <div className="search">
      <Combobox className="pink" onSelect={handleSelect}>
        <ComboboxInput
         style={{ width: "100%", height:"35px", border:"1px solid rgba(34,36,38,.15)" }}
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search your location"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}
export default observer(ActivitySearchPage)
