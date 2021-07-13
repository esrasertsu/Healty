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
import ReactDOMServer from 'react-dom/server'
import { faSort } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    partialVisibilityGutter: 30 
  }
};


const fiveItem:SemanticWIDTHS = 5;
const sixItem:SemanticWIDTHS = 6;

 const ProfileDashboard: React.FC = () => {

    const rootStore = useContext(RootStoreContext);
    const {loadingProfiles, loadProfiles,setPage,page,totalProfileListPages,profileRegistery,
      popularProfileList,profilePageCount, clearProfileRegistery,sortProfiles,loadingOnlyProfiles,sortingInput,setSortingInput} = rootStore.profileStore;
    const {appLoaded, userCityPlaced} = rootStore.commonStore;
    const [isToggleVisible, setIsToggleVisible] = useState(false);


    const list = [
      'Hata olduğunu düşünüyorsanız site yöneticisiyle iletişime geçebilir,',
      'Talepte bulunmak için bize mail atabilir,',
      'Ya da bir eğitmen olarak başvurabilirsiniz'
    ]
    useEffect(() => {
      if(appLoaded && userCityPlaced)
        loadProfiles();

        window.addEventListener("scroll", toggleVisibility);

        return () => {
          setPage(0);
         clearProfileRegistery();
         window.removeEventListener("scroll", toggleVisibility);
        }
    }, [loadProfiles,userCityPlaced])
  
    // Show button when page is scorlled upto given distance
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsToggleVisible(true);
      } else {
        setIsToggleVisible(false);
      }
    };
  
    // Set the top cordinate to 0
    // make scrolling smooth
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    };

    const handleSortingChange = (e:any,data:any) => {
      setSortingInput(data.value);
      setLoadingNext(true);
      setPage(0);
      clearProfileRegistery();
      sortProfiles().then(() => setLoadingNext(false))
    }
    const [loadingNext, setLoadingNext] = useState(false);

    const handleGetNext = () => {
      setLoadingNext(true);
      setPage(page +1);
      if(sortingInput==="")
      {
        loadProfiles().finally(() => setLoadingNext(false))
      }
      else {
        sortProfiles().finally(() => setLoadingNext(false))
      }
    }


    return (
      <Fragment>
      <Segment inverted textAlign='center' vertical className='masthead_page'>
               <Container>
               <ProfileListFilters />
               </Container>
      </Segment>
      {Array.from(profileRegistery.values()).length === 0 && !loadingProfiles && !loadingNext?
       <>
       <br></br>
        <Message style={{marginTop:"30px"}} header='Aradığınız kriterlere uygun bir aktivite bulunamadı :(' list={list} />
      </> :
      <>
           <Label size='medium' style={{backgroundColor: "#263a5e", color:"#fff", fontSize: '16px', marginBottom:"10px", marginTop:"30px"}}>
               En popüler 10
               </Label>
        <Grid stackable>
          <Grid.Column width={16}>
            {
            loadingProfiles && page === 0  ?  <ProfileListItemsPlaceholder itemPerRow={fiveItem}/> :
            <Carousel
            renderButtonGroupOutside={true}
            partialVisible={true}
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
           >
                {
                popularProfileList.map((pro) => (
                    <ProfileListItem key={pro.userName+"_popularListItems"} profile={pro} />
                ))
                }
            </Carousel> 
            }
          </Grid.Column>
          </Grid>
          <Grid>
          <Grid.Column width={16} className="profileList_headerAndSorting">
          <div>
          <Label size='medium' style={{backgroundColor: "#263a5e", color:"#fff",marginTop:"30px",fontSize: '16px'}}> Tümü ({profilePageCount}) </Label>
          </div>
          <div>
          <Select 
            value={sortingInput}
            onChange={handleSortingChange}
            placeholder= {"Sırala"}
            options={profileSortingOptions}
         />  </div>
          </Grid.Column>
         <Grid.Column width={16}>
         {
         (loadingProfiles && page === 0) && loadingOnlyProfiles ? 
         <ProfileListItemsPlaceholder itemPerRow={sixItem} /> :
          <InfiniteScroll
          pageStart={0}
          loadMore={handleGetNext}
          hasMore={!loadingNext && page +1 < totalProfileListPages}
          initialLoad={false}>
           <ProfileList />
           </InfiniteScroll> 
          }
          {(loadingNext && page+1 < totalProfileListPages) ? <ProfileListItemsPlaceholder itemPerRow={sixItem}/> :""}
          <div className="scroll-to-top">
          {isToggleVisible && 
            <Label style={{display:"flex", alignItems:"center"}} onClick={scrollToTop}>
              <Icon size="large" name="arrow up"/> 
              <span>Başa dön</span>
            </Label>}
        </div>
          </Grid.Column>
      </Grid>
      <br></br>
      <br></br>
      </>
      }
      </Fragment>
    )
}

export default observer(ProfileDashboard)
