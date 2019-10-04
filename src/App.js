import React, { useState, useMemo } from 'react';
import Select from 'react-select';

import Renderer from './components/renderer';
import SingleCube from './components/single-cube';
import Terrain from './components/terrain';
import { sampleFunctions } from './utils/sample-functions';

import './App.css';

const VISUALIZATIONS = {
  SINGLE: 'Single Cube',
  MARCHED: 'Marched Cubes'
};

const mapSizes = [
  { label: 'Huge (200, 100, 200)', value: [200, 100, 200] },
  { label: 'Big (110, 60, 110)', value: [110, 60, 110] },
  { label: 'Recommended (50, 2, 50)', value: [50, 25, 50] },
  { label: 'Small (25, 25, 25)', value: [25, 25, 25] },
  { label: 'Tiny (10, 25, 10', value: [10, 25, 10] }
];
const visualizationOptions = Object.keys(VISUALIZATIONS).map(vis => ({ label: VISUALIZATIONS[vis], value: vis }));
const sampleFunctionOptions = Object.keys(sampleFunctions).map(sampleFunc => ({ label: sampleFunc, value: sampleFunc}));

const getUpdateFunction = (setState) => selection => setState(selection);


const App = () => {
  const [currentVisualization, setCurrentVisualization] = useState(visualizationOptions[0]);
  const [sampleMethod, setSampleMethod] = useState(sampleFunctionOptions[0]);
  const [messaging, setMessaging] = useState('');
  const [volumeSize, setVolumeSize] = useState(mapSizes[2]);


  return (
    <div className="App">
      <div className='marching-cubes__header'>
        <Select
          className='marching-cubes__visualization'
          isSearchable={false}
          defaultValue={currentVisualization}
          options={visualizationOptions}
          onChange={getUpdateFunction(setCurrentVisualization)}/>
          
        { currentVisualization.label === VISUALIZATIONS.MARCHED &&
          <div className='marching-cubes__marching-options'>
            <Select
              className='marching-cubes__sample-function'
              isSearchable={false}
              defaultValue={sampleMethod}
              options={sampleFunctionOptions}
              onChange={getUpdateFunction(setSampleMethod)}/>
            <Select
              className='marching-cubes__volume-size'
              isSearchable={false}
              defaultValue={volumeSize}
              options={mapSizes}
              onChange={getUpdateFunction(setVolumeSize)}/>
          </div>
          }
      </div>
      <Renderer>
        <directionalLight args={[0x3434df, 1]} position={[1000,1000,1000]} />
        <directionalLight args={[0xffffff, 0.2]} position={[0,1000,0]} />
        <directionalLight args={[0xdf3434, 0.8]} position={[-1000,-1000,-1000]} />
        { currentVisualization.label === VISUALIZATIONS.SINGLE && <SingleCube /> }
        {
          currentVisualization.label === VISUALIZATIONS.MARCHED &&
          <Terrain dimensions={volumeSize.value} samplingFunction={sampleFunctions[sampleMethod.value]} setMessaging={setMessaging}/> 
        }
      </Renderer>
      <div className='marching-cubes__messaging'>
        {messaging}
      </div>
    </div>
  );
}

export default App;
