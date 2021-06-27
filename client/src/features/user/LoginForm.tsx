import { FORM_ERROR } from 'final-form';
import React, { useContext } from 'react'
import { Form as FinalForm , Field } from 'react-final-form';
import { combineValidators, isRequired } from 'revalidate';
import { Button, Form, Header } from 'semantic-ui-react';
import { ErrorMessage } from '../../app/common/form/ErrorMessage';
import TextInput from '../../app/common/form/TextInput';
import { IUserFormValues } from '../../app/models/user';
import { RootStoreContext } from '../../app/stores/rootStore';
import { history } from '../../index'


const validate = combineValidators({
    email: isRequired('email'),
    password: isRequired('password')
})

interface IProps {
  location: string;
}

export const LoginForm:React.FC<IProps> = ({location}) => {
    const rootStore = useContext(RootStoreContext);
    const { login } = rootStore.userStore;


    return (
      <FinalForm
        onSubmit={(values: IUserFormValues) =>
          login(values)
          .finally(()=> history.push(location))
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
              content="Afitapp'a Giriş Yap"
              color="teal"
              textAlign="center"
            />
            <Field name="email" placeholder="Email" component={TextInput}/>
            <Field
              name="password"
              placeholder="Password"
              type="password"
              component={TextInput}
            />
            {submitError && !dirtySinceLastSubmit && (
             <ErrorMessage error={submitError} text='Invalid email address or password' />
            )}
            <Button
              disabled={(invalid && !dirtySinceLastSubmit) || pristine}
              loading={submitting}
              color='teal'
              content="Login"
              fluid
            />
          </Form>
        )}
      />
    );
}
