import React from 'react';
import { Segment, Button, Header, Icon, Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const Forbidden = () => {
    return (
        <Container className="pageContainer">

        <Segment placeholder>
            <Header icon>
                <Icon name='search' />
                Opps! Bu sayfayı görüntüleme iznin yok. 
            </Header>
            <Segment.Inline>
                <Button as={Link} to='/' primary circular>
                    Anasayfaya geri dön
                </Button>
            </Segment.Inline>
        </Segment>
        </Container>
    );
};

export default Forbidden;