import { FORM_ERROR } from 'final-form';
import React, { useContext } from 'react'
import { Form as FinalForm , Field } from 'react-final-form';
import { combineValidators, isRequired } from 'revalidate';
import { Button, Form, Header } from 'semantic-ui-react';
import { ErrorMessage } from '../../app/common/form/ErrorMessage';
import TextInput from '../../app/common/form/TextInput';
import { IUserFormValues } from '../../app/models/user';
import { RootStoreContext } from '../../app/stores/rootStore';


const validate = combineValidators({
    username: isRequired('username'),
    displayname: isRequired('display name'),
    email: isRequired('email'),
    password: isRequired('password')
})
interface IProps {
  location: string;
}
export const RegisterForm:React.FC<IProps> = ({location}) =>{
    const rootStore = useContext(RootStoreContext);
    const { register } = rootStore.userStore;


    return (
      <FinalForm
        onSubmit={(values: IUserFormValues) =>
            register(values,location)
            .catch((error) => ({
            [FORM_ERROR]: error,
          }))
        }
        validate={validate}
        render={({
          handleSubmit,
          submitting,
          submitError,
          invalid,
          pristine,
          dirtySinceLastSubmit,
        }) => (
          <Form onSubmit={handleSubmit} error>
            <Header
              as="h2"
              content="Yeni Üye"
              color="teal"
              textAlign="center"
            />
            <Field name="username" placeholder="Kullanıcı Adı" component={TextInput}/>
            <Field name="displayname" placeholder="Ad Soyad" component={TextInput} />
            <Field name="email" placeholder="Email" component={TextInput} />
            <Field
              name="password"
              placeholder="Şifre"
              type="password"
              component={TextInput}
            />
            {submitError && !dirtySinceLastSubmit && (
             <ErrorMessage error={submitError}
             text={JSON.stringify(submitError.data.errors)} />
            )}
            <Button
              disabled={(invalid && !dirtySinceLastSubmit) || pristine}
              loading={submitting}
              color='teal'
              content="Kayıt Ol"
              fluid
            />
          </Form>
        )}
      />
    );
}
