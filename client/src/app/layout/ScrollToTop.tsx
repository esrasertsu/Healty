import { useEffect } from "react"
import { withRouter } from "react-router-dom";


const ScrollToTop =({children}: any) =>{
    useEffect(()=>{
        document.querySelector('body')!.scrollTo(0,0)
    }, []);

    return children;
};

export default withRouter(ScrollToTop);