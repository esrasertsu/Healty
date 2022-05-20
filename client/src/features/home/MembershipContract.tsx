import dompurify from 'dompurify';
import { observer } from 'mobx-react';
import React, { useContext, useEffect, useState } from 'react'
import { Container } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';

const KVKKContract = () => {

  const rootStore = useContext(RootStoreContext);
  const sanitizer = dompurify.sanitize;

  const {contract,loadContract} = rootStore.contractStore;

useEffect(() => {
  loadContract("Membership")
}, [])



  return (
    <Container className="pageContainer">
      { 
         <div dangerouslySetInnerHTML={{__html:sanitizer(contract)}} />
      }
    </Container>
  )
}

export default observer(KVKKContract);