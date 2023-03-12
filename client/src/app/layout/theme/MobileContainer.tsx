import React, { Component, useState } from "react"
import { Button, Container, Icon, Menu, Segment, Sidebar, SidebarPushableProps, Visibility } from "semantic-ui-react"
import { createMedia } from '@artsy/fresnel'
import MobileNavMenu from "../../../features/nav/MobileNavMenu"
import MobileNavBar from "../../../features/nav/MobileNavBar"


const { Media } = createMedia({
    breakpoints: {
      mobile: 0,
      tablet: 820,
      computer: 1024,
    },
  })

const MobileContainer = ({children}: any)=> {
    const [sidebarOpened, setsidebarOpened] = useState(false);
  
    const handleSidebarHide = () => setsidebarOpened(false);
  
    const handleToggle = () =>  setsidebarOpened(true);
  
  
      return (
        <>
          <Sidebar.Pushable>
            <Sidebar
              as={Menu}
              animation='overlay'
              onHide={handleSidebarHide}
              vertical
              visible={sidebarOpened}
            >
              <MobileNavMenu setVisibleMobileNav={setsidebarOpened} visible={sidebarOpened} />
            </Sidebar>
  
            <Sidebar.Pusher dimmed={sidebarOpened}>
                <MobileNavBar setVisibleMobileNav={setsidebarOpened} visible={sidebarOpened}/>
              {children}
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </>
      )
    
  }
  
export default MobileContainer