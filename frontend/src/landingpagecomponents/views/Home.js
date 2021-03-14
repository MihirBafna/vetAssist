import React from 'react';
// import sections
import Hero from '../components/sections/Hero';
import FeaturesTiles from '../components/sections/FeaturesTiles';
import SectionHeader from "../components/sections/partials/SectionHeader";


const Home = () => {


  return (
    <div>
      <Hero className="illustration-section-01"  style = {{paddingBottom: 0}}/>
      <h2 className="center-content" style = {{paddingBottom: 200}}>Serving those that have served us.</h2>
    </div>
  );
}

export default Home;