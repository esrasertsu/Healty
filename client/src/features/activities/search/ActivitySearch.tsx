import React from 'react'

export const ActivitySearch = () => {
  return (
    <div>
      
    </div>
  )
}

// import React, { Component, Fragment } from "react";
// import ReactDOM from "react-dom";
// import {
//   ReactiveBase,
//   DataSearch,
//   NumberBox,
//   DateRange,
//   RangeSlider,
//   MultiList,
//   ReactiveList,
//   ResultList
// } from "@appbaseio/reactivesearch";
// import { ReactiveGoogleMap } from "@appbaseio/reactivemaps";
// import { IActivitySearch } from "../../../app/models/activity";
// import { Container, Grid } from "semantic-ui-react";
// const { ResultListWrapper } = ReactiveList;




//  const ActivitySearch:React.FC = () => {
//     return (
//         <ReactiveBase
//           app="reactivity"
//          // url="https://51xXanFLQ:37294d08-ca53-4c07-8ac3-36ad42af813f@reactivity-data-jzbnbjz-arc.searchbase.io"
//          // enableAppbase
//           credentials="84786e11f9a8:118dab61-226a-4313-ae1c-ed55c40e7eb0"
//           // appbaseConfig={
//           //   {recordAnalytics:false,
//           //     enableQueryRules:false, searchStateHeader:false, emptyQuery:true, suggestionAnalytics:false,userId:"",customEvents:{}}
//           // }
//           mapKey="AIzaSyA3ZyyK3PwyiBkpxDQNrbNIdUNXqr659AY"
//           type="listing"
//           theme={{
//             colors: {
//               primaryColor: "#41ABF5"
//             }
//           }}
//         >
//           {/* <Container className="filters-search-container">
//             <div className="filter-container">
//               <div className="dropdown">
//                 <button className="button">Price</button>
//                 <div className="dropdown-content">
//                   <RangeSlider
//                     componentId="PriceSensor"
//                     dataField="price"
//                     title="Price Range"
//                     range={{
//                       start: 10,
//                       end: 250
//                     }}
//                     rangeLabels={{
//                       start: "$10",
//                       end: "$250"
//                     }}
//                     defaultValue={{
//                       start: 10,
//                       end: 50
//                     }}
//                     stepValue={10}
//                     interval={20}
//                     react={{
//                       and: ["DateRangeSensor", "GuestSensor"]
//                     }}
//                     className="rangeFilter"
//                   />
//                 </div>
//               </div>
//               <div className="dropdown">
//                 <button className="button">Guests</button>
//                 <div className="dropdown-content-guest">
//                   <NumberBox
//                     componentId="GuestSensor"
//                     dataField="accommodates"
//                     title="Guests"
//                     defaultValue={2}
//                     labelPosition="right"
//                     data={{
//                       start: 1,
//                       end: 16
//                     }}
//                     className="numberFilter"
//                   />
//                 </div>
//               </div>

//               <div className="dropdown">
//                 <button className="button ">When</button>
//                 <div className="dropdown-content">
//                   <DateRange
//                     dataField="date_from"
//                     componentId="DateRangeSensor"
//                     title="When"
//                     numberOfMonths={2}
//                     queryFormat="basic_date"
//                     initialMonth={new Date("04/01/2017")}
//                     className="dateFilter"
//                   />
//                 </div>
//               </div>
//             </div>
//             <div className="search-container">
//               <DataSearch
//                 componentId="searchsensor"
//                 dataField={["name","name.search", "name.autosugges", "city", "city.search"]}
//                 placeholder="Search housings..."
//                 iconPosition="left"
//                 className="search"
//                 fieldWeights={[3,1,1,2,1]}
//                 onValueSelected={(value, cause, source)=>{
//                     console.log(value,source)
//                 }}
//               />
//             </div>
//           </Container> */}
//                   <Grid>
// <Grid.Row>
//     <Grid.Column width={3} ></Grid.Column>
//     <Grid.Column width={13} >

// <DataSearch
//                 componentId="searchsensor"
//                 dataField={["name","name.search", "name.autosugges", "city", "city.search"]}
//                 placeholder="Search housings..."
//                 iconPosition="left"
//                 className="search"
//                 fieldWeights={[3,1,1,2,1]}
//                 onValueSelected={(value, cause, source)=>{
//                     console.log(value,source)
//                 }}
//               />
//               </Grid.Column>
// </Grid.Row>
// <Grid.Row>


//            <Grid.Column width={3}>
//               <MultiList componentId="CategorySensor" dataField="bed_type.keyword" showCheckbox/>
//           </Grid.Column>
          

//           {/*
//             <Grid.Column width={5}>
//               <ReactiveList componentId="SearchResult" react={{ and:['CategorySensor','searchsensor']}} 
//              dataField="name"
//               renderItem={res => <div>{res.name}</div>}
//               pagination
//               render={(data:{loading:boolean; error:boolean; data:IActivitySearch[];}) => {
//                   if(data.loading){
//                       return <div>Loading Data</div>
//                   }
//                   if(data.error)
//                   {
//                      return <div>Something went wrong</div>
//                   }
//                   return (
//                     <ResultListWrapper>
//                     {
//                         data.data.map(item => (
//                             <ResultList key={item._id}>
//                                 <ResultList.Image src={item.image} />
//                                 <ResultList.Content>
//                                     <ResultList.Title
//                                         dangerouslySetInnerHTML={{
//                                             __html: item.name
//                                         }}
//                                     />
//                                     <ResultList.Description>
//                                         <div>
//                                             <div>by {item.price}</div>
//                                             <div>
//                                                 ({item.property_type} avg)
//                                             </div>
//                                         </div>
//                                          <span>
//                                             Pub {item.property_type}
//                                         </span>
//                                     </ResultList.Description>
//                                 </ResultList.Content>
//                             </ResultList>
//                         ))
//                     }
//                 </ResultListWrapper>
//                   )
//               }
//               }
//               />
//           </Grid.Column> 
//           */}

//           <Grid.Column width={13}>
//             <ReactiveGoogleMap
//             react={{
//                 and: ["CategorySensor", "searchsensor"]
//               }}
//               componentId="map"
//               dataField="location"
//               defaultZoom={13}
              
//             //  pagination
//             //   onPageChange={() => {
//             //     window.scrollTo(0, 0);
//             //   }}
//             //   style={{
//             //     width: "calc(100% - 280px)",
//             //     height: "calc(100vh - 52px)"
//             //   }}
//             //   className="rightCol"
//             //showMarkers={false}
//               showSearchAsMove={false}
//              onPopoverClick={ (item:IActivitySearch) =>  <div>{item.room_type}</div>}
//              renderError={(error:any) => (
//               <div>
//                   Something went wrong!<br/>Error details<br/>{error}
//               </div>
//           )
//       }
//               renderAllData={(
//                 hits:IActivitySearch[],
//                 streamHits:any,
//                 loadMore:any,
//                 renderMap:any,
//                 renderPagination:any,
//               //  triggerClickAnalytics:(id:string) => void
//               ) => {
//                   return (
//                 <div style={{ display: "flex", flexDirection:"row", flexWrap:"nowrap" }}>
//                     <ResultListWrapper style={{width:"40%", height:"80vh", overflow:"auto"}}>
//                     {hits.map(item =>  (   
//                       <div key={item._id}  onClick={(event) => {event.persist()}}   >                  
//                         <ResultList key={item._id}>
//                         <ResultList.Image src={item.image} />
//                         <ResultList.Content>
//                             <ResultList.Title
//                                 dangerouslySetInnerHTML={{
//                                     __html: item.name
//                                 }}
//                             />
//                             <ResultList.Description>
//                                 <div>
//                                     <div>by {item.price}</div>
//                                     <div>
//                                         ({item.property_type} avg)
//                                     </div>
//                                 </div>
//                                 {/* <span>
//                                     Pub {item.property_type}
//                                 </span> */}
//                             </ResultList.Description>
//                         </ResultList.Content>
//                     </ResultList>
//                     </div>
//                     ))
//                   }
//                   <button onClick={()=> {loadMore();}} 
//                   style={{background:"dodgerblue", color:"white", padding:10, border:0, borderRadius:4, margin:5, cursor:"pointer"}}
//                 > Load More {" "} </button>
//                   </ResultListWrapper>
//                   <div>{renderPagination()}</div>

//                   {/* <div>
//                     <div className="card-container">
//                       {hits.map(data => (
//                         <div key={data._id} className="card">
//                           <div
//                             className="card__image"
//                             style={{ backgroundImage: `url(${data.image})` }}
//                           />
//                           <div>
//                             <h2>{data.name}</h2>
//                             <div className="card__price">${data.price}</div>
//                             <p className="card__info">
//                               {data.room_type} · {data.accommodates} guests
//                             </p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                     <div>{renderPagination()}</div>
//                   </div> */}
//                    <div style={{width:"60%", position:"sticky"}}>{renderMap()}</div> 
                   
//                 </div>
//               )
//             }}
//               //  renderData={(data: { name: React.ReactNode; price: React.ReactNode; }) => ({
//               //   label: (
//               //     <div
//               //       className="marker"
//               //       style={{
//               //         width: 40,
//               //         display: "block",
//               //         textAlign: "center"
//               //       }}
//               //     >
//               //       <div className="extra-info">{data.name}</div>${data.price}
//               //     </div>
//               //   )

//               //   // custom: (
//               //   //     <div
//               //   //       style={{
//               //   //         background: "dodgerblue",
//               //   //         color: "#fff",
//               //   //         paddingLeft: 5,
//               //   //         paddingRight: 5,
//               //   //         borderRadius: 3,
//               //   //         padding: 10
//               //   //       }}
//               //   //     >
//               //   //       <i className="fas fa-globe-europe" />
//               //   //       &nbsp;{data.price}
//               //   //     </div>
//               //   //   )
//               //  })}
              
//             />
//          </Grid.Column>
//          </Grid.Row>
//          </Grid>
//         </ReactiveBase>
      

//     );
// }


// export default ActivitySearch;