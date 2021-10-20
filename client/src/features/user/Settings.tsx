import React, { useState } from 'react'
import { Container, Grid, Menu } from 'semantic-ui-react'
import ActivityCreationPage from '../activities/form/ActivityCreationPage'
import SubMerchantDetails from '../subMerchant/SubMerchantDetails'

export const Settings = () => {

    const [activeItem, setActiveItem] = useState("Şirket Bilgilerim")
    const handleMenuItemClick = (e:any,data:any) =>{
        setActiveItem(data.name);
    }

    return (

        <Grid style={{marginTop:"40px", width:"100%"}} >
            <Grid.Row>
                <Grid.Column width={3}>
                    <Container>
                   <Menu pointing vertical className="settingsVerticalMenu">
                    <Menu.Item
                    className="settingsMenuItem"
                    key="0"
                    name='Kullanıcı Bilgilerim'
                    active={activeItem === 'Kullanıcı Bilgilerim'}
                    onClick={handleMenuItemClick}
                    />
                    <Menu.Item
                    key="2"
                    name='Şirket Bilgilerim'
                    className="settingsMenuItem"
                    active={activeItem === 'Şirket Bilgilerim'}
                    onClick={handleMenuItemClick}
                    />
                    <Menu.Item
                    key="1"
                    className="settingsMenuItem"
                    name='Mesajlar'
                    active={activeItem === 'Mesajlar'}
                    onClick={handleMenuItemClick}
                    />
                </Menu>
                    </Container>
                </Grid.Column>
                <Grid.Column width={13}>
                    {
                        activeItem === "Şirket Bilgilerim" ?
                        <SubMerchantDetails />
: <ActivityCreationPage />

                    }
                </Grid.Column>
            </Grid.Row>
        </Grid>

        )
}
