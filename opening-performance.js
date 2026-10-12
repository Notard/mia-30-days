// Registered regions in the existing atlas. Feet and background never move.
const cast={
 camiael:{offset:99.929,head:'120,8 330,8 330,200 260,224 186,216 120,176',pivot:[233,199],arm:'132,247 169,248 203,428 246,488 265,523 234,550 189,536 159,466 139,379',armPivot:[166,258],eyes:[[202,132,-14],[251,122,-10]],mouth:[234,160,14,8],mouthAngle:-12,aperture:[4.5,3.8],skin:'#fff0e5',portrait:[150,49,166,166]},
 seira:{offset:539.6,head:'140,6 322,6 322,168 270,199 180,198 140,163',pivot:[225,193],arm:'0,229 60,230 81,250 108,235 140,251 121,333 92,350 63,313 48,286 0,267',armPivot:[124,250],eyes:[[193,118,-14],[240,106,-10]],mouth:[224,146,15,9],mouthAngle:-19,aperture:[4.5,3.8],skin:'#ffefdf',portrait:[143,40,166,166]},
 arika:{offset:1023.255,head:'78,253 309,253 309,440 264,468 145,473 78,436',pivot:[197,465],arm:'216,478 257,461 253,444 273,421 292,431 312,454 334,451 349,473 323,515 331,550 325,586 287,605 257,578 243,532',armPivot:[251,502],eyes:[[167,403,-12],[216,389,-10]],mouth:[198,427,21,18],mouthAngle:-15,aperture:[5,4],skin:'#ffecdd',portrait:[115,335,166,166]}
};
const image=(offset)=>`<image href="assets/activity/opening-cast-v01.png" x="${-offset}" y="0" width="1536" height="1024"/>`;
// All lip shapes and their cover share the face's original tilted local plane.
function mouthRig(c){
 const [x,y,rx,ry]=c.mouth,[width,height]=c.aperture;
 return `<g class="cast-mouth-plane" transform="translate(${x} ${y}) rotate(${c.mouthAngle})"><ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="${c.skin}"/><path class="cast-closed-mouth" d="M-4 0 L4 0" stroke="#995f62" stroke-width="1.4" fill="none" stroke-linecap="round"/><g class="cast-open-mouth"><ellipse cx="0" cy="0" rx="${width}" ry="${height}" fill="#854d57"/><ellipse cx="0" cy="${height*.5}" rx="${width*.6}" ry="${height*.24}" fill="#d995a0"/></g></g>`;
}
export function castRig(id,portrait=false){
 const c=cast[id],uid=`opening-${id}-${portrait?'portrait':'body'}`,head=c.head,arm=c.arm;
 const [x,y,rx,ry]=c.mouth,view=portrait?c.portrait.join(' '):'0 0 460.8 1024';
 const lids=c.eyes.map(([ex,ey,angle])=>`<g transform="rotate(${angle} ${ex} ${ey})"><ellipse cx="${ex}" cy="${ey}" rx="18" ry="12" fill="${c.skin}"/><path d="M${ex-13} ${ey} Q${ex} ${ey+7} ${ex+13} ${ey-1}" fill="none" stroke="#745452" stroke-width="2.2" stroke-linecap="round"/></g>`).join('');
 const face=`<g class="cast-cheeks" fill="#ef9c9e"><ellipse cx="${x-32}" cy="${y-5}" rx="14" ry="6"/><ellipse cx="${x+30}" cy="${y-12}" rx="14" ry="6"/></g><g class="cast-lids">${lids}</g>${mouthRig(c)}`;
 // Portraits show one continuous drawing, including the neck, neckline and hand.
 // Arika's short neck/raised arm cannot safely use disjoint cutout regions.
 if(portrait||id==='arika')return `<svg class="cast-rig ${portrait?'cast-portrait-rig':''}" viewBox="${view}" aria-hidden="true" focusable="false"><g class="cast-whole" data-pivot="${portrait?c.pivot.join(' '):'198 990'}" data-motion-scale="${portrait?1:.12}">${image(c.offset)}${face}</g></svg>`;
 return `<svg class="cast-rig ${portrait?'cast-portrait-rig':''}" viewBox="${view}" aria-hidden="true" focusable="false"><defs><clipPath id="${uid}-head"><polygon points="${head}"/></clipPath><clipPath id="${uid}-arm"><polygon points="${arm}"/></clipPath><mask id="${uid}-body" maskUnits="userSpaceOnUse" x="0" y="0" width="461" height="1024"><rect width="461" height="1024" fill="white"/><polygon points="${head}" fill="black"/><polygon points="${arm}" fill="black"/></mask></defs><g mask="url(#${uid}-body)">${image(c.offset)}</g><g class="cast-arm" data-pivot="${c.armPivot.join(' ')}"><g clip-path="url(#${uid}-arm)">${image(c.offset)}</g></g><g class="cast-head" data-pivot="${c.pivot.join(' ')}"><g clip-path="url(#${uid}-head)">${image(c.offset)}</g>${face}</g></svg>`;
}
// Word timestamps from the four locally audited Qwen recordings.
export const openingBeats={
 0:[{at:0,emotion:'gentle',gesture:'ask'},{at:1.46,emotion:'warm',gesture:'nod'},{at:4.78,emotion:'curious',gesture:'listen'},{at:6.54,emotion:'warm',gesture:'nod'}],
 1:[{at:0,emotion:'gentle',gesture:'explain'},{at:2.02,emotion:'gentle',gesture:'reassure'},{at:3.7,emotion:'curious',gesture:'explain'},{at:6.66,emotion:'warm',gesture:'nod'}],
 2:[{at:0,emotion:'bright',gesture:'wave'},{at:3.02,emotion:'sheepish',gesture:'shy'},{at:5.28,emotion:'sheepish',gesture:'small-wave'}],
 3:[{at:0,emotion:'gentle',gesture:'reassure'},{at:3.76,emotion:'warm',gesture:'nod'},{at:8.16,emotion:'curious',gesture:'listen'},{at:9.16,emotion:'warm',gesture:'nod'}]
};
export function performanceAt(index,time){const beats=openingBeats[index]||[];return beats.findLast(b=>b.at<=time)||beats[0]||{at:0,emotion:'gentle',gesture:'listen'};}
export function poseAt(beat,time){
 const age=Math.max(0,time-beat.at),enter=Math.min(1,age/.35),ease=enter*enter*(3-2*enter),pulse=Math.sin(Math.min(age,1.2)/1.2*Math.PI)**2;
 const p={head:0,headY:0,arm:0,armY:0};
 if(beat.gesture==='nod'){p.head=1.3*pulse;p.headY=2.5*pulse;}
 if(beat.gesture==='ask')p.head=-.65*ease;
 if(beat.gesture==='listen'){p.head=-1.4*ease;p.arm=-.6*ease;}
 if(beat.gesture==='explain'){p.head=.35*ease;p.arm=-3.4*ease;p.armY=-2*ease;}
 if(beat.gesture==='reassure'){p.head=.75*ease;p.arm=1.8*ease;}
 if(beat.gesture==='wave'){p.head=-.9*ease;p.arm=4*Math.sin(age*5)*ease*Math.exp(-age/3);}
 if(beat.gesture==='shy'){p.head=2.4*ease;p.headY=3*ease;p.arm=-3*ease;}
 if(beat.gesture==='small-wave'){p.head=1.2*ease;p.arm=1.9*Math.sin(age*4)*ease*Math.exp(-age/2);}
 return p;
}
let cleanup=()=>{};
const controllers=new WeakMap();
export function updateOpeningSpeech(scene,time,amount){controllers.get(scene)?.update(time,amount);}
export function stopOpeningSpeech(scene){controllers.get(scene)?.stop();}
export function startOpeningText(scene){controllers.get(scene)?.text();}
export function mountOpeningPerformance(root){
 cleanup();cleanup=()=>{};const scene=root.querySelector('.opening-screen .scene');if(!scene||scene.dataset.cast==='mia')return;
 const hosts=[...scene.querySelectorAll('.opening-person.active,.opening-portrait')];if(!hosts.length)return;
 const parts=hosts.flatMap(host=>['head','arm','whole'].flatMap(kind=>[...(host.querySelectorAll?.('.cast-'+kind)||[])].map(node=>({node,kind,pivot:node.getAttribute('data-pivot'),scale:Number(node.getAttribute('data-motion-scale')||1)}))));
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),index=Number(scene.dataset.opening);
 let frame=0,last=0,clock=0,disposed=false,speaking=false,synthetic=false,time=0,mouth=0,target=0,nextBlink=2.6+Math.random()*2,blinkAt=-10;
 let pose={head:0,headY:0,arm:0,armY:0},beat=performanceAt(index,0);
 const paint=(dt)=>{
  if(synthetic&&speaking){time+=dt;target=time<12?Math.max(0,Math.sin(time*18))*.55:0;if(time>=12){speaking=false;synthetic=false;}}
  beat=performanceAt(index,time);const wanted=speaking?poseAt(beat,time):{head:0,headY:0,arm:0,armY:0};
  const blend=1-Math.exp(-dt*9);for(const key in pose)pose[key]+=(wanted[key]-pose[key])*blend;
  mouth+=(target-mouth)*(1-Math.exp(-dt*(target>mouth?28:18)));
  if(clock>=nextBlink){blinkAt=clock;nextBlink=clock+3.1+Math.random()*3.6;}
  const blink=Math.max(0,1-Math.abs((clock-blinkAt-.085)/.085));
  for(const {node,kind,pivot,scale} of parts){const key=kind==='whole'?'head':kind;node.setAttribute('transform',`translate(0 ${reduce.matches?0:(pose[key+'Y']*scale).toFixed(3)}) rotate(${reduce.matches?0:(pose[key]*scale).toFixed(3)} ${pivot})`);}
  for(const host of hosts){host.dataset.emotion=beat.emotion;host.dataset.gesture=beat.gesture;host.dataset.talking=String(speaking);host.style.setProperty('--cast-mouth',reduce.matches?'0':mouth.toFixed(3));host.style.setProperty('--cast-blink',reduce.matches?'0':blink.toFixed(3));host.style.setProperty('--cast-head',`${reduce.matches?0:pose.head.toFixed(3)}deg`);host.style.setProperty('--cast-head-y',`${reduce.matches?0:pose.headY.toFixed(3)}px`);host.style.setProperty('--cast-arm',`${reduce.matches?0:pose.arm.toFixed(3)}deg`);host.style.setProperty('--cast-arm-y',`${reduce.matches?0:pose.armY.toFixed(3)}px`);}
 };
 const tick=now=>{if(disposed||document.hidden||reduce.matches)return;const dt=Math.min(.06,last?(now-last)/1000:.016);last=now;clock+=dt;paint(dt);frame=requestAnimationFrame(tick);};
 const schedule=()=>{cancelAnimationFrame(frame);frame=0;last=0;scene.classList.toggle('opening-motion-paused',document.hidden||reduce.matches);if(!disposed&&!document.hidden&&!reduce.matches)frame=requestAnimationFrame(tick);else{target=0;mouth=0;paint(1);}};
 controllers.set(scene,{update(t,a){time=t;target=Math.max(0,Math.min(1,a));speaking=true;synthetic=false;if(reduce.matches)paint(1);},stop(){speaking=false;synthetic=false;target=0;if(reduce.matches||document.hidden){mouth=0;paint(1);}},text(){time=0;speaking=true;synthetic=true;}});
 document.addEventListener('visibilitychange',schedule);reduce.addEventListener('change',schedule);paint(1);schedule();
 cleanup=()=>{disposed=true;cancelAnimationFrame(frame);controllers.delete(scene);document.removeEventListener('visibilitychange',schedule);reduce.removeEventListener('change',schedule);};
}
