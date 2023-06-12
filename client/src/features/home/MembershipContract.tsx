import dompurify from 'dompurify';
import { observer } from 'mobx-react';
import React, { useContext, useEffect, useState } from 'react'
import { Container } from 'semantic-ui-react';
import { useStore } from '../../app/stores/rootStore';

const Membership = () => {

  const rootStore = useStore();
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

export default observer(Membership);