import React,  { useEffect, useContext, useState, Fragment}  from 'react';
import { Accordion, Button, Card, Container, Grid, Header, Icon, Image, Label} from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../app/stores/rootStore';
import InfiniteScroll from 'react-infinite-scroller';
import BlogFilters from './BlogFilters';
import BlogMainPageItemsPlaceholder from './BlogMainPageItemsPlaceholder';
import BlogListItem from './BlogListItem';
import { IPredicate } from '../../app/models/category';
import { useMediaQuery } from 'react-responsive'



const BlogList: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {getBlogsByDate,loadBlogs, loadingPosts, setPage, page, totalPages,predicate,removeOnePredicate,removeSubCatPredicate
  ,predicateDisplayName} = rootStore.blogStore;
  const { predicateTexts} = rootStore.categoryStore;
  const [isToggleVisible, setIsToggleVisible] = useState(false);
  const [isAccOpen, setisAccOpen] = useState(false);

  const [loadingNext, setLoadingNext] = useState(false);
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 820px)' })
  const isMobile = useMediaQuery({ query: '(max-width: 450px)' })

  const handleGetNext = () => {
    setLoadingNext(true);
    setPage(page +1);
    loadBlogs().then(() => setLoadingNext(false))
  }
  useEffect(() => {
    loadBlogs();
  },[loadBlogs]); //[] provides the same functionality with componentDidMounth..   dependency array

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

  const handleAccClick = () =>{
    setisAccOpen(!isAccOpen);
}

  return (
    <Container className="pageContainer">

    <Grid className="blogPageGrid">
      <Grid.Row>
       
       {
         !isTabletOrMobile &&
         <Grid.Column width={4}>   
         <BlogFilters />
         </Grid.Column>
       }
     
      <Grid.Column width={isTabletOrMobile ? 16 : 12}>
      {isTabletOrMobile && 
         <Accordion styled className="dtPicker_accordion" style={{marginBottom:"15px"}}>
         <Accordion.Title
           active={isAccOpen}
           index={0}
           onClick={handleAccClick}
           style={{color:"#fff", fontWeight:500, padding:"10px 0"}}
         >
          <Icon /> Kategori  <Icon name='dropdown' />
         </Accordion.Title>
         <Accordion.Content style={{paddingTop:" 0"}} active={isAccOpen}>
         <BlogFilters setisAccOpen={setisAccOpen} />
         </Accordion.Content>
       </Accordion>
       }
      {
      loadingPosts && page === 0?
       <BlogMainPageItemsPlaceholder count={isTabletOrMobile? 1 :3} /> :
       <Fragment>
         { 
              <>
              {predicateTexts.map((predi:IPredicate)=>(
                <Button key={predi.key} labelPosition="right" icon='cancel' content={predi.value} style={{color:"#fff", marginBottom:"20px",borderRadius: "1.28571429rem"}}
                className={predi.parent==="Spor"? "blueButtonColor" :predi.parent==="Diyet"? "greenButtonColor": predi.parent==="Meditasyon"? "yellowButtonColor":predi.parent==="Psikoloji"? "pinkButtonColor": "defaultButtonColor"}
                onClick={()=>
                  {
                    if(predi.predicateName === "subCategoryIds") 
                      removeSubCatPredicate(predi.key);
                    else
                    removeOnePredicate(predi.predicateName);
                  }
                  
                  }></Button>
                ))}
             { predicate.has('username') && predicate.get('username') !== "" ?
              <>
              <Button circular key={predicate.get('username')} labelPosition="right" icon='cancel' content={predicateDisplayName} style={{backgroundColor:"#335084", color:"#fff", marginBottom:"20px"}}
                onClick={()=>
                  {
                    removeOnePredicate("username")
                  }
                  
                  }></Button>
              </>
             :""
       }

              <br/>
              </>
       }
       { predicate.has('username') && predicate.get('username') !== "" ?
              <>
              <h2 style={{color:"#335084"}} key={predicate.get("username")}>"{predicateDisplayName}" kullanıcısının paylaştığı bloglar:</h2>
              <br/>
              </>
             :""
       }
        {/* <InfiniteScroll
        pageStart={0}
        loadMore={handleGetNext}
        hasMore={!loadingNext && page +1 < totalPages}
        initialLoad={false}> */}
          {getBlogsByDate.length > 0 ?
          <>
          <Card.Group itemsPerRow={isTabletOrMobile ?1:3}>
              {
                getBlogsByDate.map((blog) => (
                  <BlogListItem key={blog!.id} blog={blog} />
                ))
              }
            </Card.Group>
              <div style={{display:"flex", justifyContent:"center"}}>
              <Button  
               floated="right"
               className='blue-gradientBtn'
               fluid={isMobile} 
               size="large" disabled={loadingNext || (page +1 >= totalPages)} 
               onClick={()=> handleGetNext()} 
               style={{margin:"20px 0"}}
               circular
             > Daha Fazla Göster </Button>
             </div>
               </>
            :
            <>
            {!isTabletOrMobile && <br></br> }
            <div style={isMobile? {textAlign:"center" , marginBottom:"40px"  } : {display:"flex", justifyContent:"center" }}>
              <div>
              <Header size="large" style={{color:"#263a5e"}} content="Merhaba!"/>
              <Header size="medium" style={{color:"#263a5e"}} content="Uzmanlarımız her gün bilgilendirici bloglar yazmaya devam ediyor. Takipte kal"/>
                </div>
             <Image src={"/icons/clip-computer-workstation.png"} style={isMobile? {width:"100%"} : {width:"60%"}} />
            </div>
           </>
}
           {/* </InfiniteScroll> */}
            <div className="scroll-to-top">
        {isToggleVisible && 
          <Label style={{display:"flex", alignItems:"center"}} onClick={scrollToTop}>
            <Icon size="large" name="arrow up"/> 
            <span>Başa dön</span>
          </Label>}
      </div>
          {loadingNext && <BlogMainPageItemsPlaceholder count={isTabletOrMobile?1 :3} />}

       </Fragment>
       
          }        
        </Grid.Column>
    </Grid.Row>
    </Grid>
    <br></br>
      <br></br>
    </Container>
  );
};

export default observer(BlogList)