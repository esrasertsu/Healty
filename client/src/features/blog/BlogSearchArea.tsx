import React, {  useContext, useState } from 'react'
import {  Search } from 'semantic-ui-react'
import { useStore } from '../../app/stores/rootStore'
import { observer } from 'mobx-react-lite';
import _ from 'lodash';

interface IProps{
    className: string;
    placeholder:string;
}

 const BlogSearchArea:React.FC<IProps> = ({className,placeholder}) => {

    const rootStore = useStore();

    const {
      profileList,
    } = rootStore.profileStore;

    const {
        setPredicate, predicate,setClearedBeforeNewPredicateComing,clearPredicates,predicateDisplayName,
        setPredicateDisplayName
      } = rootStore.blogStore;
  
    const [results, setResults] = useState([] as any);

    const [isSearchLoading, setSearchLoading] = useState(false);
    const [value, setvalue] = useState("")
  


    const handleResultSelect = (e:any, { result}:any) => {
        setvalue(result.displayName);
        setPredicateDisplayName(result.displayName);
        setClearedBeforeNewPredicateComing(true);
        clearPredicates("username");
        setClearedBeforeNewPredicateComing(false);
        setPredicate("username",result.userName);
    }
    const handleSearchChange = (e:any, { value }: any) => {
        if(value !=="")
         {
            setSearchLoading(true);
            setvalue(value);
        
            setTimeout(() => {  
              const re = new RegExp(_.escapeRegExp(value), 'i')
              const isMatch = (result:any) => re.test(result.displayName)
        
              setSearchLoading(false);
              setResults(_.filter(profileList, isMatch));
            }, 300)
         }
         else {
            setvalue(value);
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