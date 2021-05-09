import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Menu, Header, Segment, Accordion, List, Placeholder, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../app/stores/rootStore';


const BlogFilters: React.FC = () => {

  const rootStore = useContext(RootStoreContext);
  const { predicate, setPredicate } = rootStore.blogStore; 
  const {
    categoryList,
    subcategoryList,
    loadingCategories,
    loadingSubCategories,
    loadCategories,
    loadSubCategories
 } = rootStore.categoryStore;

  const [activeIndex, setActiveIndex] = useState("")
  const [subActiveIndex, setSubActiveIndex] = useState("")

  const handleClick = (e:any, titleProps:any) => {
      debugger;
    const { index } = titleProps
    const newIndex = activeIndex === index ? "" : index

    if(activeIndex !== index)
    {
        setPredicate('categoryId', index);
        loadSubCategories(index);
        setSubActiveIndex("");
    }
    setActiveIndex(newIndex);

  }

  useEffect(() => {
    loadCategories();
}, [loadCategories])

  return (
    <Fragment>
      {/* <Header icon={'calendar'} attached color={'teal'} content={'Select Date'} /> */}
      {/* <Calendar
      onChange={(date)=> {setPredicate('startDate', date!)}}
      value={predicate.get('startDate') || new Date()} /> */}
     <Segment className="blogFilter_Category_Filter">
      <h2>Kategoriler</h2>
    { loadingCategories ?  (
         <Placeholder className="blogFilterPlaceholder">
         <Placeholder.Line length='full' />
         <Placeholder.Line length='full' />
         <Placeholder.Line length='full' />
         <Placeholder.Line length='full' />
       </Placeholder>
    ) :(
        <List divided relaxed>
            {categoryList.map((item)=>(
                <List.Item key={item.value} 
                className="blogFilter_ListItem"
                > 
                {/* <p>{item.text}</p> */}
                <Accordion key={item.value+ "_accordion"} as={Menu} vertical className="blogFilter_accordion">
                    <Accordion.Title
                        active={activeIndex === item.value}
                        content={item.text}
                        index={item.value}
                        onClick= {handleClick}
                    />
                    <Accordion.Content active={activeIndex === item.value} content={
                        loadingSubCategories ? (
                            <Placeholder className="blogFilterPlaceholder">
                                <Placeholder.Line length='full' />
                                <Placeholder.Line length='full' />
                                <Placeholder.Line length='full' />
                            </Placeholder>
                        ): (subcategoryList.length > 0 ?
                        <Menu vertical style={{ width: '100%'}}>
                        {/* <Header icon={'filter'} attached color={'teal'} content={'Filters'} />  size={'small'}*/}
                       {
                           subcategoryList.map((subItem) =>(
                            <Menu.Item
                            key={subItem.value+ "_menuItem"}
                             className="blogFilter_menuItem"
                            active={subActiveIndex===subItem.value}
                            onClick= {() => {
                                if(subActiveIndex!==subItem.value)
                               {   
                                   setPredicate('subCategoryId',subItem.value);
                                   setSubActiveIndex(subItem.value);
                            }
                            }}
                            name={subItem.value} content={subItem.text} />
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


// JSX ORNEK
// const ActivityFilters = () => (
//   <Fragment>
//     <Menu vertical size={'large'} style={{ width: '100%', marginTop: 30 }}>
//       <Header icon={'filter'} attached color={'teal'} content={'Filters'} />
//       <Menu.Item color={'blue'} name={'all'} content={'All Activities'} />
//       <Menu.Item color={'blue'} name={'username'} content={"I'm Going"} />
//       <Menu.Item color={'blue'} name={'host'} content={"I'm hosting"} />
//     </Menu>
//     <Header icon={'calendar'} attached color={'teal'} content={'Select Date'} />
//     <Calendar />
//   </Fragment>
// );

// export default ActivityFilters;