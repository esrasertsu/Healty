import { observer } from 'mobx-react-lite';
import React, { Fragment, useContext, useEffect,useState } from 'react'
import {Button, Container, Grid, Header, Icon, Image, Label, Message, Segment, Select, Sticky } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore';
import ProfileListFilters from './ProfileListFilters';
import { profileSortingOptions } from "../../app/common/options/profileSortingOptions";
import ProfileListItemsPlaceholder from './ProfileListItemsPlaceholder';
import ProfileList from './ProfileList';
import { SemanticWIDTHS } from 'semantic-ui-react/dist/commonjs/generic';
import { useMediaQuery } from 'react-responsive'
import ProfileDashboardPopularProfiles from './ProfileDashboardPopularProfiles';
import SearchArea from '../home/SearchArea';


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

 const ProfileDashboard= () => {

    const rootStore = useContext(RootStoreContext);
    const {loadingPopularProfiles,popularProfileRegistery
    ,loadPopularProfiles,loadProfiles,setPage,page,totalProfileListPages,
    profilePageCount, clearProfileRegistery,loadingOnlyProfiles,sortingInput,setSortingInput,loadAccessibilities,
  accessibilities} = rootStore.profileStore;
  const {categoryList,loadCategories} = rootStore.categoryStore;
  const {user} = rootStore.userStore;
  const {appLoaded} = rootStore.commonStore;
  var contextRef = React.createRef<any>();

    const [isToggleVisible, setIsToggleVisible] = useState(false);
    const [loadingNext, setLoadingNext] = useState(false);

    const isTablet = useMediaQuery({ query: '(max-width: 820px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })

  
    useEffect(() => {
      if(Array.from(popularProfileRegistery.values()).length === 0) // && userCityPlaced
      loadPopularProfiles();

      if(accessibilities.length === 0) 
        loadAccessibilities();
      if(categoryList.length===0)
         loadCategories();

       
    }, [])// && userCityPlaced
    useEffect(() => {
      loadPopularProfiles();

      if(accessibilities.length === 0) 
        loadAccessibilities();
      if(categoryList.length===0)
         loadCategories();

       
    }, [appLoaded])
    // Show button when page is scorlled upto given distance

    function getWindowDimensions() {
      const { innerWidth: width, innerHeight: height } = window;
      return {
        width,
        height
      };
    }

    // const toggleVisibility = () => {
    //   debugger;
    //   if (document.querySelector('body')!.pageYOffset > 100) {
    //     setIsToggleVisible(true);
    //   } else {
    //     setIsToggleVisible(false);
    //   }
    // };
  
    // useEffect(() => {
    //   document.querySelector('body')!.addEventListener("scroll", toggleVisibility);
      
    //   return () => {
    //     document.querySelector('body')!.removeEventListener("scroll", toggleVisibility);
    //   }
    // }, []);
    // Set the top cordinate to 0
    // make scrolling smooth
    // const scrollToTop = () => {
    //   document.querySelector('body')!.scrollTo(0,0)
  
    // };

    
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
         {/* <Segment textAlign='center' vertical className='masthead profileDashboard'>
               <Container text>
                   <Header as='h1' inverted style={{margin:"20px 0 20px 0"}}>
                       Dilediğin kategoride sağlıklı yaşam uzmanını ara
                   </Header>
                   <Fragment>
                        <SearchArea/>
                   </Fragment> 
               </Container>
           </Segment> */}
         <Container className="profileList_WelcomeMessage" style={{textAlign:"center"}}>
         <Header as='h1'  style={{fontSize: '34px',  textAlign:'center', width:"100%",color:"rgb(38, 58, 94)" }}>
                {/* Doğru uzmanı tam yerinde keşfet */}
                Kullanıcıların Tavsiye Ettikleri ve Çok Daha Fazlası
                </Header>
                <p style={{ fontSize: '1.3rem', color: "rgb(38, 58, 94)" }}>
                Spor koçundan diyetisyene, meditasyon eğitmeninden psikoloğa ihtiyacın olan uzmanı en kolay şekilde bulabileceğin yerdesin. 
                Üstelik uzmanlarla direk iletişime geçebilir, düzenledikleri aktivitelere katılabilir veya paylaştıkları blogları okuyarak ilgilendiğin alanda bilgi sahibi olabilirsin. 
                </p>

         </Container>
         <Container className="pageContainer">

         {  isMobile &&
                <Segment textAlign='center' vertical className='masthead_page profileDashboard'>
                  <Container>
                  <ProfileListFilters />
                  </Container>
                </Segment>
        }

           <div ref={contextRef}>
        {  !isMobile &&
            <Sticky context={contextRef}>
                <Segment textAlign='center' vertical className='masthead_page profileDashboard'>
                  <Container>
                  <ProfileListFilters />
                  </Container>
                </Segment>
              </Sticky>}
      
    
      {Array.from(popularProfileRegistery.values()).length === 0 && !loadingPopularProfiles && !loadingNext?
       <>
       <br></br>
       <div style={isMobile? {textAlign:"center", marginBottom:"40px"  } : {display:"flex", justifyContent:"center", alignItems:"center" }}>
        <div>
        <Header size="large" style={{color:"#263a5e"}} content="Hay aksi!"/>
        <Header size="medium" style={{color:"#263a5e"}} content="Şimdilik aradığın kriterlerde bir uzman bulamadık ama senin için hergün yüzlerce farklı uzmanla görüşüyor ve en iyilerini arıyoruz. Takipte kal"/>
          </div>
       <Image src={"/icons/academic.png"} style={isMobile? {width:"100%"} : {width:"50%"}} />
      </div>      </> :
      <>
      <ProfileDashboardPopularProfiles />
      <Grid>
        <Grid.Row style={{marginTop:"20px"}}>
          <Grid.Column width={16} className="profileList_headerAndSorting">
          <div>
          <Header size="medium" style={{color:"#263a5e"}}> Tümü ({profilePageCount})</Header>

          {/* <Label size='medium' style={{backgroundColor: "#263a5e", color:"#fff",fontSize: '17px'}}> Tümü ({profilePageCount}) </Label> */}
          </div>
          <div>
          <Select 
            value={sortingInput}
            onChange={handleSortingChange}
            placeholder= {"Sırala"}
            options={profileSortingOptions}
         />  </div>
          </Grid.Column>
          </Grid.Row>
          <Grid.Row style={{marginTop:"20px"}}>
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
           {/* <div className="scroll-to-top">
           {isToggleVisible && 
            <Label style={{display:"flex", alignItems:"center"}} onClick={scrollToTop}>
              <Icon size="large" name="arrow up"/> 
              <span>Başa dön</span>
            </Label>} 
        </div> */}
        <div style={{display:"flex", justifyContent:"center", marginTop:"20px"}}>
        <Button  
                  floated="right"
                  fluid={isMobile} 
                  size="large" disabled={loadingNext || (page +1 >= totalProfileListPages)} 
                  onClick={()=> handleGetNext()} 
                  style={{margin:"20px 0"}}
                  className='blue-gradientBtn'
                  circular
                > Daha Fazla Göster </Button>
        </div>
          

                </>

          // </InfiniteScroll> 
          }
          {(loadingNext) ? <ProfileListItemsPlaceholder itemPerRow={isMobile ? twoItems : isTablet ? threeItem: 5}/> :""}
         
          </Grid.Column>
          </Grid.Row>
      </Grid>
       
    
      <br></br>
      <br></br>
      </>
      }
      </div>
      </Container>
      </Fragment>
    )
}

export default observer(ProfileDashboard)
