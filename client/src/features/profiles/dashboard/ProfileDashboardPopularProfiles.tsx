import { observer } from 'mobx-react-lite';
import React, { useContext} from 'react'
import {Grid,  Header,  Label} from 'semantic-ui-react'
import { useStore } from '../../../app/stores/rootStore';
import ProfileListItem from './ProfileListItem'
import { useMediaQuery } from 'react-responsive';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import 'swiper/swiper.scss'; // core Swiper
import 'swiper/modules/navigation/navigation.scss'; // Navigation module
import 'swiper/modules/pagination/pagination.scss'; // Pagination module
import SwiperCore, {
  Pagination,Navigation
} from 'swiper';
import PopularProfileItem from './PopularProfileItem';

SwiperCore.use([Pagination,Navigation]);



 const ProfileDashboardPopularProfiles: React.FC = () => {

    const rootStore = useStore();
    const {loadingPopularProfiles,popularProfileList} = rootStore.profileStore;

      
   const isTablet = useMediaQuery({ query: '(max-width: 820px)' })
   const isMobile = useMediaQuery({ query: '(max-width: 450px)' })


    return (
        <>
     {/* <Label size='medium' style={{backgroundColor: "#222E50", color:"#fff", fontSize:"17px", marginBottom:"10px", marginTop:"30px"}}>
               En popüler 10
               </Label> */}
      <Header size="large" style={{color:"#222E50", textAlign:"center", marginBottom:"20px", marginTop:"30px"}} content="En Popüler 10"/>

        <Grid>
          <Grid.Column className="carousel-padding">
          
          <Swiper
            pagination={{
              "clickable": true
            }} 
            spaceBetween={10}
            slidesPerView={isMobile? 1: isTablet?3 :4}
            navigation={true} 
            initialSlide={0}
        >
     {
       popularProfileList.map((pro,i) => (
        <SwiperSlide key={pro.userName+"_" +i}>
          <PopularProfileItem key={pro.userName+"_popularListItems"} profile={pro} popular={true} />
         </SwiperSlide>
      ))
     }
     
     </Swiper>
  
          </Grid.Column>
          
          </Grid>
          </>
    )
}

export default observer(ProfileDashboardPopularProfiles)
