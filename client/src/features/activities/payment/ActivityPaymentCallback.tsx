import React, { useContext, useEffect, useState } from 'react';
import {RouteComponentProps} from 'react-router-dom';
import queryString from 'query-string';
import { Button, Header, Icon, Image, Modal, Segment } from 'semantic-ui-react';
import agent from '../../../app/api/agent';
import { toast } from 'react-toastify';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { useMediaQuery } from 'react-responsive'
import { observer } from 'mobx-react-lite';
import { LoadingComponent } from '../../../app/layout/LoadingComponent';
import { history } from '../../..';

interface DetailParams{
    status:string,
    paymentId:string,
    conversationData:string,
    conversationId:string,
    mdStatus:string



}


const ActivityPaymentCallback : React.FC<RouteComponentProps<DetailParams>> = ({location,match, staticContext}) =>{

    const rootStore = useContext(RootStoreContext);
    const Status = {
        Verifying: "Verifying",
        Failed:"Failed",
        Success:"Success"
    }
    
    const [responseStat,setResponseStat] = useState(Status.Verifying);
    const {openModal,closeModal,modal} = rootStore.modalStore;

    const {id, count} = queryString.parse(location.search);
    
    const isTablet = useMediaQuery({ query: '(max-width: 768px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })
   
    useEffect(() => {
        debugger;
        console.log(staticContext,id,count, match.params.status, match.params.paymentId, match.params.conversationData, match.params.conversationId, match.params.mdStatus);
        console.log(location,match);
        //callback api'sine gönderilecek ve sonuç olumlu geldiği zaman modal kapatılacak ve sayfaya parametre ile push edilcek.
//         agent.User.checkCallbackandStartPayment(id as string,count as string,match.params.status  as string, match.params.paymentId as string, match.params.conversationData as string, match.params.conversationId as string, match.params.mdStatus as string).then((res) => {
//            if(res)
//            {
// //            if(modal.open) closeModal();
//             history.push(`/payment/success?activityId=${id}?count=${count}?status=success`)
//            }
//         }).catch(() =>{
//             setResponseStat(Status.Failed);
//         })
      
    }, [id, count])


        // const handleConfiedEmailResend = () => {
        //     agent.User.resendVerifyEmailConfirm(email as string).then(() => {
        //         toast.success('Doğrulama linki yeniden gönderildi - Lütfen e-posta kutunu kontrol et');
        //     }).catch((error) => console.log(error));
        // }

    // const getBody = () => {
    //     switch (mdStatus) {
    //         case "0":
    //             return (
    //             <p>Doğrulanıyor..</p>
    //             )
    //             case "2":
    //                 return (
    //                     <div className="center">
    //                         <p>Doğrulama başarısız - tekrar doğrulama linki gönderilmesini talep edebilirsin.</p>
    //                         <Button  primary content="Yeniden Gönder" size="huge"/>
    //                     </div>
    //                 )
                   
    //                 case "1":
    //                     return (
    //                         <div className="center">
    //                             <p>Ödeme tamamlandı</p>
    //                         </div>
    //                     )
                       
    //         default:
    //             break;
    //     }
    // }



    return(
        <LoadingComponent content='Ödeme gerçekleştiriliyor. Lütfen sayfayı kapatmadan bekleyiniz..'/>  
    )
}

export default observer(ActivityPaymentCallback);
