import React, { useContext, useEffect, useState } from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import queryString from 'query-string';
import { Button, Header, Icon, Item, Segment } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { observer } from 'mobx-react-lite';
import { useMediaQuery } from 'react-responsive';
import { format } from 'date-fns';
import tr  from 'date-fns/locale/tr'
import { IRefundPayment } from '../../app/models/activity';

interface IProps{
    RefundSuccess: IRefundPayment;
}


const RefundSuccess : React.FC<IProps> = ({RefundSuccess}) =>{

    return(
        <>
        <Segment placeholder>
           
            {RefundSuccess.status ==="success" ?
            <>
             <Header icon>
             <Icon color="green" name="check" />
         </Header>

         <Segment.Inline>
                <div className="center">
                    <p>Rezervasyon iptal işleminiz başarıyla gerçekleşti.</p>
                    <p>İade edilecek tutar : {RefundSuccess.price}TL</p>
                </div> 
                </Segment.Inline>
                </>
        : <>
                <Header icon>
                <Icon color="red" name="delete" />
            </Header>

            <Segment.Inline>
                <div className="center">
                <p>Rezervasyon iptal işleminiz başarısız.</p>
                <p>{RefundSuccess.errorMessage}</p>
            </div>
            </Segment.Inline>
            </>
            }
            </Segment>

        
        </>
    )
};

export default observer(RefundSuccess);

