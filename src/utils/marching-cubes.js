const ISO_LEVEL = 0;

export const getTriTableIndex = (samples) => {
    let cubeIndex = 0;
    
    if(samples[0] > ISO_LEVEL) cubeIndex |= 1;
    if(samples[1] > ISO_LEVEL) cubeIndex |= 2;
    if(samples[2] > ISO_LEVEL) cubeIndex |= 4;
    if(samples[3] > ISO_LEVEL) cubeIndex |= 8;
    if(samples[4] > ISO_LEVEL) cubeIndex |= 16;
    if(samples[5] > ISO_LEVEL) cubeIndex |= 32;
    if(samples[6] > ISO_LEVEL) cubeIndex |= 64;
    if(samples[7] > ISO_LEVEL) cubeIndex |= 128;
    
    return cubeIndex;
};

export const arrayIsGreaterThan = (arr1, arr2) => arr1.reduce((acc, val, i) => {
    if(val > arr2[i]) return true;
    return false;
}, false);

export const arrayMax = (arr1, arr2) => arrayIsGreaterThan(arr1, arr2) ? arr1 : arr2;
export const arrayMin = (arr1, arr2) => arrayIsGreaterThan(arr1, arr2) ? arr2 : arr1;

export const interpolatePoints = (p1, p2, val1, val2) => {
    const high = arrayMax(p1, p2);
    const low = arrayMin(p1, p2);
    
    return [
      (high[0] - low[0]) / 2 + low[0],
      (high[1] - low[1]) / 2 + low[1],
      (high[2] - low[2]) / 2 + low[2] 
    ];
    
};