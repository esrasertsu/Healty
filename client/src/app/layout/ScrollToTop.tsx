import { useEffect } from "react"
import { withRouter } from "react-router-dom";

const ScrollToTop =({children, location:{pathname}}: any) =>{
    useEffect(()=>{
        document.querySelector('body')!.scrollTo(0,0)
    }, [pathname]);

    return children;
};

export default withRouter(ScrollToTop);