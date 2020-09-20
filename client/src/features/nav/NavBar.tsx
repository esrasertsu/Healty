import React from 'react';
import { Menu, Container, Button } from 'semantic-ui-react';

interface IProps {
    openCreateForm: () => void;
}
const NavBar: React.FC<IProps> = ({ openCreateForm }) => {
    return (
        <Menu fixed="top" inverted>
            <Container>
                <Menu.Item header>
                    <img src="/assets/logo512.png" alt="logo" style={{ marginRight: '10px', marginLeft:'-1.14em' }} />
                    Reactivity
                </Menu.Item>
                <Menu.Item name='activities' />
                <Menu.Item>
                    <Button onClick={openCreateForm} positive content="Create Activity" />
                </Menu.Item>
            </Container>
        </Menu>       
    )
}

export default NavBar