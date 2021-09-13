import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Segment, Header, Form, Button,Comment, Icon } from 'semantic-ui-react'
import { RootStoreContext } from '../../../app/stores/rootStore'
import { Form as FinalForm, Field} from 'react-final-form';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { formatDistance } from 'date-fns';
import NumberInput from '../../../app/common/form/NumberInput';
import SelectInput from '../../../app/common/form/SelectInput';
import { IActivity } from '../../../app/models/activity';
import { OnChange } from 'react-final-form-listeners';
import tr  from 'date-fns/locale/tr'
import { format } from 'date-fns';


  interface IProps{
    url:string
  }

 const ActivityPaymentStarterPage:React.FC<IProps> = ({url}) =>  {

  const rootStore = useContext(RootStoreContext);



    return (

           <Fragment>
             {url && <div id="iyzipay-checkout-form" className="responsive"></div>
}
           </Fragment>
    )
}

export default observer(ActivityPaymentStarterPage);