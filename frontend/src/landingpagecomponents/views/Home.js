import React from 'react';
// import sections
import Hero from '../components/sections/Hero';
import FeaturesTiles from '../components/sections/FeaturesTiles';
import SectionHeader from "../components/sections/partials/SectionHeader";


const Home = () => {


  return (
    <div>
      <Hero className="illustration-section-01"  style = {{paddingBottom: 0}}/>
      <h2 className="center-content" style = {{paddingBottom: 200}}>Providing a virtual support system for veterans in need.</h2>
    </div>
  );
}

export default Home;