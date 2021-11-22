import React, { useContext, useState } from 'react'
import { Container, Grid, Header, Menu } from 'semantic-ui-react'
import ActivityCreationPage from '../activities/form/ActivityCreationPage'
import OrderList from '../orders/OrderList'
import SubMerchantDetails from '../subMerchant/SubMerchantDetails'
import { useMediaQuery } from 'react-responsive';
import { observer } from 'mobx-react-lite'
import { RootStoreContext } from '../../app/stores/rootStore'

 const Settings:React.FC = () => {
    const rootStore = useContext(RootStoreContext);
    const {user} = rootStore.userStore;

    const [activeItem, setActiveItem] = useState("Rezervasyonlarım")
    const handleMenuItemClick = (e:any,data:any) =>{
        setActiveItem(data.name);
    }
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' })


    return (
        <Container className="pageContainer">

        <Grid stackable style={{ margin:"0 20px 0 0",width:"100%"}} >
            <Grid.Row>
                <Grid.Column width={3}  style={!isMobile ? {paddingTop:"30px"}: {}}>
                    <div>
                 <Header content="Ayarlar"/>
                   <Menu pointing vertical className="settingsVerticalMenu">
                    <Menu.Item
                    className="settingsMenuItem"
                    key="0"
                    name='Kullanıcı Bilgilerim'
                    active={activeItem === 'Kullanıcı Bilgilerim'}
                    onClick={handleMenuItemClick}
                    />
                    {
                        user!.role === "Trainer" &&
                        <Menu.Item
                        key="2"
                        name='Şirket Bilgilerim'
                        className="settingsMenuItem"
                        active={activeItem === 'Şirket Bilgilerim'}
                        onClick={handleMenuItemClick}
                        />
                    }
                   
                    <Menu.Item
                    key="1"
                    className="settingsMenuItem"
                    name='Mesajlar'
                    active={activeItem === 'Mesajlar'}
                    onClick={handleMenuItemClick}
                    />
                    <Menu.Item
                    key="3"
                    className="settingsMenuItem"
                    name='Rezervasyonlarım'
                    active={activeItem === 'Rezervasyonlarım'}
                    onClick={handleMenuItemClick}
                    />
                </Menu>
                </div>
                </Grid.Column>
                <Grid.Column style={{paddingRight:0}} width={13}>
                    {
                        activeItem === "Şirket Bilgilerim" ?
                        <SubMerchantDetails />
                        : activeItem === "Rezervasyonlarım" ? 
                        <OrderList settings={true}/>
                        :<ActivityCreationPage />

                    }
                </Grid.Column>
            </Grid.Row>
        </Grid>
</Container>
        )
}



export default observer(Settings)