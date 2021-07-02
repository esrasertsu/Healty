import React, {  useContext, useEffect, useState } from 'react'
import {  Button, Container, Icon, Search } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore'
import { observer } from 'mobx-react-lite';
import _ from 'lodash';
import { IAllCategoryList } from '../../app/models/category';
import { history } from '../..';


 const SearchArea:React.FC = () => {

    const rootStore = useContext(RootStoreContext);

    const {
      loadAllCategoryList,
      loadCategories,
      allDetailedList,
      loadSubCategories,
    } = rootStore.categoryStore;
    const {userCity} = rootStore.commonStore;
    const {setProfileFilterForm,profileFilterForm,clearProfileRegistery, setPage} = rootStore.profileStore;

    const [results, setResults] = useState<IAllCategoryList[]>([]);
    const [value, setValue] = useState('');
    const [result, setResult] = useState<IAllCategoryList>();


    const [isSearchLoading, setSearchLoading] = useState(false);
    
    
    useEffect(() => {
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
                        loading={isSearchLoading}
                        onResultSelect={handleResultSelect}
                        onSearchChange={_.debounce(handleSearchChange, 500, {
                          leading: true,
                        })}
                        results={results}
                        value={value}
                        resultRenderer={resultRenderer}
                        className="SearchArea"
                        placeholder="Arama yapmak istediğin kategori.." 
                />
                      <Button size='big' primary circular onClick={() => {
                           setPage(0);
                           if(result && result.parentId === null)
                              {
                                loadCategories();
                                setProfileFilterForm({...profileFilterForm, categoryId:result.key, cityId: userCity});
                              }
                              else 
                              { 
                                result && loadSubCategories(result.parentId!);
                                result && setProfileFilterForm({...profileFilterForm,cityId: userCity, categoryId:result.parentId!, subCategoryIds:[result.key]});
                              }
                          clearProfileRegistery();
                          history.push("/profiles");
                        }}>
                      <Icon name='search' inverted></Icon> Ara
                   </Button>
    </Container>
    );
}

export default observer(SearchArea);