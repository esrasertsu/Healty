import React, {  useContext, useEffect, useState } from 'react'
import {  Search } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore'
import { observer } from 'mobx-react-lite';
import _ from 'lodash';

interface IProps{
    className: string;
    placeholder:string;
}

 const BlogSearchArea:React.FC<IProps> = ({className,placeholder}) => {

    const rootStore = useContext(RootStoreContext);

    const {
      loadProfiles,
      profileList
    } = rootStore.profileStore;

    const {
        setPredicate, predicate
      } = rootStore.blogStore;
  
    const [results, setResults] = useState([] as any);
    const [value, setValue] = useState('');

    const [isSearchLoading, setSearchLoading] = useState(false);
    
    
    useEffect(() => {
        loadProfiles();
    },[loadProfiles]); 


    const handleResultSelect = (e:any, { result}:any) => {
        setValue(result.displayName);
        setPredicate("username",result.displayName);
    }
    const handleSearchChange = (e:any, { value }: any) => {
        if(value !=="")
         {
            setSearchLoading(true);
            setValue(value);
        
            setTimeout(() => {  
              const re = new RegExp(_.escapeRegExp(value), 'i')
              const isMatch = (result:any) => re.test(result.displayName)
        
              setSearchLoading(false);
              setResults(_.filter(profileList, isMatch));
            }, 300)
         }else {
            setValue(value);
            setPredicate('all', 'true');
        }

        
    
    }
   
    const resultRenderer = ({ displayName }:any) => <span>{displayName}</span>

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
                        className={className}
                        placeholder={placeholder}
                        
                      />
    );
}

export default observer(BlogSearchArea);