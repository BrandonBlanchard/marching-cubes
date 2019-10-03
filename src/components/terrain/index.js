import React, { useState, useRef, useEffect } from 'react';
import { useUpdate } from 'react-three-fiber';
import * as THREE from 'three';
import { Noise } from 'noisejs';
import without from 'lodash/without';
import flatten from 'lodash/flatten';

import { positionOffsets, triTable, edgeTable } from './../../constants';
import { getTriTableIndex, interpolatePoints } from '../../utils/marching-cubes';

const terrainMaterial = new THREE.MeshPhongMaterial({color: new THREE.Color('indianred'), side: THREE.DoubleSide, flatShading: true});

const Terrain = props => {
    // Dimensions should be normalized to the sampleSpacing.
    // This means that if your dimensions are 10,10,10 and your sample spacing is 5 then you'll end up with a 50x50x50 grid of terrain.
    const [
        width,
        depth,
        height
    ] = props.dimensions;
    
    const [terrainVertices, setTerrainVertices] = useState(new Float32Array());
    const noiseRef = useRef(new Noise(Math.random()));

    useEffect(() => {
        const noise = noiseRef.current;
        let verts = [];
        
        for(let x = 0; x < width; x += 1) {
            for(let z = 0; z < depth; z += 1) {
                for(let y = 0; y < height; y += 1) {
                    const vertPositions = positionOffsets.map(([ox,oy,oz]) => [x + ox * 0.5, y + oy * 0.5, z + oz * 0.5]);
                    const sampleValues = vertPositions.map(([sx,sy,sz]) => noise.simplex3(sx,sy,sz));
                    const triTableIndex = getTriTableIndex(sampleValues);
                    const intersectedEdges = triTable[triTableIndex];
                    
                    const points = intersectedEdges.map(val => {
                        if(val < 0) { return null; }
                        
                        const pointIndices = edgeTable[val];
                        const v1 = interpolatePoints(
                            vertPositions[pointIndices[0]],
                            vertPositions[pointIndices[1]],
                            sampleValues[pointIndices[0]],
                            sampleValues[pointIndices[1]]);
                 
                         return v1;
                     });
                     
                     const cubePositions = without(flatten(points), null);
                     verts = [].concat(verts, cubePositions);
                }
            }
        }
        
        setTerrainVertices(new Float32Array(verts));
    }, []);
    
    const terrainMeshRef = useUpdate(geometry => {
        geometry.addAttribute('position', new THREE.BufferAttribute(terrainVertices, 3)); 
        terrainMeshRef.current.attributes.position.needsUpdate = true;
    }, [terrainVertices]);
    
    return (
        <mesh 
            key='cube-mesh'
            material={terrainMaterial}
            position={[0,0,0]}>
                <bufferGeometry attach='geometry' ref={terrainMeshRef} >
                    <bufferAttribute
                        attachObject={['attributes', 'position']}
                        count={0}
                        itemSize={3}
                        dynamic
                        />
                </bufferGeometry>
            </mesh>
    );
};

export default Terrain;