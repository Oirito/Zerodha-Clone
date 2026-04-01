import React from 'react';
import Hero from './Hero';
import Pricing from './Pricing';
import Education from './Education';
import Awards from './Awards';
import Stats from './Stats';

import OpenAccount from '../OpenAccounts';
function HomePage() {
    return (  <>
    
    <Hero/>
    <Awards/>
    <Stats/>
    <Pricing/>
    <Education/>
    <OpenAccount/>

    </>);
}

export default HomePage;