import { observer } from 'mobx-react-lite';
import React, { Fragment, useContext, useEffect,useState } from 'react'
import {Container, Grid, Icon, Label, Message, Segment, Select } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore';
import ProfileListItem from './ProfileListItem'
import ProfileListFilters from './ProfileListFilters';
import { profileSortingOptions } from "../../app/common/options/profileSortingOptions";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import ProfileListItemsPlaceholder from './ProfileListItemsPlaceholder';
import InfiniteScroll from 'react-infinite-scroller';
import ProfileList from './ProfileList';
import { SemanticWIDTHS } from 'semantic-ui-react/dist/commonjs/generic';
import { useMediaQuery } from 'react-responsive'


const threeItem:SemanticWIDTHS = 3;
const oneItem:SemanticWIDTHS = 1;

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5
  },
  tablet: {
    breakpoint: { max: 1024, min: 430 },
    items: 3
  },
  mobile: {
    breakpoint: { max: 430, min: 0 },
    items: 1,
    //partialVisibilityGutter: 50 
  }
};



 const ProfileDashboardPopularProfiles: React.FC = () => {

    const rootStore = useContext(RootStoreContext);
    const {loadingPopularProfiles,popularProfileList} = rootStore.profileStore;

      
  const isTablet = useMediaQuery({ query: '(max-width: 768px)' })
  const isMobile = useMediaQuery({ query: '(max-width: 450px)' })


  

    return (
        <>
     <Label size='medium' style={{backgroundColor: "#263a5e", color:"#fff", fontSize:"17px", marginBottom:"10px", marginTop:"30px"}}>
               En popüler 10
               </Label>
        <Grid>
          <Grid.Column width={16} className="carousel-padding">
            {
            loadingPopularProfiles ?  <ProfileListItemsPlaceholder itemPerRow={isMobile ? oneItem : isTablet ? threeItem :5}/> :
            <Carousel
            renderButtonGroupOutside={true}
            partialVisible={false}
            swipeable={true}
            draggable={true}
            renderDotsOutside={true}
            responsive={responsive}
            ssr={false} // means to render carousel on server-side.
            infinite={false}
            autoPlay={false}
            autoPlaySpeed={5000}
            keyBoardControl={true}
            transitionDuration={400}
            focusOnSelect={true}
            containerClass="profileList_carousel-container"
            itemClass="carousel-item-padding-10-px"
          //  additionalTransfrom={additionalTransfrom}
          //   beforeChange={nextSlide => {
          //     if (nextSlide !== 0 && additionalTransfrom !== 72) {
          //       setAdditionalTransfrom(-100)
          //     }
          //     if (nextSlide === 0 && additionalTransfrom === 72) {
          //       setAdditionalTransfrom(0)
          //     }
          //   }}
           >
                {
                popularProfileList.map((pro) => (
                    <ProfileListItem key={pro.userName+"_popularListItems"} profile={pro} popular={true} />
                ))
                }
            </Carousel> 
            }
          </Grid.Column>
          </Grid>
          </>
    )
}

export default observer(ProfileDashboardPopularProfiles)
