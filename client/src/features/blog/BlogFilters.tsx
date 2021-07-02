import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Menu, Segment, Accordion, List, Placeholder, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../app/stores/rootStore';


const BlogFilters: React.FC = () => {

  const rootStore = useContext(RootStoreContext);
  const { setPredicate,predicate,clearPredicates, setClearedBeforeNewPredicateComing } = rootStore.blogStore; 
  const {
    allDetailedList,
    loadAllCategoryList,
    loadingAllDetailedList,
    getPredicateTexts,
 } = rootStore.categoryStore;

  const [activeIndex, setActiveIndex] = useState("")
  const [subActiveIndex, setSubActiveIndex] = useState("")

  const handleClick = (e:any, titleProps:any) => {
      
    const { index } = titleProps
    const newIndex = activeIndex === index ? "" : index

    if(activeIndex !== index)
    {  
        setClearedBeforeNewPredicateComing(true);
        clearPredicates("categoryId");
        clearPredicates("subCategoryIds");
        setClearedBeforeNewPredicateComing(false);
        setPredicate('categoryId', index);
        getPredicateTexts(predicate);
        setSubActiveIndex("");
    }
    setActiveIndex(newIndex);

  }

  useEffect(() => {
    loadAllCategoryList();
}, [loadAllCategoryList])

  return (
    <Fragment>
      {/* <Header icon={'calendar'} attached color={'teal'} content={'Select Date'} /> */}
      {/* <Calendar
      onChange={(date)=> {setPredicate('startDate', date!)}}
      value={predicate.get('startDate') || new Date()} /> */}
     {/* <BlogSearchArea className="BlogUserSearchArea" placeholder="Uzman" /> */}
     <br></br>
     <Segment className="blogFilter_Category_Filter">
      <h2>Kategoriler</h2>
    { loadingAllDetailedList ?  (
         <Placeholder className="blogFilterPlaceholder">
         <Placeholder.Line length='full' />
         <Placeholder.Line length='full' />
         <Placeholder.Line length='full' />
         <Placeholder.Line length='full' />
       </Placeholder>
    ) :(
        <List divided relaxed>
            {allDetailedList.map((item)=>(
              item.parentId === null &&
                <List.Item key={item.value} 
                className="blogFilter_ListItem"
                > 
                {/* <p>{item.text}</p> */}
                <Accordion key={item.value+ "_accordion"} as={Menu} vertical className="blogFilter_accordion">
                    <Accordion.Title
                        active={activeIndex === item.value}
                        content={item.text + " (" + item.blogCount +")"}
                        index={item.value}
                        onClick= {handleClick}
                    />
                    <Accordion.Content active={activeIndex === item.value} content={
                        // loadingAllDetailedList ? (
                        //     <Placeholder className="blogFilterPlaceholder">
                        //         <Placeholder.Line length='full' />
                        //         <Placeholder.Line length='full' />
                        //         <Placeholder.Line length='full' />
                        //     </Placeholder>
                        // ):
                         (allDetailedList.some(x => x.parentId === item.value) ?
                        <Menu vertical style={{ width: '100%'}}>
                        {/* <Header icon={'filter'} attached color={'teal'} content={'Filters'} />  size={'small'}*/}
                       {
                           allDetailedList.filter(x => x.parentId === item.value).map((subItem) =>(
                            <Menu.Item
                            key={subItem.value+ "_menuItem"}
                             className="blogFilter_menuItem"
                            active={subActiveIndex===subItem.value}
                            onClick= {() => {
                                if(subActiveIndex!==subItem.value)
                               {   var array: string[] = [];
                                   array.push(subItem.value);

                                   setClearedBeforeNewPredicateComing(true);
                                   clearPredicates("subCategoryIds");
                                   setClearedBeforeNewPredicateComing(false);

                                   setPredicate('subCategoryIds',array);
                                   getPredicateTexts(predicate);
                                   setSubActiveIndex(subItem.value);
                            }
                            }}
                            name={subItem.value} content={subItem.text+ " (" + subItem.blogCount +")"} />
                        ))
                       } 
                        </Menu>
                        : <Label>Alt kategorisi bulunmamaktadır.</Label>)
                    } />
                </Accordion>
                </List.Item>
            ))
            }
            
        </List>
    )
        
    }
     </Segment>
    </Fragment>
  );
}

export default observer(BlogFilters);
