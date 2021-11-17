import React, {  useContext, useEffect, useState } from 'react'
import {  Button, Container, Icon, Search } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore'
import { observer } from 'mobx-react-lite';
import _ from 'lodash';
import { IAllCategoryList } from '../../app/models/category';
import { history } from '../..';
import { useMediaQuery } from 'react-responsive'


 const SearchArea:React.FC = () => {

    const rootStore = useContext(RootStoreContext);

    const {
      loadAllCategoryList,
      loadCategories,
      allDetailedList,
      loadSubCategories,
      loadingAllDetailedList
    } = rootStore.categoryStore;
    const {userCity} = rootStore.commonStore;
    const {setProfileFilterForm,profileFilterForm,clearPopularProfileRegistery,clearProfileRegistery, setPage
    ,setNavSearchValue,loadPopularProfiles, profileSearchAreaValue, setprofileSearchAreaValue} = rootStore.profileStore;

    const [results, setResults] = useState<IAllCategoryList[]>([]);
    const [result, setResult] = useState<IAllCategoryList>();


    const [isSearchLoading, setSearchLoading] = useState(false);
    
    const isMobile = useMediaQuery({ query: '(max-width: 500px)' })

    useEffect(() => {
      if(allDetailedList.length === 0)
      loadAllCategoryList();
    },[loadAllCategoryList]); 


    const handleResultSelect = (e:any, { result}:any) => {
      setprofileSearchAreaValue(result.text);
        setResult(result);
    }
    const handleSearchChange = (e:any, { value }: any) => {
      setSearchLoading(true);
      setprofileSearchAreaValue(value);
  
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
                        value={profileSearchAreaValue}
                        resultRenderer={resultRenderer}
                        className="SearchArea"
                        placeholder={loadingAllDetailedList ? "Yükleniyor..." : isMobile ? "Kategori ismi girin" :"Arama yapmak istediğin kategori.." }
                        noResultsMessage="Aradığınız kategori bulunamadı"
                />
                      <Button size={isMobile ? 'tiny': 'big'} primary circular onClick={() => {
                           setPage(0);
                           if(result && result.parentId === null)
                              {
                                loadCategories();
                                loadSubCategories(result.key);
                                setProfileFilterForm({...profileFilterForm, categoryId:result.key, cityId: userCity, subCategoryIds: []});
                              }
                              else 
                              { 
                                result && loadSubCategories(result.parentId!);
                                result && setProfileFilterForm({...profileFilterForm,cityId: userCity, categoryId:result.parentId!, subCategoryIds:[result.key]});
                              }
                              clearPopularProfileRegistery();
                              clearProfileRegistery();
                              setNavSearchValue("");
                             
                            loadPopularProfiles();
                        }}>
                      <Icon name='search' inverted></Icon> Ara
                   </Button>
    </Container>
    );
}

export default observer(SearchArea);