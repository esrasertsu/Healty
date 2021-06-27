import React, { FormEvent, Fragment, useContext, useEffect, useState } from 'react';
import { Menu, Header, Segment, Accordion, Form, CheckboxProps, Button, Loader, Label, Icon, Radio } from 'semantic-ui-react';
import { Calendar, DateTimePicker} from 'react-widgets';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { ICategory, ISubCategory } from '../../../app/models/category';

const ActivityFilters = () => {

  const rootStore = useContext(RootStoreContext);
  const { predicate, setPredicate,setClearPredicateBeforeSearch,clearUserPredicates,
    clearKeyPredicate, setPage, clearActivityRegistery,loadActivities,
    activeIndex, setActiveIndex,categoryIds, setCategoryIds,subCategoryIds, setSubCategoryIds,
    activeUserPreIndex, setActiveUserPreIndex} = rootStore.activityStore; 
  const {
     categoryList,
     loadingCategories,
     allCategoriesOptionList
      } = rootStore.categoryStore;

      const {isLoggedIn} = rootStore.userStore;
  

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
      setPredicate("isOnline","true");
    else 
      setPredicate("isOnline","false");

    
  }


  const handleCatagorySelection = (event: FormEvent<HTMLInputElement>, data: CheckboxProps) => {
    debugger;
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
    
debugger;
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
  const handleCategorySubmit = () =>{
    debugger;

    setClearPredicateBeforeSearch(true); 
    clearKeyPredicate("categoryIds");
    clearKeyPredicate("subCategoryIds");
    
    if(subCategoryIds.length===0 && categoryIds.length==0)
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

    scrollToTop();

  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };


  return (
    <Fragment>
      {/* <Header icon={'calendar'} attached color={'teal'} content={'Select Date'} /> */}
      {/* <Calendar
      onChange={(date)=> {setPredicate('startDate', date!)}}
      value={predicate.get('startDate') || new Date()} /> */}
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
          setPredicate('isFollowed', 'true')}}
         name={'follow'} content={"Takip Ettiğim Eğitmenlerin"} />
      </Menu>}

      <Accordion key={"Category_acc"} as={Menu} vertical style={{ width: '100%', boxShadow:'none', border:'none'}}>
        <Menu.Item  key={"Category"} className="filterMenuItem_Style">
          <Accordion.Title
            active={activeIndex === 0}
            content={(categoryIds.length + subCategoryIds.length > 0) ? 'Kategori (' + (subCategoryIds.length + categoryIds.length) +" kriter seçili)": "Kategori" }
            index={0}
            onClick={handleClick}
          />
          <Accordion.Content active={activeIndex === 0}>
                <Form onSubmit={handleCategorySubmit}>
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
                            positive
                            type="submit"
                            content="Ara"
                            style={{marginRight:"10px"}}
                          />
               <Button
                          // loading={submitting}
                          // disabled={loading || buttonDisabled}
                          //  floated="right"
                            negative
                            content="Temizle"
                            style={{marginRight:"10px"}}
                            onClick={() =>{
                              setCategoryIds([]);
                              setSubCategoryIds([]);
                            }
                            }
                          />
              </Form>
          </Accordion.Content> 
        </Menu.Item>

        <Menu.Item key={"Level"} className="filterMenuItem_Style">
          <Accordion.Title
            active={activeIndex === 1}
            content='Seviye'
            index={1}
            onClick={handleClick}
          />
          <Accordion.Content active={activeIndex === 1}>
                <Form onSubmit={handleCategorySubmit}>
                <Form.Group grouped>
                  {
                    allCategoriesOptionList.filter(x => categoryIds.findIndex(y => y === x.parentId) >-1 ).map((category:ICategory) => 
                    <Form.Checkbox key={category.value} label={category.text} name={category.value} value={category.value} onChange={handleSubCatagorySelection}/>
                    )
                  }
                </Form.Group>
                <Button
                          // loading={submitting}
                          // disabled={loading || buttonDisabled}
                          //  floated="right"
                            positive
                            type="submit"
                            content="Ara"
                            style={{marginRight:"10px"}}
                            onClick={() => {
                            
                            }}
                          />
              </Form>
          </Accordion.Content> 
        </Menu.Item>
        <Menu.Item>
         <div className="toggleMenuItem"><div>Online katılım</div> <Radio checked={predicate.get("isOnline")|| false} toggle={true} onChange={handleOnlineChange} /> </div>
        </Menu.Item>
        <Menu.Item>
        <Button
                          // loading={submitting}
                          // disabled={loading || buttonDisabled}
                          //  floated="right"
                            negative
                            content="Temizle"
                            style={{marginRight:"10px"}}
                            onClick={() =>{
                              setCategoryIds([]);
                              setSubCategoryIds([]);
                              clearUserPredicates();
                              clearKeyPredicate("subCategoryIds");
                              clearKeyPredicate("categoryIds");
                              clearKeyPredicate("isOnline");
                              clearKeyPredicate("startDate");
                              clearKeyPredicate("endDate");
                              setActiveUserPreIndex(0);
                              setPage(0);
                              clearActivityRegistery();
                              loadActivities();
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
