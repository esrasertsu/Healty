import { observer } from 'mobx-react-lite';
import React, { createRef, Fragment, useContext, useEffect,useRef,useState } from 'react'
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
  
  let firstClientX :any,firstClientY :any, clientX,clientY;

  const preventTouch = (e:any) => {
    const minValue = 80; // threshold
    const minValueY = 50; // threshold

    clientX = e.touches[0].clientX - firstClientX;
    clientY = e.touches[0].clientY - firstClientY;

    // Vertical scrolling does not work when you start swiping horizontally.
    if (Math.abs(clientX) > minValue && Math.abs(clientY) < minValueY) {
      // console.log(Math.abs(clientX));
     
      e.stopPropagation();
      e.returnValue = false;
      document.body.classList.add("stopScrollCss");
      return false;
    }
  };
  
  const touchStart = (e:any) => {
    firstClientX = e.touches[0].clientX;
    firstClientY = e.touches[0].clientY;

  };

  const enableScroll = (e:any) => {
    // firstClientX = e.touches[0].clientX;
    document.body.classList.remove("stopScrollCss");

  };

    return (
        <>
     <Label size='medium' style={{backgroundColor: "#263a5e", color:"#fff", fontSize:"17px", marginBottom:"10px", marginTop:"30px"}}>
               En popüler 10
               </Label>
        <Grid>
          <Grid.Column 
          width={16} 
          className="carousel-padding"
          id="multi-carousel"
          onTouchStart={(touchStartEvent:any) =>  touchStart(touchStartEvent)}
          onTouchMove={(touchMoveEvent:any) => preventTouch(touchMoveEvent)}
          onTouchEnd={(touchEndEvent:any) => enableScroll(touchEndEvent)}

          >
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
            // beforeChange={(nextSlide,{currentSlide}) => {
            //   document.querySelector('body')!.addEventListener('touchstart', touchStart);
            //   document.querySelector('body')!.addEventListener('touchmove', preventTouch, {passive: false});
            // }}
            // afterChange={() => {
            //   document.querySelector('body')!.removeEventListener('touchstart', touchStart);
            //   document.querySelector('body')!.removeEventListener('touchmove', preventTouch);
            // }}
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
