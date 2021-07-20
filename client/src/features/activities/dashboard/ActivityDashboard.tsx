import React,  { useEffect, useContext, useState}  from 'react';
import { Button, Container, Grid, Icon, Label, Loader, Menu, Radio, Segment, Sidebar } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';
import InfiniteScroll from 'react-infinite-scroller';
import ActivityFilters from './ActivityFilters';
import ActivityListItemPlaceholder from './ActivityListItemPlaceHolder';
import { useMediaQuery } from 'react-responsive'
import { DateTimePicker } from 'react-widgets';
import { IActivitySelectedFilter } from '../../../app/models/activity';

const ActivityDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {loadActivities, loadingInitial, setPage, page, totalPages,loadLevels,predicate,setPredicate
  ,setClearPredicateBeforeSearch,clearKeyPredicate,subCategoryIds,setSubCategoryIds,
  categoryIds, setCategoryIds, setLevelIds,
  levelIds, cityId, setCityId, isOnline, setIsOnline} = rootStore.activityStore;


  const { loadCategories } = rootStore.categoryStore;
  const [loadingNext, setLoadingNext] = useState(false);
  const [isToggleVisible, setIsToggleVisible] = useState(false);
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' })
  const [visible, setVisible] = useState(false);
  const [activitySelectedFilters, setActivitySelectedFilters] = useState<IActivitySelectedFilter[]>([]);

  const handleGetNext = () => {
    setLoadingNext(true);
    setPage(page +1);
    loadActivities().then(() => setLoadingNext(false))
  }
  useEffect(() => {
    loadActivities();
    loadCategories();
    loadLevels();
  },[loadActivities,loadCategories,loadLevels]); //[] provides the same functionality with componentDidMounth..   dependency array

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
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
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
        setLevelIds([]);
        clearKeyPredicate("isHost");
      }else if(value === "isGoing")
      {
        setLevelIds([]);
        clearKeyPredicate("isGoing");
      }else if(value === "isFollowed")
      {
        setLevelIds([]);
        clearKeyPredicate("isFollowed");
      }

      
      //gerçek predicate'ların temizlenmesi if else ile 5 tane key'i kontrol edip gereken predicate'ı kaldır
  }
  return (
    <>
   
        {!isTabletOrMobile ?
<>
         <Grid>
         <Grid.Row>
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
              <InfiniteScroll
              pageStart={0}
              loadMore={handleGetNext}
              hasMore={!loadingNext && page +1 < totalPages}
              initialLoad={false}>
                <ActivityList />
              </InfiniteScroll>
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
           </>
         :
         <>
          <Segment className="dtPicker_Container_Style">
          <p>Aktivite aradığınız tarih/saat aralığını giriniz.</p>
          <DateTimePicker
            value={predicate.get('startDate') || new Date()}
            onChange={(date)=> {
              setClearPredicateBeforeSearch(true); 
              clearKeyPredicate("startDate");
              setClearPredicateBeforeSearch(false); 
              setPredicate('startDate', date!)
            }}
            onKeyDown={(e) => e.preventDefault()}
            date = {true}
            time = {true}
            containerClassName="dtPicker_Style"
          />
          <br/>
          <DateTimePicker
            value={predicate.get('endDate') || null}
            onChange={(date)=> {
              setClearPredicateBeforeSearch(true); 
              clearKeyPredicate("endDate");
              setClearPredicateBeforeSearch(false); 
              setPredicate('endDate', date!)}}
            onKeyDown={(e) => e.preventDefault()}
            date = {true}
            time = {true}
            containerClassName="dtPicker_Style"
          />
          </Segment>
          
          <div className="activityDashboard_mobile_filterdiv">
          <Button basic color="grey" onClick={() => setVisible(!visible)}>Filtreler <Icon style={{marginLeft:"5px"}} name="sliders horizontal" /></Button>
            <div>
            <div className="mobileRadioToggle">
              <div>Online </div> 
              <Radio checked={isOnline} toggle={true} onChange={handleOnlineChange} disabled={loadingInitial} style={{marginLeft:"10px"}}/> </div>
              </div>
          </div>
       
          { activitySelectedFilters.map((value:IActivitySelectedFilter) =>(
            <Label className="selectedFilterLabel" key={value.key}>{value.text} 
            <Icon style={{opacity:1}} name="delete" onClick={(e:any) => handleDeleteFilterSelection(e,value.key, value.value)}></Icon>
            </Label>

          ))}
        
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
              <InfiniteScroll
              pageStart={0}
              loadMore={handleGetNext}
              hasMore={!loadingNext && page +1 < totalPages}
              initialLoad={false}>
                <ActivityList />
              </InfiniteScroll>
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
      
      
     
     
    </>
  );
};

export default observer(ActivityDashboard)