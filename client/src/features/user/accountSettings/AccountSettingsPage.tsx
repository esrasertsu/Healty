import React, { Fragment, useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite';
import { useMediaQuery } from 'react-responsive'
import { RootStoreContext } from '../../../app/stores/rootStore';
import { LoadingComponent } from '../../../app/layout/LoadingComponent';
import { IAccountInfoValues } from '../../../app/models/user';
import ProfileSettings from './ProfileSettings';
import ContactSettings from './ContactSettings';
import SecuritySettings from './SecuritySettings';


 const AccountSettingsPage: React.FC = () => {

  const rootStore = useContext(RootStoreContext);
  const {
    cities
  } = rootStore.commonStore;
  const {
    getAccountDetails, user, loadingUserInfo,editAccountDetails,accountForm,setAccountForm
  } = rootStore.userStore;

  const [loading, setLoading] = useState(false);

useEffect(() => {
    getAccountDetails();
}, [getAccountDetails])

 if(loading || loadingUserInfo) return <LoadingComponent content='Loading...'/>  

    return (
 <Fragment>
   <ProfileSettings />
   <ContactSettings />
   <SecuritySettings />
 </Fragment>
    )
}

export default observer(AccountSettingsPage);