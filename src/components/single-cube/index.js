import React, { useState, useRef, useEffect } from 'react';
import { useUpdate } from 'react-three-fiber';
import * as THREE from 'three';
import flatten from 'lodash/flatten';
import without from 'lodash/without';

import { getTriTableIndex, interpolatePoints } from '../../utils/marching-cubes';
import { triTable, edgeTable } from '../../constants';

const COLOR_ON = 'blue';
const COLOR_OFF = 'gray';

const cubeMeshMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color(0xdd34dd), side: THREE.DoubleSide});
const togglePointHandler = (i, activePoints, setActivePoints) => {
    const newPoints = activePoints.slice();
    newPoints[i] = activePoints[i] === -1 ? 1 : -1;
    
    setActivePoints(newPoints);
};

const SingleCube = (props) => {
    const halfSize = 0.5;
    const positionModifiers = [
        [-halfSize, -halfSize, halfSize], // v0
        [halfSize, -halfSize, halfSize], // v1
        [halfSize, -halfSize, -halfSize], // v2
        [-halfSize, -halfSize, -halfSize], // v3
        
        [-halfSize, halfSize, halfSize], // v4
        [halfSize, halfSize, halfSize], // v5
        [halfSize, halfSize, -halfSize], // v6
        [-halfSize, halfSize, -halfSize], // v7
    ];
    const [activePoints, setActivePoints] = useState([-1,-1,-1,-1,-1,-1,-1,-1]);
    
    const offMaterial = useRef(new THREE.MeshBasicMaterial({ color: new THREE.Color(COLOR_OFF) }));
    const onMaterial = useRef(new THREE.MeshBasicMaterial({ color: new THREE.Color(COLOR_ON) }));
    
    const cubeGeoRef = useUpdate(geometry => {
        const triTableIndex = getTriTableIndex(activePoints);
        const intersectedEdges = triTable[triTableIndex];
        
        const points = intersectedEdges.map(val => {
           if(val < 0) { return null; }
           
           const pointIndices = edgeTable[val];
           const v1 = interpolatePoints(
               positionModifiers[pointIndices[0]],
               positionModifiers[pointIndices[1]],
               activePoints[pointIndices[0]],
               activePoints[pointIndices[1]]);
    
            return v1;
        });
        
        const vertArray = new Float32Array(without(flatten(points), null));
        geometry.addAttribute('position', new THREE.BufferAttribute(vertArray, 3));  
        cubeGeoRef.current.attributes.position.needsUpdate = true;
    }, activePoints);
    
    return (
        <group>      
            { activePoints.map((val, i) => 
            <mesh 
                key={`corner[${positionModifiers[i]}]`}
                position={positionModifiers[i]}
                onClick={() => togglePointHandler(i, activePoints, setActivePoints)}
                material={activePoints[i] === 1 ? onMaterial.current : offMaterial.current }  >  
                    <sphereGeometry attach='geometry' args={[0.1, 6, 6]} />
            </mesh>
            )}
            
            <mesh 
                key='cube-mesh'
                material={cubeMeshMaterial}
                position={[0,0,0]}>
                    <bufferGeometry attach='geometry' ref={cubeGeoRef} >
                        <bufferAttribute
                            attachObject={['attributes', 'position']}
                            count={0}
                            itemSize={3}
                            dynamic
                            />
                    </bufferGeometry>
            </mesh>
        </group>  
    );
};

export default SingleCube;