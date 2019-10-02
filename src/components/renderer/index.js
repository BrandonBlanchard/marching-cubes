import React, { useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Canvas, extend, useFrame, useThree } from 'react-three-fiber';

import './styles.css';

extend({OrbitControls});

const Controls = () => {
    const controls = useRef()
    const { camera, gl } = useThree();
    
    useFrame(() => controls.current.update());
    
    return (
      <orbitControls ref={controls} args={[camera, gl.domElement]} enableDamping dampingFactor={0.1} rotateSpeed={0.5} />
    );
};
  
const Renderer = React.forwardRef((props, ref) => {
    return (
        <div className='renderer__container'>
            <Canvas className='renderer__canvas' ref={ref}>
                {props.children}
                <Controls/>
            </Canvas>
        </div>  
    )
});

export default Renderer;