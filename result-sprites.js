// Every activity owns new drawn result poses: joy, calm completion, mistake, slump.
export const resultSprites=Object.fromEntries(['sketch','atelier','cook','meal','chores','talk','wishbook','observe','walk','picnic','explore','stroll'].map(id=>[id,{file:`mia-result-${id}-v01.png`,columns:4,rows:2,zoom:.88,frames:{great_success:[0,1],success:[2,3],failure:[4,5],disaster:[6,7]}}]));
export function resultSample(elapsed,clip,grade,{revealed=false,reduced=false}={}){
 const frames=clip.frames[grade]||clip.frames.success;
 const frame=(revealed||reduced||elapsed>=600)?frames[1]:frames[0];
 return {frame,phase:(revealed||reduced||elapsed>=1800)?'complete':'result',contact:false};
}
export const resultDuration=(id,clip)=>clip.duration+(resultSprites[id]?1200:0);
