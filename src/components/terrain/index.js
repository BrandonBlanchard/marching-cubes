import React, { useState, useRef, useEffect } from 'react';
import { useUpdate } from 'react-three-fiber';
import * as THREE from 'three';
import without from 'lodash/without';
import flatten from 'lodash/flatten';

import { positionOffsets, triTable, edgeTable, meshMaterial } from '../../constants';
import { getTriTableIndex, interpolatePoints } from '../../utils/marching-cubes';

const Terrain = props => {
    // Dimensions should be normalized to the sampleSpacing.
    // This means that if your dimensions are 10,10,10 and your sample spacing is 5 then you'll end up with a 50x50x50 grid of terrain.
    const [
        width,
        height,
        depth
    ] = props.dimensions;
    const { 
        samplingFunction,
        setMessaging
    } = props;
    
    const [terrainVertices, setTerrainVertices] = useState(new Float32Array(0,0,0));

    useEffect(() => {
        let verts = [];
        const t0 = performance.now();
        
        for(let x = width * -0.5, upperX = width/2; x < upperX; x += 1) {
            for(let z = depth * -0.5, upperZ = depth/2; z < upperZ; z += 1) {
                for(let y = 0; y < height; y += 1) {
                    // Get samples for the four corners of this cube
                    const samplePositions = positionOffsets.map(([ox,oy,oz]) => [
                        parseFloat((x + ox * 0.5).toFixed(2)),
                        parseFloat((y + oy * 0.5).toFixed(2)),
                        parseFloat((z + oz * 0.5).toFixed(2))
                    ]);
                    
                    const sampleValues = samplePositions.map(([sx,sy,sz]) => samplingFunction(sx,sy,sz));
                        
                    // Get the index for this sample combination
                    const triTableIndex = getTriTableIndex(sampleValues);
                    // Determine which edges have been intersected and drop any unneeded entries.
                    const intersectedEdges = without(triTable[triTableIndex], -1);
                    // For each intersected edge create a vertex
                    const points = intersectedEdges.map(edgeId => {
                        if(edgeId < 0) { return null; }
                        
                        const pointIndices = edgeTable[edgeId];
                        const v1 = interpolatePoints(
                            samplePositions[pointIndices[0]],
                            samplePositions[pointIndices[1]],
                            sampleValues[pointIndices[0]],
                            sampleValues[pointIndices[1]]);
                 
                         return v1;
                     });
                     
                     const cubePositions = flatten(points);
                     verts.push(...cubePositions);
                }
            }
        }
        
        setMessaging(`Constructed ${width*height*depth} cubes in ${(performance.now() - t0).toFixed(3)}ms`);
        setTerrainVertices(new Float32Array(verts));
    }, [samplingFunction, width, height, depth]);
    
    
    const terrainMeshRef = useUpdate(geometry => {
        geometry.addAttribute('position', new THREE.BufferAttribute(terrainVertices, 3)); 
        terrainMeshRef.current.attributes.position.needsUpdate = true;
        terrainMeshRef.current.computeBoundingBox();
    }, [terrainVertices]);
    
    return (
        <mesh 
            key='cube-mesh'
            material={meshMaterial}
            position={[0,0,0]}>
                <bufferGeometry attach='geometry' ref={terrainMeshRef} />
            </mesh>
    );
};

export default Terrain;