import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { RootStoreContext } from '../../app/stores/rootStore';

import { SemanticWIDTHS } from 'semantic-ui-react/dist/commonjs/generic';
import { useMediaQuery } from 'react-responsive'


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

interface IProps{
    setLoadingNext: (loadingNext:boolean) => void;
    loadingNext:boolean;
}

 const ProfileDashboardOnlyProfiles: React.FC<IProps> = ({setLoadingNext,loadingNext}) => {

    const rootStore = useContext(RootStoreContext);
    const {loadProfiles,setPage,page,totalProfileListPages,
     profilePageCount, clearProfileRegistery,loadingOnlyProfiles,sortingInput,setSortingInput} = rootStore.profileStore;

      
  const isTablet = useMediaQuery({ query: '(max-width: 820px)' })
  const isMobile = useMediaQuery({ query: '(max-width: 450px)' })


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
          
    <>
    
      </>
    )
}

export default observer(ProfileDashboardOnlyProfiles)
