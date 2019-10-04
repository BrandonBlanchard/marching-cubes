import React, { useState } from 'react';

import Renderer from './components/renderer';
import SingleCube from './components/single-cube';
import Terrain from './components/terrain';
import { sampleFunctions } from './utils/sample-functions';

import './App.css';

const App = () => {
  const [sampleMethod, setSampleMethod] = useState('terrain');
  
  
  return (
    <div className="App">
      <div className='marching-cubes__header'>
        Dropdown goes here!
      </div>
      <Renderer>
        <directionalLight args={[0x3434df, 1]} position={[1000,1000,1000]} />
        <directionalLight args={[0xffffff, 0.2]} position={[0,1000,0]} />
        <directionalLight args={[0xdf3434, 0.8]} position={[-1000,-1000,-1000]} />
        <Terrain dimensions={[100, 100, 100]} samplingFunction={sampleFunctions[sampleMethod]} /> 
        {/* <SingleCube /> */}
      </Renderer>
    </div>
  );
}

export default App;
