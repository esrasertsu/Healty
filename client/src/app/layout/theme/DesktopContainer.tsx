import React, { Component, useState } from "react"
import { Button, Container, Menu, Segment, Visibility } from "semantic-ui-react"
import { createMedia } from '@artsy/fresnel'
import NavBar from "../../../features/nav/NavBar"


const { Media } = createMedia({
    breakpoints: {
      mobile: 0,
      tablet: 768,
      computer: 1024,
    },
  })


const DesktopContainer = ({children}: any)=> {

    const [fixed, setfixed] = useState(false)
  
    const hideFixedMenu = () => setfixed(false)
    const showFixedMenu = () => setfixed(true)

      return (
        <>
          <Visibility
            once={false}
            onBottomPassed={showFixedMenu}
            onBottomPassedReverse={hideFixedMenu}
          >
          
                 <NavBar fixed={fixed}/>
              {/* <Menu
                fixed={fixed ? 'top' : undefined}
                inverted={!fixed}
                pointing={!fixed}
                secondary={!fixed}
                size='large'
              >
                <Container>
                  <Menu.Item as='a' active>
                    Home
                  </Menu.Item>
                  <Menu.Item as='a'>Work</Menu.Item>
                  <Menu.Item as='a'>Company</Menu.Item>
                  <Menu.Item as='a'>Careers</Menu.Item>
                  <Menu.Item position='right'>
                    <Button as='a' inverted={!fixed}>
                      Log in
                    </Button>
                    <Button as='a' inverted={!fixed} primary={fixed} style={{ marginLeft: '0.5em' }}>
                      Sign Up
                    </Button>
                  </Menu.Item>
                </Container>
              </Menu> */}
              {/* <HomepageHeading /> */}
          </Visibility>
  
          {children}
          </>
      )
  }

  export default DesktopContainer;