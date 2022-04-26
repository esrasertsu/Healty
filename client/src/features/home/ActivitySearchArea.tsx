import React, {  useContext, useEffect, useState } from 'react'
import {  Button, Container, Icon, Search } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore'
import { observer } from 'mobx-react-lite';
import _ from 'lodash';
import { IAllCategoryList } from '../../app/models/category';
import { history } from '../..';
import { useMediaQuery } from 'react-responsive'


 const ActivitySearchArea:React.FC = () => {

    const rootStore = useContext(RootStoreContext);

    const {
      loadAllCategoryList,
      loadCategories,
      allDetailedList,
      loadSubCategories,
      loadingAllDetailedList
    } = rootStore.categoryStore;
    const {userCity} = rootStore.commonStore;
    const {loadActivities,setPage,setPredicate,setClearPredicateBeforeSearch,clearKeyPredicate,setCategoryIds,categoryIds
      ,setSubCategoryIds,subCategoryIds} = rootStore.activityStore;

    const [results, setResults] = useState<IAllCategoryList[]>([]);
    const [value, setValue] = useState('');
    const [result, setResult] = useState<IAllCategoryList>();


    const [isSearchLoading, setSearchLoading] = useState(false);
    
    const isMobile = useMediaQuery({ query: '(max-width: 500px)' })

    useEffect(() => {
      if(allDetailedList.length === 0)
      loadAllCategoryList();
    },[loadAllCategoryList]); 


    const handleResultSelect = (e:any, { result}:any) => {
        setValue(result.text);
        setResult(result);
    }
    const handleSearchChange = (e:any, { value }: any) => {
      setSearchLoading(true);
      setValue(value);
  
      setTimeout(() => {  
        const re = new RegExp(_.escapeRegExp(value), 'i')
        const isMatch = (result:any) => re.test(result.text)
  
        setSearchLoading(false);
        setResults(_.filter(allDetailedList, isMatch));
      }, 300)
    }
   
    const resultRenderer = ({ text }:any) => <span>{text}</span>

    return (
       <Container className='homePage-button_Container'>
        <Search
                        fluid
                        loading={isSearchLoading }
                        onResultSelect={handleResultSelect}
                        onSearchChange={_.debounce(handleSearchChange, 500, {
                          leading: true,
                        })}
                        results={results}
                        value={value}
                        resultRenderer={resultRenderer}
                        className="SearchArea"
                        placeholder={loadingAllDetailedList ? "Yükleniyor..." : isMobile ? "Kategori ismi girin" :"Arama yapmak istediğin kategori.." }
                        noResultsMessage="Aradığınız kategori bulunamadı"
                />
                      <Button size={isMobile ? 'tiny': 'big'}  color="blue" circular onClick={() => {
                           setClearPredicateBeforeSearch(true); 
                           setPage(0);
                           clearKeyPredicate("subCategoryIds");
                           clearKeyPredicate("categoryIds");
                           if(result && result.parentId === null)
                              {
                                setClearPredicateBeforeSearch(false);
                                setPredicate("categoryIds",[result.key]);
                                setCategoryIds([...categoryIds, result.key]);


                              }
                              else if(result)
                              { 
                                setPredicate("categoryIds",[result.key]);
                                setClearPredicateBeforeSearch(false);
                                setPredicate("subCategoryIds",[result.parentId!]);
                                setCategoryIds([...categoryIds, result.key]);
                                setSubCategoryIds([...subCategoryIds, result.parentId!])

                              }

                              history.push('/activities');
                             
                        }}>
                      <Icon name='search' inverted></Icon> Ara
                   </Button>
    </Container>
    );
}

export default observer(ActivitySearchArea);