import { useEffect, useLayoutEffect } from "react"
import { withRouter } from "react-router-dom";

export const ScrollToTop = withRouter(({ children, location: { pathname } }: any) => {
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return children || null
})