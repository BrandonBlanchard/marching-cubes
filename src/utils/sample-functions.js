import { Noise } from 'noisejs';
const noise = new Noise(Math.random());

// Takes in a sample position (x,y,z) and returns a value
export const concentricSpheres = (x, y, z, cx = 0,cy = 0,cz = 0) => Math.sin(
                                                            Math.sqrt(
                                                                Math.pow(x - cx, 2) +
                                                                Math.pow(y - cy, 2) +
                                                                Math.pow(z - cz, 2)));

export const concentricSpheresFat = (x,y,z,cx = 0,cy = 0,cz = 0) => Math.sqrt(
                                            Math.pow(x - cx, 2) +
                                            Math.pow(y - cy, 2) + 
                                            Math.pow(z - cz, 2)) % 10 - 2;
                                            
export const concentricRingsFlat = (x,y,z,cx = 0,cy = 0,cz = 0) => {
    const upper = 8;
    const lower = 4;
    
    if(y > lower && y < upper) {    
        return Math.sqrt(
            Math.pow(x - cx, 2) + 
            Math.pow(z - cz, 2)
            ) % 5 - 3;
    }
    
    return 1;
};
                                            
export const concentricRingsXYZ = (x,y,z,cx = 0,cy = 0,cz = 0) => {
    const upper = 1;
    const lower = -1;
    
    if(y > lower && y < upper) {    
        return Math.sqrt(
            Math.pow(x - cx, 2) + 
            Math.pow(z - cz, 2)
            ) % 5 - 3;
    }
    
    if(x > lower && x < upper) {
        return Math.sqrt(
            Math.pow(y - cy, 2) + 
            Math.pow(z - cz, 2)
            ) % 5 - 3;
    }
    
    if(z > lower && z < upper) {
        return Math.sqrt(
            Math.pow(x - cx, 2) + 
            Math.pow(y - cy, 2)
            ) % 5 - 3;
    }
    
    return 1;
};

export const sinWave = (x,y,z,cx = 0,cy = 0,cz = 0) => {
    const height = Math.sin(
                    Math.sqrt(
                        Math.pow(x - cx, 2) + 
                        Math.pow(z - cz, 2))) * 2 + 5;
    
    if(y < height) { return 1; }
    return -1;
}

export const sampleTerrain = (x,y,z) => {
    if(y < 0) { return 1; }
    
    const nx = x/30 * 0.5;
    const nz = z/30 * 0.5;
    
    const height = 2.1 * noise.simplex2(nx,nz) +
                   1.22 * noise.simplex2(nx * 2, nz * 2) +
                   1.3 * noise.simplex2(nx * 4, nz * 4);
    const adjustedHeight = Math.pow(height, 2.11);
                   
    if(y < adjustedHeight) return 1;
    
    return -1;
};

export const sampleFunctions = {
    "sine wave": sinWave,
    "concentric rings xyz": concentricRingsXYZ,
    "concentric rings flat": concentricRingsFlat,
    "concentric spheres": concentricSpheres,
    "concentric spheres fat": concentricSpheresFat,
    "terrain": sampleTerrain
};