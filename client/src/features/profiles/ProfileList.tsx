import { observer } from 'mobx-react-lite';
import React, { Fragment, useContext, useEffect,useState } from 'react'
import { Card, Container, Grid, Header, Segment, Select } from 'semantic-ui-react'
import { LoadingComponent } from '../../app/layout/LoadingComponent';
import { RootStoreContext } from '../../app/stores/rootStore';
import ProfileListItem from './ProfileListItem'
import ProfileListFilters from './ProfileListFilters';
import { category } from "../../app/common/options/categoryOptions";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
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

 const ProfileList: React.FC = () => {

    const rootStore = useContext(RootStoreContext);
    const {loadingProfiles, loadProfiles, profileList} = rootStore.profileStore;
    const [sortingInput, setSortingInput] = useState("drinks");
    useEffect(() => {
        loadProfiles();
    }, [loadProfiles])


    const handleSortingChange = (e:any,data:any) => {
      setSortingInput(data.value);
    }
    if(loadingProfiles) 
    return <LoadingComponent content='Loading profiles...' />

    return (
      <Fragment>
      <Segment inverted textAlign='center' vertical className='masthead_page'>
               {/* <Header as='h2' inverted content={`Welcome back ${user.displayName}`} /> */}
               <Container className='masthead-button_Container'>
               <ProfileListFilters />
               </Container>
      </Segment>
               {/* <Header as='h2' inverted content={`Welcome back ${user.displayName}`} /> */}
       <Header style={{ fontSize: '18px', marginTop:"30px" }}>
        En popüler 10
        </Header>
        <Grid stackable>
          <Grid.Column width={16}>
             {/* <Card.Group itemsPerRow={5} stackable>  */}
            <Carousel
            // arrows={false} 
            // renderButtonGroupOutside={true}
            partialVisible={true}
            swipeable={true}
            draggable={true}
            showDots={false}
            responsive={responsive}
            ssr={true} // means to render carousel on server-side.
            infinite={false}
            autoPlay={false}
            autoPlaySpeed={5000}
            keyBoardControl={true}
         //   customTransition="all .4"
            transitionDuration={2000}
            containerClass="profileList_carousel-container"
           // removeArrowOnDeviceType={["tablet", "mobile"]}
           // deviceType={this.props.deviceType}
           // dotListClass="custom-dot-list-style"
             itemClass="carousel-item-padding-10-px"
           >
                {profileList.map((profile) => (
                    <ProfileListItem key={profile.userName} profile={profile} />
                ))}
            </Carousel>
            {/* </Card.Group>  */}
          </Grid.Column>
          <Grid.Column width={16} className="profileList_headerAndSorting">
          <div>
          <Header style={{ fontSize: '18px', marginTop:"30px" }}>
          Tümü ({profileList.length})
          </Header>
          </div>
          <div>
          <Select 
            value={sortingInput}
            onChange={handleSortingChange}
            placeholder={"Önerilen sıralama"}
            options={category}
         />  </div>
          </Grid.Column>
         <Grid.Column width={16}>
          <Card.Group itemsPerRow={6} stackable className="allProfileCards">
              {profileList.map((profile) => (
                   <ProfileListItem key={profile.userName} profile={profile} />
              ))}
          </Card.Group>
          </Grid.Column>
      </Grid>
      </Fragment>
    )
}

export default observer(ProfileList)
