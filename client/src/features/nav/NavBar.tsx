import React, { useContext } from 'react';
import { Menu, Container, Button, Image, Dropdown } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Link, NavLink } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';
import {history} from '../../index';

const NavBar: React.FC = () => {
    const rootStore = useContext(RootStoreContext);
    const { user, logout} = rootStore.userStore;
    const { setLoadingProfiles } = rootStore.profileStore;
    const { setLoadingInitial } = rootStore.activityStore;

    return (
      <Menu fixed="top" inverted>
        <Container>
          <Menu.Item header as={NavLink} exact to="/">
            <img
              src="/assets/logo512.png"
              alt="logo"
              style={{ marginRight: "10px", marginLeft: "-1.14em" }}
            />
            Reactivity
          </Menu.Item>
                <Menu.Item name="activities"   onClick={() => {
                   setLoadingInitial(true);
                    history.push(`/activities`);
                    }} />

                <Menu.Item name="profiles" 
                onClick={() => {
                   setLoadingProfiles(true);
                    history.push(`/profiles`);
                    }} />

                {user && user.role !== "User" &&
                    <Menu.Item>
                        <Button
                            as={NavLink}
                            to="/createActivity"
                            positive
                            content="Create Activity"
                        />
                    </Menu.Item>
                }
          
          {user && (
            <Menu.Item position="right">
              <Image avatar spaced="right" src={user.image || "/assets/user.png"} />
              <Dropdown pointing="top left" text={user.displayName}>
                <Dropdown.Menu>
                  <Dropdown.Item
                    as={Link}
                    to={`/profile/${user.userName}`}
                    text="My profile"
                    icon="user"
                  />
                  <Dropdown.Item text="Logout" onClick={logout} icon="power" />
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          )}
        </Container>
      </Menu>
    );
}

export default observer(NavBar);