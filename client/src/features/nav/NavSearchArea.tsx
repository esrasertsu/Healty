import React, {  useContext, useEffect, useState } from 'react'
import {  Button, Container, Icon, Search } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore'
import { observer } from 'mobx-react-lite';
import _ from 'lodash';
import { Link } from 'react-router-dom';


 const NavSearchArea:React.FC = () => {

    const rootStore = useContext(RootStoreContext);

    const {
      loadAllCategoryList,
      allDetailedList
    } = rootStore.categoryStore;
  
    const [loadingNext, setLoadingNext] = useState(false);
    const [results, setResults] = useState([] as any);
    const [value, setValue] = useState('');

    const [isSearchLoading, setSearchLoading] = useState(false);
    
    
    useEffect(() => {
      loadAllCategoryList();
    },[loadAllCategoryList]); 


    const handleResultSelect = (e:any, { result}:any) => {
        setValue(result.text);
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
                />
                     
    );
}

export default observer(NavSearchArea);