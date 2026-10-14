const sprites={neutral:'mia-indoor-transparent-v01.png',happy:'mia-happy-small-mouth-v03.png',sad:'mia-sad-v01.png',tired:'mia-tired-v01.png'};
let cleanup=()=>{};
export function mountCharacterMotion(root,previous){
 cleanup();
 const scene=root.querySelector('.scene');if(!scene)return;
 if(!scene.classList.contains('has-outcome')&&scene.classList.contains('has-activity-sprite'))scene.classList.add('activity-ready');
 const expression=scene.dataset.expression||'neutral';
 scene.style.setProperty('--sprite',`url('assets/${sprites[expression]||sprites.neutral}')`);
 if(previous){scene.classList.add('is-update');scene.style.setProperty('--old-sprite',`url('assets/${sprites[previous]||sprites.neutral}')`);}
 for(const host of scene.querySelectorAll('.mia:not(.wardrobe-avatar),.face')){
  const art=document.createElement('span');art.className='sprite-art';art.setAttribute('aria-hidden','true');

  if(previous&&previous!==expression){const old=document.createElement('span');old.className='expression-old';art.append(old);}
  host.append(art);
 }
 const blink=new Image();blink.src='assets/mia-blink-v01.png';
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');let timer,opening,gesture,disposed=false;
 // Let a new choice's gesture finish before Mia returns inside Eunhwi for the night.
 if(scene.dataset.rest==='true'&&previous&&previous!==expression&&['happy','sad'].includes(expression)&&!reduce.matches&&!document.hidden){
  scene.classList.add('reaction-gesture');gesture=setTimeout(()=>scene.classList.remove('reaction-gesture'),2300);
 }
 const clear=()=>{clearTimeout(timer);clearTimeout(opening);scene.classList.remove('is-blinking');};
 const schedule=()=>{clear();scene.classList[document.hidden?'add':'remove']('motion-paused');if(document.hidden||reduce.matches){clearTimeout(gesture);scene.classList.remove('reaction-gesture');}if(disposed||document.hidden||reduce.matches)return;timer=setTimeout(()=>{
   if(blink.complete&&blink.naturalWidth){scene.classList.add('is-blinking');opening=setTimeout(()=>{scene.classList.remove('is-blinking');schedule();},145);}
   else schedule();
  },3200+Math.random()*3600);};
 document.addEventListener('visibilitychange',schedule);reduce.addEventListener('change',schedule);schedule();
 cleanup=()=>{disposed=true;clear();clearTimeout(gesture);document.removeEventListener('visibilitychange',schedule);reduce.removeEventListener('change',schedule);};
}
