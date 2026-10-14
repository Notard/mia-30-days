import {resultSprites,resultSample} from './result-sprites.js?v=month7';
import {resultRegistrations,resultRatios} from './result-registrations.js?v=month7';
import {activitySprites} from './activity-sprites.js?v=month7';
// Registered cells replace each other: never dissolve two hands together.
export function activitySample(elapsed,clip,{revealed=false,reduced=false,tired=false}={}){
 if(!clip.prepare)return {frame:0,phase:'still',contact:false};
 const prep=600,finish=600,end=clip.duration-finish;
 let phase='prepare',frame=clip.prepare[0];
 if(revealed||reduced||elapsed>=clip.duration){phase='complete';frame=clip.finish.at(-1);}
 else if(elapsed>=end){phase='finish';frame=clip.finish[Math.min(clip.finish.length-1,Math.floor((elapsed-end)/finish*clip.finish.length))];}
 else if(elapsed>=prep){phase='loop';const hold=(clip.frameMs||125)*(tired&&clip.mask!=='walking'?1.6:1);frame=clip.loop[clip.once?Math.min(clip.loop.length-1,Math.floor((elapsed-prep)/hold)):Math.floor((elapsed-prep)/hold)%clip.loop.length];}
 else frame=clip.prepare[Math.min(clip.prepare.length-1,Math.floor(Math.max(0,elapsed)/prep*clip.prepare.length))];
 return {frame,phase,step:phase==='loop'?Math.floor((elapsed-prep)/((clip.frameMs||125)*(tired&&clip.mask!=='walking'?1.6:1))):0,contact:clip.contact.includes(frame)&&phase!=='complete'};
}
export const cellPosition=(i,columns=4,rows=2)=>`${(i%columns)/(columns-1)*100}% ${Math.floor(i/columns)/(rows-1)*100}%`;
// Measured from the opaque furniture/foot baseline, in cell fractions.
// Measured sole centres after head registration, in 362px cells.
export const walkingGait={frames:[0,1,2,3,4,8,7,5,6,9,11],
 roots:[0,24.5,55.5,61,125,124,120.5,131.5,138,174,233.5].map(x=>x/362),
 stance:[244.5,220,189,183.5,119.5,120.5,242.5,231.5,225,189,129.5].map(x=>x/362),stride:241.5/362};
export function walkingOffset(sample,{reduced=false}={}){
 if(reduced)return 0;
 const end=walkingGait.stride*2;
 if(sample.phase==='prepare')return -end/2;
 if(sample.phase==='finish'||sample.phase==='complete')return end/2;
 const step=sample.step||0,cycle=Math.floor(step/walkingGait.frames.length),index=step%walkingGait.frames.length;
 return cycle*walkingGait.stride+walkingGait.roots[index]-end/2;
}
export const registrations={drawing:[[0,0],[0,0],[-.00338,0],[-.00677,0],[.00113,0],[0,0],[-.00226,0],[-.00677,0]],cooking:[[0,0],[.02367,0],[.04059,.00225],[.05524,.00225],[0,.01127],[.02706,.01127],[.04284,.01127],[.05862,.01127]],walking:[[0.0, 0.0027624309392265192], [0.03038674033149171, 0.0], [0.029005524861878452, 0.0], [0.0013812154696132596, 0.0], [-0.020718232044198894, 0.024861878453038673], [-0.031767955801104975, 0.022099447513812154], [-0.022099447513812154, 0.016574585635359115], [-0.020718232044198894, 0.019337016574585635], [-0.0055248618784530384, 0.03591160220994475], [-0.017955801104972375, 0.03038674033149171], [-0.027624309392265192, 0.027624309392265192], [-0.0055248618784530384, 0.03314917127071823]],picnic:[[0,0],[.00113,.00225],[.00113,0],[.00225,.00225],[.00113,.01804],[.00338,.01804],[.00113,.01804],[.00113,.01804]],cleaning:[[0,0],[0,0],[0,0],[-.00225,0],[0,.00225],[0,.00225],[0,.00225],[-.00225,.00225]],talking:[[0,0],[.06201,0],[.08005,0],[.07779,0],[0,0],[.06201,0],[.08005,0],[.07779,0]]};
Object.assign(registrations,{"observing":[[-0.02305,-0.01306],[-0.01587,-0.01306],[-0.01005,-0.01306],[-0.00482,-0.01306],[-0.02111,-0.00115],[-0.01264,-0.00115],[-0.00909,-0.00115],[-0.00758,-0.00115]],"setting":[[-0.00918,-0.01504],[-0.00353,-0.01504],[-0.00312,-0.01504],[-0.00145,-0.01504],[-0.009,-0.00115],[-0.00473,-0.00115],[-0.00336,-0.00115],[-0.00278,-0.00115]],"exploring":[[-0.13773,-0.01702],[0.00283,-0.01702],[0.07885,-0.01702],[0.11175,-0.01702],[-0.13268,-0.01504],[-0.0014,-0.01504],[0.07624,-0.01702],[0.11377,-0.01504]],"stretching":[[0.09794,0.01076],[0.09918,0.01076],[0.10142,0.01076],[0.09989,0.01076],[0.09857,0.00877],[0.09934,0.00877],[0.10148,0.00877],[0.09934,0.00877]],"notebook":[[-0.16065,-0.01504],[-0.03653,-0.01504],[0.03524,-0.01504],[0.12936,-0.01504],[-0.16027,-0.00512],[-0.04157,-0.00512],[0.03541,-0.00512],[0.12404,-0.00512]]});
let cleanup=()=>{};
export function mountActivityBlend(root){
 cleanup();const actor=root.querySelector('.activity-sprite');if(!actor)return;
 const scene=root.querySelector('.scene'),clip=activitySprites[actor.dataset.clip];
 const result=scene.dataset.result?resultSprites[actor.dataset.clip]:null;
 const layer=actor.querySelector('.activity-frame'),base=actor.querySelector('.activity-base');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let raf=0,elapsed=0,last=null,disposed=false,painted='';
 base.style.backgroundPosition=cellPosition(clip.base||0,clip.columns||2,clip.rows||2);
 const paint=()=>{
  const revealed=scene.classList.contains('outcome-revealed');
  const inResult=!!result&&(revealed||reduce.matches||elapsed>=clip.duration-600);
  const active=inResult?result:clip;
  const sample=inResult?resultSample(elapsed-(clip.duration-600),result,scene.dataset.result,{revealed,reduced:reduce.matches}):activitySample(elapsed,clip,{revealed,reduced:reduce.matches,tired:scene.dataset.expression==='tired'});
  actor.dataset.resultPose=String(inResult);
  if(inResult){actor.style.setProperty('--activity-sheet',`url('assets/activity/${result.file}')`);actor.style.setProperty('--sheet-size','400% 200%');}
  // Hold the planted sole in world space throughout each pose; only advance
  // when the foot changes pose. Continuous independent travel causes skating.
  if(clip.mask==='walking'&&!inResult)actor.style.setProperty('--walk-x',`${walkingOffset(sample,{reduced:reduce.matches})*actor.clientWidth}px`);
  const key=(inResult?'result:':'work:')+sample.frame+':'+sample.phase;if(key===painted)return;painted=key;
  layer.style.backgroundPosition=cellPosition(sample.frame,active.columns||2,active.rows||2);
  const offset=(inResult?resultRegistrations[actor.dataset.clip]:registrations[clip.mask])?.[sample.frame]||[0,0];
  const ratio=inResult?(resultRatios[actor.dataset.clip]||1):1;
  layer.style.transform=`translate(${offset[0]*100}%,${offset[1]*100}%)${active.zoom?` scale(${active.zoom*ratio},${active.zoom})`:''}`;
  layer.style.clipPath=inResult?'':clip.frameClips?.[sample.frame]||'';
  actor.dataset.frame=sample.frame;actor.dataset.phase=sample.phase;actor.dataset.contact=String(sample.contact);
 };
 const tick=now=>{
  if(disposed)return;
  if(scene.classList.contains('activity-ready')){if(last!==null)elapsed+=Math.min(100,now-last);paint();}
  last=now;
  if(actor.dataset.phase==='complete'||actor.dataset.phase==='still'){raf=0;return;}
  raf=requestAnimationFrame(tick);
 };
 const resume=()=>{cancelAnimationFrame(raf);raf=0;last=null;if(disposed)return;paint();if(!document.hidden&&!reduce.matches&&clip.prepare&&actor.dataset.phase!=='complete')raf=requestAnimationFrame(tick);};
 const observer=new MutationObserver(()=>{if(scene.classList.contains('outcome-revealed')){cancelAnimationFrame(raf);raf=0;paint();}});
 observer.observe(scene,{attributes:true,attributeFilter:['class']});
 document.addEventListener('visibilitychange',resume);reduce.addEventListener('change',resume);resume();
 cleanup=()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect();document.removeEventListener('visibilitychange',resume);reduce.removeEventListener('change',resume);};
}
