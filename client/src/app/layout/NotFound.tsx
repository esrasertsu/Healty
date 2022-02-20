import React from 'react';
import { Segment, Button, Header, Icon, Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <Container className="pageContainer">

        <Segment placeholder>
            <Header icon>
                <Icon name='search' />
                Opps! Aradığın sayfayı bulamadık
            </Header>
            <Segment.Inline>
                <Button as={Link} to='/activities' className='blueBtn' circular>
                    Aktivitelere dön
                </Button>
            </Segment.Inline>
        </Segment>
        </Container>
    );
};

export default NotFound;