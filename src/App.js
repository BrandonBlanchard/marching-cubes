import React from 'react';

import Renderer from './components/renderer';
import SingleCube from './components/single-cube';
import Terrain from './components/terrain';

import './App.css';

function App() {
  return (
    <div className="App">
      <Renderer>
        <directionalLight args={[0x3434df, 1]} position={[1000,1000,1000]} />
        <directionalLight args={[0xffffff, 0.2]} position={[0,1000,0]} />
        <directionalLight args={[0xdf3434, 0.8]} position={[-1000,-1000,-1000]} />
        <Terrain dimensions={[8, 8, 8]} sampleSpacing={10}/> 
      </Renderer>
    </div>
  );
}

export default App;
