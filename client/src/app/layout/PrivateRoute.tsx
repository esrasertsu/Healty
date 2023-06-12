import { observer } from 'mobx-react-lite';
import React from 'react'
import { Route, RouteComponentProps, RouteProps, useHistory } from 'react-router-dom'
import { Container, Segment } from 'semantic-ui-react';
import  LoginForm from '../../features/user/LoginForm';
import { useStore} from '../stores/rootStore';

interface IProps extends RouteProps{
   component: React.ComponentType<RouteComponentProps<any>>
}
 const PrivateRoute: React.FC<IProps> = ({component: Component, ...rest}) => {
   const rootStore = useStore();
   const {isLoggedIn} = rootStore.userStore;
   const history = useHistory();

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