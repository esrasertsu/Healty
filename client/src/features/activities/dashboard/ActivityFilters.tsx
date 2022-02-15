import React, { FormEvent, Fragment, useContext, useState } from 'react';
import { Menu, Segment, Accordion, Form, CheckboxProps, Button, Label, Icon, Radio, Dropdown } from 'semantic-ui-react';
import { DateTimePicker} from 'react-widgets';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { ICategory, ISubCategory } from '../../../app/models/category';
import { ILevel,IActivitySelectedFilter } from '../../../app/models/activity';
import { useMediaQuery } from 'react-responsive';
interface IProps{
  setVisibleMobileFilterBar?:(visible:boolean) => void ;
  setActivitySelectedFilters:(selectedFilters:IActivitySelectedFilter[]) => void ;
  activitySelectedFilters: IActivitySelectedFilter[];
}

const ActivityFilters:React.FC<IProps> = ({setVisibleMobileFilterBar,setActivitySelectedFilters,activitySelectedFilters}) => {
  
  const rootStore = useContext(RootStoreContext);
  const { predicate, setPredicate,setClearPredicateBeforeSearch,clearUserPredicates,
    clearKeyPredicate, setPage, clearActivityRegistery,loadActivities,loadingInitial,
    activeIndex, setActiveIndex,categoryIds, setCategoryIds,subCategoryIds, setSubCategoryIds,
    activeUserPreIndex, setActiveUserPreIndex, levelList, setLevelIds,
    levelIds, cityId, setCityId, isOnline, setIsOnline} = rootStore.activityStore; 
  const {
     categoryList,
     loadingCategories,
     allCategoriesOptionList
      } = rootStore.categoryStore;

      const { cities } = rootStore.commonStore;
      const {isLoggedIn} = rootStore.userStore;
      const isTabletOrMobile = useMediaQuery({ query: '(max-width: 820px)' })
     const [cityName, setcityName] = useState("")


    
   
     
  const handleClick = (e:any, titleProps:any) => {
    const { index } = titleProps
    const newIndex = activeIndex === index ? -1 : index
    setActiveIndex(newIndex);
  }

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
    setVisibleMobileFilterBar && setVisibleMobileFilterBar(false);
      scrollToTop();
    
  }

  const handleLevelChange = (event: FormEvent<HTMLInputElement>, data: CheckboxProps) => {
    if(data.checked)
    {
     setLevelIds([...levelIds, data.value as string]);
    }else {
      const index =  levelIds.findIndex(x => x === data.value as string)
      setLevelIds([...levelIds.slice(0,index), ...levelIds.slice(index+1)]);
    }
  }


  const handleCatagorySelection = (event: FormEvent<HTMLInputElement>, data: CheckboxProps) => {
   if(data.checked)
   {
    setCategoryIds([...categoryIds, data.value as string]);
   }
    else
    {
     const index =  categoryIds.findIndex(x => x === data.value as string)
     setCategoryIds([...categoryIds.slice(0,index), ...categoryIds.slice(index+1)]);

     const deletedCategorySubs = allCategoriesOptionList.filter(x => x.parentId === data.value && subCategoryIds.includes(x.key));
     
     const updatedSubIds = subCategoryIds.filter(x => deletedCategorySubs.findIndex(y => y.key === x) < 0)
     setSubCategoryIds(updatedSubIds);
    }
  }

  
  const handleSubCatagorySelection = (event: FormEvent<HTMLInputElement>, data: CheckboxProps) => {

   if(data.checked)
   {
    setSubCategoryIds([...subCategoryIds, data.value as string])
   }
    else
    {
     const index =  subCategoryIds.findIndex(x => x === data.value as string)
     setSubCategoryIds([...subCategoryIds.slice(0,index), ...subCategoryIds.slice(index+1)]);
    }
  }
 



  const handleLevelSubmit = () => {
    setClearPredicateBeforeSearch(true); 
    clearKeyPredicate("levelIds");
    setClearPredicateBeforeSearch(false);
    setPredicate("levelIds",levelIds);
   
    setVisibleMobileFilterBar && setVisibleMobileFilterBar(false);

    scrollToTop();

  }

  const handleCitySubmit = (e:any, data:any) => {
    setClearPredicateBeforeSearch(true); 
    clearKeyPredicate("cityId");
    setClearPredicateBeforeSearch(false);
    setPredicate("cityId",cityId);
    setVisibleMobileFilterBar && setVisibleMobileFilterBar(false);

    scrollToTop();
  }

  const handleCityChange =  (e:any, data:any) => {
    debugger;

    if(data.value==="")
    {
      setcityName("");
      clearKeyPredicate("cityId");
    }else {
      const name = cities.filter(x => x.key === data.value)[0].text;
      setCityId(data.value);
      setcityName(name);
    }
     
  }

  const scrollToTop = () => {
    document.querySelector('body')!.scrollTo(0,0)

  };

  const handleSearch = (e:any, data:any) => {
    setActivitySelectedFilters([]);
    setClearPredicateBeforeSearch(true); 
    clearKeyPredicate("subCategoryIds");
    clearKeyPredicate("categoryIds");
    clearKeyPredicate("levelIds");
    clearKeyPredicate("cityId");

    setPredicate("cityId",cityId);
    setPredicate("levelIds",levelIds);

    const activitySelectedFilterList: IActivitySelectedFilter[] = [];

    cityId !== "" &&  activitySelectedFilterList.push({key:cityId,value:"cityId", text:cityName});
    levelIds.length > 0 &&   activitySelectedFilterList.push({key:"level",value:"level", text:levelIds.length + " seviye seçili"}) 

    categoryIds.forEach(categoryId => {
      const catName= categoryList.filter(x => x.value === categoryId)[0].text;
      activitySelectedFilterList.push({key:categoryId,value:"categoryId", text:catName}) 
    });

    subCategoryIds.length > 2 &&  activitySelectedFilterList.push({key:"subCatId",value:"subCatId", text:subCategoryIds.length + " branş seçili"}) 

    if(subCategoryIds.length >0 && subCategoryIds.length <3)
    {
    subCategoryIds.forEach(subId => {
      const catName= allCategoriesOptionList.filter(x => x.value === subId)[0].text;
      activitySelectedFilterList.push({key:subId, value:"subCatId", text:catName}) 
     });
    }

    if(predicate.get("isHost") === "true")
    activitySelectedFilterList.push({key:"isHost",value:"isHost", text:"Düzenlediklerim"}) 
    else if(predicate.get("isGoing") === "true")
    activitySelectedFilterList.push({key:"isGoing",value:"isGoing", text:"Gidiyorum"}) 
    else if(predicate.get("isFollowed") === "true")
    activitySelectedFilterList.push({key:"isFollowed",value:"isFollowed", text:"Fovori Eğitmenlerim"}) 

    setActivitySelectedFilters([...activitySelectedFilterList])


    if(subCategoryIds.length===0 && categoryIds.length===0)
    {
      setClearPredicateBeforeSearch(false); 
      setPage(0);
      clearActivityRegistery();
      loadActivities();
    } else if(categoryIds.length>0 && subCategoryIds.length===0)
    {
      setClearPredicateBeforeSearch(false); 
      setPredicate("categoryIds",categoryIds);
    }
    else if(categoryIds.length>0 && subCategoryIds.length>0)
    {
      setPredicate("categoryIds",categoryIds);
      setClearPredicateBeforeSearch(false);
      setPredicate("subCategoryIds",subCategoryIds);
    }


    setVisibleMobileFilterBar && setVisibleMobileFilterBar(false);

    scrollToTop();

  }

  const handleCloseBanner = () =>{
    document.getElementById("activityFilter_Banner")!.style.display = "none";
  }

  return (
    <Fragment>
      {/* <Header icon={'calendar'} attached color={'teal'} content={'Select Date'} /> */}
      {/* <Calendar
      onChange={(date)=> {setPredicate('startDate', date!)}}
      value={predicate.get('startDate') || new Date()} /> */}
      {!isTabletOrMobile && 
       <Segment className="dtPicker_Container_Style">
       <div style={{marginBottom:"1em", fontSize:"16px",lineHeight:"20px"}}>Aktivite aradığınız tarih/saat aralığını giriniz.</div>
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
         culture="tr"
       />
       <br/>
       <DateTimePicker
         value={predicate.get('endDate')}
         onChange={(date)=> {
           setClearPredicateBeforeSearch(true); 
           clearKeyPredicate("endDate");
           setClearPredicateBeforeSearch(false); 
           setPredicate('endDate', date!)}}
         onKeyDown={(e) => e.preventDefault()}
         date = {true}
         time = {true}
         containerClassName="dtPicker_Style"
         culture="tr"
     
       />
       <Button 
       circular
       inverted 
       fluid
       size='mini'
       content="Temizle" 
       style={{marginTop:"15px"}}
       onClick={() =>{
        clearKeyPredicate("startDate");
        clearKeyPredicate("endDate");
        setPage(0);
        clearActivityRegistery();
        loadActivities();
        setVisibleMobileFilterBar && setVisibleMobileFilterBar(false);
        scrollToTop();
       }}
       />
      </Segment>
      }

{!isTabletOrMobile && 

<Segment id="activityFilter_Banner" className="activityFilter_Banner"
 style={{textAlign:"center"}}>
   <Icon style={{marginTop:"-15px", position:"absolute", width:"85%"}} name="cancel" onClick={handleCloseBanner} />
   <div style={{fontSize: "30px"}}>
     <Icon name="calendar times outline" />
   </div>
   <p style={{fontSize: "18px"}}>
     <div>Planlarınız mı değişti?</div>
     <div>24 saat öncesine kadar yapılan iptal işlemlerinde %100 para iadesi</div></p>
</Segment>
}
    
   {  isLoggedIn &&
     <Menu vertical style={{ width: '100%'}}>
        {/* <Header icon={'filter'} attached color={'teal'} content={'Filters'} />  size={'small'}*/}
        <Menu.Item
        className="activity_userPredicate_MenuItem"
        key={"all"}
         active={activeUserPreIndex === 0}
         onClick= {() => { 
           setActiveUserPreIndex(0); 
           setClearPredicateBeforeSearch(true); 
           clearUserPredicates();
           setClearPredicateBeforeSearch(false); 
           const deletedUserPreds = activitySelectedFilters.filter(x => x.value !== "isGoing" && x.value !== "isHost" && x.value !== "isFollowed");
           setActivitySelectedFilters([...deletedUserPreds]);
           setVisibleMobileFilterBar && setVisibleMobileFilterBar(false);
           setPredicate('all', 'true')}}
          name={'all'} content={'Hepsi'} />
        <Menu.Item
        className="activity_userPredicate_MenuItem"
        key={"isGoing"}
        active = {activeUserPreIndex === 1}
        onClick= {() => {  
          setActiveUserPreIndex(1);
          setClearPredicateBeforeSearch(true); 
          clearUserPredicates();
          setClearPredicateBeforeSearch(false);  
          const deletedUserPreds = activitySelectedFilters.filter(x => x.value !== "isGoing" && x.value !== "isHost" && x.value !== "isFollowed");
          deletedUserPreds.push({key:"isGoing",value:"isGoing", text:"Gidiyorum"});
          setActivitySelectedFilters([...deletedUserPreds]);
          setVisibleMobileFilterBar && setVisibleMobileFilterBar(false);
          setPredicate('isGoing', 'true')}}
         name={'username'} content={"Gidiyorum"} />
        <Menu.Item
        className="activity_userPredicate_MenuItem"
        key={"isHost"}
        active = {activeUserPreIndex === 2}
        onClick= {() => {  
          setActiveUserPreIndex(2); 
          setClearPredicateBeforeSearch(true); 
          clearUserPredicates();
          setClearPredicateBeforeSearch(false); 
          const deletedUserPreds = activitySelectedFilters.filter(x => x.value !== "isGoing" && x.value !== "isHost" && x.value !== "isFollowed");
          deletedUserPreds.push({key:"isHost",value:"isHost", text:"Düzenlediklerim"});
          setActivitySelectedFilters([...deletedUserPreds]);

          setVisibleMobileFilterBar && setVisibleMobileFilterBar(false);
          setPredicate('isHost', 'true')}}//clear etmek gerekiyor
         name={'host'} content={"Düzenlediklerim"} />
         <Menu.Item
         key={"isFollowed"}
        active = {activeUserPreIndex === 3}
        className="activity_userPredicate_MenuItem"
        onClick= {() => { 
          setActiveUserPreIndex(3);
          setClearPredicateBeforeSearch(true); 
          clearUserPredicates();
          setClearPredicateBeforeSearch(false);
          const deletedUserPreds = activitySelectedFilters.filter(x => x.value !== "isGoing" && x.value !== "isHost" && x.value !== "isFollowed");
          deletedUserPreds.push({key:"isFollowed",value:"isFollowed", text:"Fovori Eğitmenlerim"});
          setActivitySelectedFilters([...deletedUserPreds]);

          setVisibleMobileFilterBar && setVisibleMobileFilterBar(false);
          setPredicate('isFollowed', 'true')}}
         name={'follow'} content={"Fovori Eğitmenlerim"} />
      </Menu>}

      <Accordion className="activityAccMenu" key={"Category_acc"} as={Menu} vertical style={{ width: '100%'}}>
     {!isTabletOrMobile && 
      <Menu.Item>
      <div className="toggleMenuItem"><div>Online katılım</div> 
      <Radio checked={isOnline} toggle={true} onChange={handleOnlineChange} disabled={loadingInitial} /> </div>
     </Menu.Item>
     }
       <Menu.Item  key={"Category"} className="filterMenuItem_Style">
          <Accordion.Title
            active={activeIndex === 0}
            content={(categoryIds.length + subCategoryIds.length > 0) ? 'Kategori (' + (subCategoryIds.length + categoryIds.length) +" kriter seçili)": "Kategori" }
            index={0}
            onClick={handleClick}
          />
          <Accordion.Content active={activeIndex === 0}>
                <Form>
                <Form.Group grouped>
                  {
                    loadingCategories ? <Label color="blue" basic><Icon name='circle notched' loading />Yükleniyor..</Label>:
                    categoryList.map((category:ICategory) => 
                    <Accordion key={category.key} vertical="true" style={{ width: '100%', boxShadow:'none', border:'none', margin:"0"}}>
                      <Accordion.Title
                        className="accordion_category_title"
                        active={categoryIds.findIndex(x => x === category.key)>-1}
                        content={
                          <Form.Checkbox key={category.text}
                          checked={categoryIds.findIndex(x => x === category.key)>-1}
                          label={category.text} name={category.value} value={category.value} onChange={handleCatagorySelection}/>
                        }
                        index={category.key}
                      />
                      <Accordion.Content active={categoryIds.findIndex(x => x === category.key)>-1}>
                        <Segment>
                        {
                           allCategoriesOptionList.filter(x => x.parentId ===category.key).map((subCategory:ISubCategory) => 
                           <Form.Checkbox
                           className="accordion_subcategory_title" 
                           key={subCategory.value}
                           checked={categoryIds.findIndex(x => x === category.key)>-1 && 
                            subCategoryIds.findIndex(x => x === subCategory.key)>-1} label={subCategory.text} name={subCategory.value} value={subCategory.value} onChange={handleSubCatagorySelection}/>
                           )
                        }

                        </Segment>
                      </Accordion.Content>
                    </Accordion>
                    )
                  }
                   
                </Form.Group>
              
               <Button
                          // loading={submitting}
                          // disabled={loading || buttonDisabled}
                          //  floated="right"
                            negative
                            content="Temizle"
                            style={{marginRight:"10px"}}
                            circular
                            size='mini'
                            onClick={() =>{
                              setCategoryIds([]);
                              setSubCategoryIds([]);
                              setClearPredicateBeforeSearch(true); 
                              clearKeyPredicate("subCategoryIds");
                              setClearPredicateBeforeSearch(false); 
                              clearKeyPredicate("categoryIds");
                              const deletedCatAndSubCats = activitySelectedFilters.filter(x => x.value !== "categoryId" && x.value !== "subCatId");
                              setActivitySelectedFilters([...deletedCatAndSubCats]);
                   
                              setVisibleMobileFilterBar && setVisibleMobileFilterBar(false);

                              scrollToTop();                            
                              
                            }
                            }
                          />
              </Form>
          </Accordion.Content> 
        </Menu.Item>

        <Menu.Item key={"Level"} className="filterMenuItem_Style">
          <Accordion.Title
            active={activeIndex === 1}
            content={(levelIds.length > 0) ? 'Seviye (' + (levelIds.length) +" seviye seçili)": "Seviye" }
            index={1}
            onClick={handleClick}
          />
          <Accordion.Content active={activeIndex === 1}>
                <Form onSubmit={handleLevelSubmit}>
                <Form.Group grouped>
                  {
                    levelList.map((level:ILevel) => 
                    <Form.Checkbox className="accordion_subcategory_title"
                     key={level.value} 
                     label={level.text} 
                     name={level.value} 
                     value={level.value} 
                     checked={levelIds.findIndex(x => x === level.key)>-1}
                     onChange={handleLevelChange}/>
                    )
                  }
                </Form.Group>
               
              </Form>
          </Accordion.Content> 
        </Menu.Item>
        <Menu.Item key={"City"} className="filterMenuItem_Style">
          <Accordion.Title
            active={activeIndex === 2}
            content={cityId !=="" ? "Şehir (1 adet seçili)": "Şehir" }
            index={2}
            onClick={handleClick}
          />
          <Accordion.Content active={activeIndex === 2}>
                <Form onSubmit={handleCitySubmit}>
                 <Form.Field>
                  <Dropdown 
                      deburr
                      value={cityId}
                      onChange={handleCityChange}
                      placeholder='Şehir'
                      options={cities}
                      search selection
                      clearable={true}
                      fluid
                  />
                  </Form.Field>
              </Form>
          </Accordion.Content> 
        </Menu.Item>
        <Menu.Item>
        <Button
                          // loading={submitting}
                          // disabled={loading || buttonDisabled}
                          //  floated="right"
                            type="submit"
                            content="Ara"
                            circular
                            size='small'
                            fluid
                            className='green-gradientBtn'
                            onClick={handleSearch}
                            disabled={loadingInitial}
                          />
        <Button
                          // loading={submitting}
                          // disabled={loading || buttonDisabled}
                          //  floated="right"
                            basic
                            primary
                            circular
                            size='mini'
                            fluid
                            style={{marginTop:"10px"}}
                            content="Tüm Filtreleri Kaldır"
                            disabled={loadingInitial}
                            onClick={() =>{
                              setCategoryIds([]);
                              setSubCategoryIds([]);
                              setIsOnline(false);
                              setCityId("");
                              setLevelIds([]);
                              clearUserPredicates();
                              clearKeyPredicate("subCategoryIds");
                              clearKeyPredicate("categoryIds");
                              clearKeyPredicate("isOnline");
                              clearKeyPredicate("startDate");
                              clearKeyPredicate("endDate");
                              clearKeyPredicate("levelIds");
                              clearKeyPredicate("cityId");
                              setActivitySelectedFilters([]);
                              setActiveUserPreIndex(0);
                              setPage(0);
                              clearActivityRegistery();
                              loadActivities();
                              setVisibleMobileFilterBar && setVisibleMobileFilterBar(false);
                              scrollToTop();
                            }
                            }
                          />
        </Menu.Item>
       
       
        {/* <Menu.Item className="filterMenuItem_Style">
          <Accordion.Title
            active={activeIndex === 2}
            content='Online'
            index={2}
            onClick={handleClick}
          />
          <Accordion.Content active={activeIndex === 2} content={ColorForm} />
        </Menu.Item> */}
      </Accordion>
       
    </Fragment>
  );
}

export default observer(ActivityFilters);
