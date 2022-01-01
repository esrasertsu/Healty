import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react'
import { Route, RouteComponentProps, RouteProps } from 'react-router-dom'
import { Container, Image, Modal, Segment } from 'semantic-ui-react';
import { history } from '../../index';
import  LoginForm from '../../features/user/LoginForm';
import {RootStoreContext} from '../stores/rootStore';

interface IProps extends RouteProps{
   component: React.ComponentType<RouteComponentProps<any>>
}
 const PrivateRoute: React.FC<IProps> = ({component: Component, ...rest}) => {
    const rootStore = useContext(RootStoreContext);
    const {isLoggedIn} = rootStore.userStore;
   const [open, setOpen] = useState(true);



    return (
        <Route
        {...rest}
        render={(props) => isLoggedIn ?
             <Component {...props} />
             : 
              <Container className="pageContainer">
                 <Segment className="login-page-segment">
               <LoginForm location={history.location.pathname} />
                </Segment>
             </Container>
            
                  //   <Modal
                  //   closeIcon
                  //   dimmer='blurring'
                  //   open={open} 
                  //   closeOnEscape={true}
                  //   closeOnDimmerClick={false}
                  //   onClose={() =>{ 
                  //      setOpen(false);
                  //      history.push("/login-required");
                  //   }}
                  //   size='small'
                  //   >
                  //   <Modal.Content image>
                  //   <Image size='medium' src='/assets/placeholder.png' wrapped />
                  //   <Modal.Description>
                  //        <LoginForm location={history.location.pathname} />
                  //   </Modal.Description>
                  //   </Modal.Content>
                    
                  //   </Modal>
                 
            }
        />
    )
}

export default observer(PrivateRoute)