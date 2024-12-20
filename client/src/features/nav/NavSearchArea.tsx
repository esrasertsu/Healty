import React, {  useContext, useEffect, useState } from 'react'
import {  Search } from 'semantic-ui-react'
import { useStore } from '../../app/stores/rootStore'
import { observer } from 'mobx-react-lite';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';


 const NavSearchArea = () => {
  const history = useHistory();
    const rootStore = useStore();
    const {setProfileFilterForm,profileFilterForm,clearPopularProfileRegistery,clearProfileRegistery,
      navSearchValue, setNavSearchValue, setPage,loadPopularProfiles,setprofileSearchAreaValue} = rootStore.profileStore;

    const {
      loadAllCategoryList,
      loadCategories,
      allDetailedList,
      loadSubCategories
    } = rootStore.categoryStore;
  
    const [results, setResults] = useState([] as any);

    const [isSearchLoading, setSearchLoading] = useState(false);
    
    
    useEffect(() => {
      if(allDetailedList.length === 0)
      loadAllCategoryList();
    },[loadAllCategoryList]); 


    const handleResultSelect = (e:any, { result}:any) => {
      setNavSearchValue(result.text);
      setprofileSearchAreaValue("");

        setPage(0);
        if(result && result.parentId === null)
        {
          loadCategories();
          loadSubCategories(result.key);
          setProfileFilterForm({...profileFilterForm, categoryId:result.key,subCategoryIds:[]});
        }
        else 
        { 
          result && loadSubCategories(result.parentId!);
          result && setProfileFilterForm({...profileFilterForm, categoryId:result.parentId!, subCategoryIds:[result.key]});
        }
        clearPopularProfileRegistery();
        clearProfileRegistery();
            if(history.location.pathname !== "/profiles")
               history.push('/profiles');
            else loadPopularProfiles();
    }

    const handleSearchChange = (e:any, { value }: any) => {
      setSearchLoading(true);
      setNavSearchValue(value);
  
      setTimeout(() => {  
        const re = new RegExp(_.escapeRegExp(value), 'i')
        const isMatch = (result:any) => re.test(result.text)
  
        setSearchLoading(false);
        setResults(_.filter(allDetailedList, isMatch));
      }, 300)
    }
   
    const resultRenderer = ({ text }:any) => <span>{text}</span>

    return (
        <Search
                        fluid
                        loading={isSearchLoading}
                        onResultSelect={handleResultSelect}
                        onSearchChange={_.debounce(handleSearchChange, 500, {
                          leading: true,
                        })}
                        results={results}
                        value={navSearchValue}
                        resultRenderer={resultRenderer}
                        className="nav_SearchArea"
                        placeholder="Uzman Kategorisi..." 
                        noResultsMessage="Aradığınız kategori bulunamadı"
                />
                     
    );
}

export default observer(NavSearchArea);