import { createMedia } from "@artsy/fresnel";
import React from "react";
import DesktopContainer from "./DesktopContainer";
import MobileContainer from "./MobileContainer";

const { Media,MediaContextProvider } = createMedia({
    breakpoints: {
      mobile: 0,
      tablet: 768,
      computer: 1024,
    },
  })

const ResponsiveContainer = ({ children }: any) => (
    /* Heads up!
     * For large applications it may not be best option to put all page into these containers at
     * they will be rendered twice for SSR.
     */
    <MediaContextProvider>
      <Media at="mobile"><MobileContainer>{children}</MobileContainer></Media>
      <Media at="tablet"><MobileContainer>{children}</MobileContainer></Media>
      <Media greaterThanOrEqual='computer'><DesktopContainer>{children}</DesktopContainer></Media>
    </MediaContextProvider>
  )
  

  export default ResponsiveContainer;