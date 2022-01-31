import React, { useContext, useState } from 'react'
import { Form as FinalForm , Field } from 'react-final-form';
import { Button, Form, Grid, Header, Icon, Label } from 'semantic-ui-react';
import { StarRating } from '../../app/common/form/StarRating';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import { RootStoreContext } from '../../app/stores/rootStore';
import { IProfileComment } from '../../app/models/profile';
import { combineValidators, isRequired } from 'revalidate';

interface IProps{
    closeModal:() => void;
    url:string
}
interface IVideoUploadParam{
    url:string
}
const validate = combineValidators({
    url: isRequired('url')
})

 const ProfileVideoUploadForm:React.FC<IProps> = ({url,closeModal}) => {
  const rootStore = useContext(RootStoreContext);

  const {
    uploadProfileVideo
  } = rootStore.profileStore;

    const [rating, setRating] = useState(0);

    
    const handleFinalFormSubmit = async (video: IVideoUploadParam) => {
debugger;
if(video!.url)
           await uploadProfileVideo(video!.url);
    };

    return (
        <Grid>
            <Grid.Row>
            <Grid.Column>
             <div style={{textAlign:"right"}}>
            {/* <Icon style={{cursor:"pointer"}} onClick={closeModal} name="times" size="large" color="orange"/> */}
            </div>
            <Header
              as="h4"
              content="Eklemek istediğiniz video'nun Youtube linkini kopyalayıp aşağıdaki alana yapıştırınız"
              color="red"
              textAlign="left"
              style={{marginTop:"0"}}
              icon="youtube"
            />
            </Grid.Column>
            </Grid.Row>
            <Grid.Row>
            <Grid.Column>
        <FinalForm 
        onSubmit ={handleFinalFormSubmit}
        validate={validate}

        render={({handleSubmit, submitting, form,values,invalid}) => (
          <Form widths={"equal"} 
          onSubmit={() => handleSubmit()!.then(()=> {form.reset(); closeModal();})}
          >
           <Field
                  name="url"
                  placeholder="Videonun YouTube linki. Örn: 'https://www.youtube.com/watch?v=Hyi8Z4s2miw'"
                  component={TextAreaInput}
                  rows={1}
                />  
          <Button
          style={{marginTop: 12}}
          disabled={invalid}
          floated="right"
            content='Ekle'
            labelPosition='right'
            icon="check"
            color="red"
            circular
            loading={submitting}
          />
        </Form>
        
        )}
      />
      </Grid.Column>
      </Grid.Row>
      </Grid>
    )
}


export default ProfileVideoUploadForm