import React, {useEffect, useRef} from 'react'
import Home from "../landingpagecomponents/views/Home";
import LayoutDefault from "../landingpagecomponents/layouts/LayoutDefault";
import ScrollReveal from "../landingpagecomponents/utils/ScrollReveal";
import { useLocation, Switch } from 'react-router-dom';
import AppRoute from "../landingpagecomponents/utils/AppRoute";



const LandingPage = () => {
    
    const childRef = useRef();
    let location = useLocation();

    useEffect(() => {
        const page = location.pathname;
        document.body.classList.add('is-loaded')
        childRef.current.init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    return (
        <ScrollReveal
            ref={childRef}
            children={() => (
                <Switch>
                    <AppRoute exact path="/" component={Home} layout={LayoutDefault} />
                </Switch>
            )} />
    );
}

export default LandingPage;

