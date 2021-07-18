import React, {  useContext, useEffect, useState } from 'react'
import {  Search } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore'
import { observer } from 'mobx-react-lite';
import _ from 'lodash';
import { history } from '../../index'


 const NavSearchArea = () => {

    const rootStore = useContext(RootStoreContext);
    const {setProfileFilterForm,profileFilterForm,clearProfileRegistery, setPage,loadProfiles} = rootStore.profileStore;

    const {
      loadAllCategoryList,
      allDetailedList,
      loadSubCategories
    } = rootStore.categoryStore;
  
    const [results, setResults] = useState([] as any);
    const [value, setValue] = useState('');

    const [isSearchLoading, setSearchLoading] = useState(false);
    
    
    useEffect(() => {
      loadAllCategoryList();
    },[loadAllCategoryList]); 


    const handleResultSelect = (e:any, { result}:any) => {
        setValue(result.text);
        setPage(0);
        if(result && result.parentId === null)
        {
          setProfileFilterForm({...profileFilterForm, categoryId:result.key,subCategoryIds:[]});
        }
        else 
        { 
          result && loadSubCategories(result.parentId!);
          result && setProfileFilterForm({...profileFilterForm, categoryId:result.parentId!, subCategoryIds:[result.key]});
        }
    
            if(history.location.pathname !== "/profiles")
               history.push('/profiles');
            else loadProfiles();
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
        <Search
                        fluid
                        loading={isSearchLoading}
                        onResultSelect={handleResultSelect}
                        onSearchChange={_.debounce(handleSearchChange, 500, {
                          leading: true,
                        })}
                        results={results}
                        value={value}
                        resultRenderer={resultRenderer}
                        className="nav_SearchArea"
                        placeholder="Kategori ara" 
                        noResultsMessage="Aradığınız kategori bulunamadı"
                />
                     
    );
}

export default observer(NavSearchArea);