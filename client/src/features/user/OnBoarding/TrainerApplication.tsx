import React, {  useContext, useEffect,useState } from 'react';
import {RouteComponentProps} from 'react-router-dom';
import { Container, Grid, Header, Image, Segment } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useMediaQuery } from 'react-responsive'
import { ImFolderOpen } from "react-icons/im";
import { RiBallPenFill } from "react-icons/ri";
import { MdBusinessCenter } from "react-icons/md";
import { StepsComponent } from '../../../app/common/components/Steps/StepsComponent';
import { StepsHeader } from '../../../app/common/components/Steps/StepsHeader';
import { StepsContentWrapper } from '../../../app/common/components/Steps/StepContentWrapper';
import { StepContent } from '../../../app/common/components/Steps/StepContent';
import { Form as FinalForm , Field } from 'react-final-form';
import { Accordion, Button, Confirm, Form,  Icon, Message } from 'semantic-ui-react';
import DropdownInput from '../../../app/common/form/DropdownInput';
import DropdownMultiple from '../../../app/common/form/DropdownMultiple';
import { ErrorMessage } from '../../../app/common/form/ErrorMessage';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import TextInput from '../../../app/common/form/TextInput';
import { Category, ICategory } from '../../../app/models/category';
import { ITrainerFormValues, TrainerFormValues } from '../../../app/models/user';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { OnChange } from 'react-final-form-listeners';
import { toast } from 'react-toastify';
import NumberInput from '../../../app/common/form/NumberInput';
import agent from '../../../app/api/agent';
import { action } from 'mobx';
import SubMerchantDetails from '../../subMerchant/SubMerchantDetails';
import Documents from '../../profiles/Documents';
import { Document, IDocument } from '../../../app/models/profile';
import ApplicationForm1 from './ApplicationForm1';
import ApplicationForm2 from './ApplicationForm2';
import ApplicationForm3 from './ApplicationForm3';
import "./styles.scss"
interface DetailParams{
    id:string
}

const TrainerApplication : React.FC<RouteComponentProps<DetailParams>> = ({match, history}) =>{
    
    const rootStore = useContext(RootStoreContext);
    const {trainerForm, setTrainerForm} = rootStore.userStore;
    const {accessibilities, loadAccessibilities} = rootStore.profileStore;
    const { trainerRegistering, registerTrainer,tranierCreationForm,
        settrainerRegisteringFalse,user } = rootStore.userStore;
 
    const [trainerRegisteredSuccess, setTrainerRegisteredSuccess] = useState(false)
    const [trainerForm2Message, setTrainerForm2Message] = useState(false);
    const [error2Message, setError2Message] = useState<string[]>([]);
    const [docs, setDocs] = useState<any[]>([]);
    const [userSubmerchant,setUserSubmerchant] = useState(false);

    useEffect(() => {

        agent.User.loadNewTrainer(match.params.id)
        .then(action((newTrainer) =>
        {
          setTrainerForm(new TrainerFormValues(newTrainer));
        })).catch((error) => 
           console.log(error)
            
        )  
         loadAccessibilities();
      }, [match.params.id])
      

        const [activeId,setActiveId] = useState(1);

    return(
        <>
      
        <Container className="pageContainer">
        {/* <Header as="h3" textAlign="center">{user!.role === "UnderConsiTrainer" ? "Değerlendirme Aşamasında": "- Başvuru Bekleniyor -"}</Header> */}

        { trainerRegistering ? 
      <>
        <Message icon style={{maxWidth:"none"}}>
        <Icon name='circle notched' loading />
        <Message.Content>
          <Message.Header>Kaydediliyor..</Message.Header>
          Başvuru formunuzu güncelliyoruz.
        </Message.Content>
      </Message>
      </> :
      trainerRegisteredSuccess && 
      <Message style={{maxWidth:"none"}}
      success
      header='Başvuru formunuz iletildi!'
      content='En yakın zamanda email adresinize bilgilendirme yapılacaktır.'
    />
      }
        
       <div>
       <StepsComponent>
           <StepsHeader>
               <button data-step="1" className={activeId ===1 ? "active steps_btn" : "steps_btn"}
                  onClick={() => setActiveId(1)}> 
                    <ImFolderOpen />
                </button>
                <div className={(activeId === 3 || activeId === 2 )? "active line" : "line"}></div>
                <button data-step="2" className={activeId === 2 ? "active steps_btn" : "steps_btn"}
                    onClick={() => setActiveId(2)}>
                     <MdBusinessCenter /> 
                    </button>
                <div className={activeId === 3 ? "active line" : "line"}></div>
                <button data-step="3" className={activeId === 3 ? "active steps_btn" : "steps_btn"}
                   onClick={() => setActiveId(3)}>
                         <RiBallPenFill />
                         </button> 
           </StepsHeader>
           { trainerForm2Message && <Message className='onboarding_message'
      error
      header=''
      list={error2Message}
    />}
           <StepsContentWrapper>
               <StepContent
                stepId={0}
                className={activeId === 1 ? "active" : ""}>
                   <ApplicationForm1 
                   docs={docs}
                   setDocs={setDocs}
                   trainerForm={trainerForm} 
                   setTrainerForm={setTrainerForm} 
                   setTrainerRegisteredSuccess={setTrainerRegisteredSuccess}
                   setActiveTab={setActiveId}
                   setTrainerForm2Message={setTrainerForm2Message}/>
               </StepContent>
               <StepContent
                 stepId={1}
                 className={activeId === 2 ? "active" : ""}>
                    <ApplicationForm2 id={match.params.id}
                    setUserSubmerchant={setUserSubmerchant} />
               </StepContent>
               <StepContent
                 stepId={2}
                 className={activeId === 3 ? "active" : ""}>
                    <ApplicationForm3
                    setTrainerRegisteredSuccess={setTrainerRegisteredSuccess}
                    setTrainerForm2Message={setTrainerForm2Message}
                    setError2Message={setError2Message}
                     userSubMerchant={userSubmerchant}
                     userSubmerchant={userSubmerchant}
                     docs={docs} />
               </StepContent>

           </StepsContentWrapper>
       </StepsComponent>
       </div>
       { trainerForm2Message && <Message
      error
      header=''
      list={error2Message}
    />}

       </Container> 
        
        </>
    )
};

export default observer(TrainerApplication);

