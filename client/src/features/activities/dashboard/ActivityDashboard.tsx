import React,  { useEffect, useContext, useState}  from 'react';
import { Accordion, Button, Container, Grid, Icon, Label, Loader, Radio, Segment, Sidebar } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';
import InfiniteScroll from 'react-infinite-scroller';
import ActivityFilters from './ActivityFilters';
import ActivityListItemPlaceholder from './ActivityListItemPlaceHolder';
import { useMediaQuery } from 'react-responsive'
import { DateTimePicker } from 'react-widgets';
import { IActivitySelectedFilter } from '../../../app/models/activity';
import { format } from 'date-fns';
import tr  from 'date-fns/locale/tr'

const ActivityDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {loadActivities, loadingInitial, setPage, page, totalPages,loadLevels,predicate,setPredicate
  ,setClearPredicateBeforeSearch,clearKeyPredicate,subCategoryIds,setSubCategoryIds,
  categoryIds, setCategoryIds, setLevelIds,levelList,
   setCityId, isOnline, setIsOnline, activityRegistery,activitySelectedFilters, setActivitySelectedFilters,
  setActiveUserPreIndex, selectedStartDate, selectedEndDate, setSelectedStartDate, setSelectedEndDate,clearActivityRegistery} = rootStore.activityStore;


  const { loadCategories,categoryRegistery } = rootStore.categoryStore;

  const { cities,appLoaded } = rootStore.commonStore;

  const [loadingNext, setLoadingNext] = useState(false);
  const [isToggleVisible, setIsToggleVisible] = useState(false);
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 820px)' })
  const isMobile = useMediaQuery({ query: '(max-width: 450px)' })

  const [visible, setVisible] = useState(false);
  const [isAccOpen, setisAccOpen] = useState(false);

  const handleGetNext = () => {
    setLoadingNext(true);
    setPage(page +1);
    loadActivities().then(() => setLoadingNext(false))
  }
  useEffect(() => {
    
    if(activityRegistery.size <= 1)
    {
      loadActivities();
    }
    if(categoryRegistery.size <= 1)
    {
      loadCategories();
    }
    if(levelList.length <=1)
    {
      loadLevels();
    }
  },[activityRegistery.size,categoryRegistery.size,levelList,loadActivities,loadCategories,loadLevels]); //[] provides the same functionality with componentDidMounth..   dependency array

  useEffect(() => {

    loadActivities();
    loadCategories();
    loadLevels();
     
  }, [appLoaded])
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    }
  }, []);

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
    document.querySelector('body')!.scrollTo(0,0)
  };

  const handleOnlineChange = (e:any, data:any) => {
    setClearPredicateBeforeSearch(true); 
    clearKeyPredicate("isOnline");
    setClearPredicateBeforeSearch(false);

    if(data.checked)
    {
      setIsOnline(true);
      setPredicate("isOnline",true);
    }
    else 
    {
      setIsOnline(false);
      setPredicate("isOnline",false);
    }
      setVisible(false);
    
  }

  const handleDeleteFilterSelection = (e:any,key:string, value:string) =>{
      e.preventDefault();
      const deletedUserPreds = activitySelectedFilters.filter(x => x.key !== key);
      setActivitySelectedFilters([...deletedUserPreds]);

      if(value === "categoryId")
      {
        setCategoryIds(categoryIds.filter(x => x !== key));
        setPredicate("categoryIds", categoryIds);
      }else if(value === "subCatId" && key==="subCatId")
      {
        setSubCategoryIds([]);
        setPredicate("subCategoryIds",[]);
      }else if(value === "subCatId")
      {
        setSubCategoryIds(subCategoryIds.filter(x => x !== key));
        setPredicate("subCategoryIds", subCategoryIds);
      }else if(value === "cityId")
      {
         setCityId("");
         clearKeyPredicate("cityId");
      }else if(value === "level")
      {
        setLevelIds([]);
        clearKeyPredicate("levelIds");
      }else if(value === "isHost")
      {
        setActiveUserPreIndex(0); 
        clearKeyPredicate("isHost");
      }else if(value === "isGoing")
      {
        setActiveUserPreIndex(0); 
        clearKeyPredicate("isGoing");
      }else if(value === "isFollowed")
      {
        setActiveUserPreIndex(0); 
        clearKeyPredicate("isFollowed");
      }

      
      //gerçek predicate'ların temizlenmesi if else ile 5 tane key'i kontrol edip gereken predicate'ı kaldır
  }

  const handleAccClick = () =>{
      setisAccOpen(!isAccOpen);
  }
  return (
    <Container className="pageContainer">
        {!isTabletOrMobile ?
<>
         <Grid style={{paddingTop:"10px"}}>
         <Grid.Row >
         <Grid.Column width={4}>
         {/* <Button
                           onClick={() => history.push('/activitysearch')}
                           floated="right"
                           style={{backgroundColor:"#00b5ad", color:"white"}}
                           >Map View&nbsp;&nbsp;<Icon name="map marker alternate"/> </Button>
                           <br></br>                   */}
                           <br></br> 
   
         <ActivityFilters setActivitySelectedFilters={setActivitySelectedFilters} activitySelectedFilters={activitySelectedFilters}/>
         </Grid.Column> 
         <Grid.Column width={12}>
              {loadingInitial && page === 0 ? <ActivityListItemPlaceholder/> :
              (
              // <InfiniteScroll
              // pageStart={0}
              // loadMore={handleGetNext}
              // hasMore={!loadingNext && page +1 < totalPages}
              // initialLoad={false}>
              <>
                <ActivityList />
                {activityRegistery.size > 0 && 
                <div style={{display:"flex", justifyContent:"center"}}>
                 <Button  
                  floated="right"
                 className='orangeBtn'
                  fluid={isMobile} 
                  size="large" disabled={loadingNext || (page +1 >= totalPages)} 
                  onClick={()=> handleGetNext()} 
                  style={{margin:"20px 0"}}
                  circular
                > Daha Fazla Göster </Button>
                </div>
                }
                </>
              // </InfiniteScroll>
              )}
              {(loadingNext) ? <ActivityListItemPlaceholder /> :""}

              <div className="scroll-to-top">
              {isToggleVisible && 
              <Label style={{display:"flex", alignItems:"center"}} onClick={scrollToTop}>
                <Icon size="large" name="arrow up"/> 
                <span>Başa dön</span>
              </Label>}
              </div>
              </Grid.Column>
              <Grid.Column width={4}>
              </Grid.Column>
              <Grid.Column width={12}>
              <br></br>
              <br></br>
              </Grid.Column>
           </Grid.Row>
           </Grid>
           </>
         :
         <>
          <Segment className="dtPicker_Container_Style_mobile">
          <Accordion styled className="dtPicker_accordion">
          <Accordion.Title
            active={isAccOpen}
            index={0}
            onClick={handleAccClick}
            style={{color:"#fff", fontWeight:500}}
          >
           <Icon name='calendar alternate outline' /> 
            {(predicate.get('startDate') || predicate.get('endDate')) ? 
            <span style={{color:"#6aeb6a"}}>Tarih saat aralığı seçili <Icon name="check circle outline" /> </span>
           : "Tarih/saat aralığı"}  <Icon name='dropdown' />
          </Accordion.Title>
          <Accordion.Content active={isAccOpen}>
          <DateTimePicker
            value={predicate.get('startDate') || new Date()}
            onChange={(date)=> {
              setSelectedStartDate(date)
              setClearPredicateBeforeSearch(true); 
              clearKeyPredicate("startDate");
              setClearPredicateBeforeSearch(false); 
              setPredicate('startDate', date!)
            }}
            onKeyDown={(e) => e.preventDefault()}
            date = {true}
            time = {true}
            containerClassName="dtPicker_Style"
            culture="tr"
          />
          <br/>
          <DateTimePicker
            value={predicate.get('endDate')}
            onChange={(date)=> {
              setSelectedEndDate(date)
              setClearPredicateBeforeSearch(true); 
              clearKeyPredicate("endDate");
              setClearPredicateBeforeSearch(false); 
              setPredicate('endDate', date!)}}
            onKeyDown={(e) => e.preventDefault()}
            date = {true}
            time = {true}
            containerClassName="dtPicker_Style secondDtPicker"
            culture="tr"
          />

      <Button 
       inverted 
       content="Temizle" 
       circular
       fluid
       size='small'
       style={{marginTop:"15px"}}
       onClick={() =>{
        clearKeyPredicate("startDate");
        clearKeyPredicate("endDate");
        setPage(0);
        clearActivityRegistery();
        loadActivities();
        scrollToTop();
       }}
       />
          </Accordion.Content>
        </Accordion>
         
          </Segment>
          
          <div className="activityDashboard_mobile_filterdiv">
          <Button basic color="grey" onClick={() => setVisible(!visible)} circular>Filtreler <Icon style={{marginLeft:"5px"}} name="sliders horizontal" /></Button>
            <div>
            <div className="mobileRadioToggle">
              <div>Online </div> 
              <Radio checked={isOnline} toggle={true} onChange={handleOnlineChange} disabled={loadingInitial} style={{marginLeft:"10px"}}/> </div>
              </div>
          </div>
       
          { activitySelectedFilters.map((value:IActivitySelectedFilter) =>(
            
            <Label className="selectedFilterLabel" key={value.key}>{ value.value === "cityId" ? cities.filter(x => x.key === value.key)[0].text : value.text} 
            <Icon style={{opacity:1}} name="delete" onClick={(e:any) => handleDeleteFilterSelection(e,value.key, value.value)}></Icon>
            </Label>

          ))
          }
         
        
              <Sidebar.Pushable key="activityPushable" style={{ overflow: 'hidden' }}>
              <Sidebar
               key="activityPushable_sidebar"
                     as={Segment}
                      animation={"push"}
                      direction={"top"}
                      visible={visible}
                  >
                <ActivityFilters setVisibleMobileFilterBar={setVisible} setActivitySelectedFilters={setActivitySelectedFilters} activitySelectedFilters={activitySelectedFilters} />

              </Sidebar>

              <Sidebar.Pusher dimmed={visible}  key="actiityPusher">
              <Grid className="activityListGrid">
              <Grid.Row>
              <Grid.Column width={16}>
              {loadingInitial && page === 0 ? <ActivityListItemPlaceholder/> :
              (
              // <InfiniteScroll
              // pageStart={0}
              // loadMore={handleGetNext}
              // hasMore={!loadingNext && page +1 < totalPages}
              // initialLoad={false}>
              <>
                <ActivityList />
                {activityRegistery.size > 0 && 
                <div style={{display:"flex", justifyContent:"center"}}>
                <Button  
                   className='orangeBtn'
                  floated="right"
                 fluid={isMobile} 
                 size="large" disabled={loadingNext || (page +1 >= totalPages)} 
                 onClick={()=> handleGetNext()} 
                 style={{margin:"20px 0"}}
                 circular
               > Daha Fazla Göster </Button>
               </div>
                }
                
               </>
             // </InfiniteScroll>
              )}
              <div className="scroll-to-top">
              {isToggleVisible && 
              <Label style={{display:"flex", alignItems:"center"}} onClick={scrollToTop}>
                <Icon size="large" name="arrow up"/> 
                <span>Başa dön</span>
              </Label>}
              </div>
              </Grid.Column>
              <Grid.Column width={4}>
              </Grid.Column>
              <Grid.Column width={12}>
              <br></br>
              <br></br>
              <Loader active={loadingNext} />
              </Grid.Column>
              </Grid.Row>
              </Grid>
              </Sidebar.Pusher>
              </Sidebar.Pushable>
              </>
          }
      
      
     
     
      </Container>
  );
};

export default observer(ActivityDashboard)