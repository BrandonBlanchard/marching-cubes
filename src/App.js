import React from 'react';

import Renderer from './components/renderer';
import SingleCube from './components/single-cube';
import Terrain from './components/terrain';

import './App.css';

function App() {
  return (
    <div className="App">
      <Renderer>
        <SingleCube />
      </Renderer>
    </div>
  );
}

export default App;
