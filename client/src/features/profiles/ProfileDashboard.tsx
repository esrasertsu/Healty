import { observer } from 'mobx-react-lite';
import React, { Fragment, useContext, useEffect,useState } from 'react'
import {Button, Container, Grid, Label, Message, Segment, Select } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore';
import ProfileListFilters from './ProfileListFilters';
import { profileSortingOptions } from "../../app/common/options/profileSortingOptions";
import 'react-multi-carousel/lib/styles.css';
import ProfileListItemsPlaceholder from './ProfileListItemsPlaceholder';
import ProfileList from './ProfileList';
import { SemanticWIDTHS } from 'semantic-ui-react/dist/commonjs/generic';
import { useMediaQuery } from 'react-responsive'
import ProfileDashboardPopularProfiles from './ProfileDashboardPopularProfiles';


const threeItem:SemanticWIDTHS = 3;
const twoItems:SemanticWIDTHS = 2;

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


const fiveItem:SemanticWIDTHS = 5;
const sixItem:SemanticWIDTHS = 6;

 const ProfileDashboard: React.FC = () => {

    const rootStore = useContext(RootStoreContext);
    const {loadingPopularProfiles,popularProfileRegistery
    ,loadPopularProfiles,loadProfiles,setPage,page,totalProfileListPages,
    profilePageCount, clearProfileRegistery,loadingOnlyProfiles,sortingInput,setSortingInput,loadAccessibilities,
  accessibilities} = rootStore.profileStore;
  const {categoryList,loadCategories} = rootStore.categoryStore;
    const [isToggleVisible, setIsToggleVisible] = useState(false);
    const [loadingNext, setLoadingNext] = useState(false);

    const isTablet = useMediaQuery({ query: '(max-width: 768px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })

    const list = [
      'Hata olduğunu düşünüyorsanız site yöneticisiyle iletişime geçebilir,',
      'Talepte bulunmak için bize mail atabilir,',
      'Ya da bir eğitmen olarak başvurabilirsiniz'
    ]
    useEffect(() => {
      if(Array.from(popularProfileRegistery.values()).length === 0) // && userCityPlaced
      loadPopularProfiles();

      if(accessibilities.length === 0) 
        loadAccessibilities();
      if(categoryList.length===0)
         loadCategories();

       
    }, [])// && userCityPlaced
  
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
    

    
    const handleSortingChange = (e:any,data:any) => {
      setSortingInput(data.value);
      setLoadingNext(true);
      setPage(0);
      clearProfileRegistery();
      loadProfiles().then(() => setLoadingNext(false))
    }

    
    const handleGetNext = () => {
      debugger;
      setLoadingNext(true);
      setPage(page +1);
      if(sortingInput==="")
      {
        loadProfiles().finally(() => setLoadingNext(false))
      }
      else {
        loadProfiles().finally(() => setLoadingNext(false))
      }
    }




    return (
      <Fragment>
         <Container className="profileList_WelcomeMessage" style={{textAlign:"center"}}>
             <h2 style={{fontWeight:400, color:"#263a5e"}}>Kullanıcıların Tavsiye Ettikleri ve Çok Daha Fazlası</h2>
          </Container>
        {
          //  !isTablet &&
          <Segment inverted textAlign='center' vertical className='masthead_page'>
               <Container>
               <ProfileListFilters />
               </Container>
      </Segment>

        }
      
      {Array.from(popularProfileRegistery.values()).length === 0 && !loadingPopularProfiles && !loadingNext?
       <>
       <br></br>
        <Message style={{marginTop:"30px"}} header='Aradığınız kriterlere uygun bir uzman bulunamadı :(' list={list} />
      </> :
      <>
      <ProfileDashboardPopularProfiles />
      <Grid>
          <Grid.Column width={16} className="profileList_headerAndSorting">
          <div>
          <Label size='medium' style={{backgroundColor: "#263a5e", color:"#fff",fontSize: '16px'}}> Tümü ({profilePageCount}) </Label>
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
         page === 0 && loadingOnlyProfiles ? 
         <ProfileListItemsPlaceholder itemPerRow={isMobile ? twoItems : isTablet ? threeItem :5} /> :
          // <InfiniteScroll
          // pageStart={0}
          // loadMore={handleGetNext}
          // hasMore={!loadingNext && (page +1 < totalProfileListPages)}
          // initialLoad={false}>
            <>  
           <ProfileList />
        <div style={{display:"flex", justifyContent:"center"}}>
        <Button  
                  floated="right"
                  fluid={isMobile} 
                  size="large" disabled={loadingNext || (page +1 >= totalProfileListPages)} 
                  onClick={()=> handleGetNext()} 
                  style={{background:"dodgerblue", color:"white",margin:"20px 0"}}
                > Daha Fazla Göster </Button>
        </div>
          

                </>

          // </InfiniteScroll> 
          }
          {(loadingNext) ? <ProfileListItemsPlaceholder itemPerRow={isMobile ? twoItems : isTablet ? threeItem: 5}/> :""}
          <div className="scroll-to-top">
          {/* {isToggleVisible && 
            <Label style={{display:"flex", alignItems:"center"}} onClick={scrollToTop}>
              <Icon size="large" name="arrow up"/> 
              <span>Başa dön</span>
            </Label>} */}
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
