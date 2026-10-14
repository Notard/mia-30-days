import {workActivities} from './work.js?v=month7';
import {resultSprites,resultDuration} from './result-sprites.js?v=month7';
import {resultGrades,resultDescription} from './activity-results.js?v=month7';
import {advancedActivities,unlocks} from './progression.js?v=month7';
import {activitySprites} from './activity-sprites.js?v=month7';
import {statNames,statValue} from './growth.js?v=month7';
export {statNames};
const performances={sketch:['✏️','연필로 창밖의 빛을 따라 그려요.'],atelier:['🖌️','연습한 색을 큰 그림에 담아요.'],cook:['🍳','천천히 저으며 맛을 살펴요.'],chores:['🧹','작은 자리부터 차근차근 정리해요.'],walk:['👣','한강 길을 따라 천천히 걸어요.'],picnic:['🧺','한강에서 고른 간식을 함께 먹어요.'],talk:['💬','서로의 이야기에 귀를 기울여요.'],rest:['🧸','은휘 안에서 편안히 숨을 고르고 있어요.']};
for(const a of advancedActivities)performances[a.id]=[a.icon,a.caption];
for(const a of workActivities)performances[a.id]=[a.icon,a.desc];
export function outcomeFor(before,after,id){
 if(before===after)return null;
 const entry=after.history.at(-1),performance=performances[id]||['💌','미아가 선택에 담긴 마음을 받아들여요.'];
 return {id,title:entry.title,reply:entry.reply,entry,icon:performance[0],caption:entry.result&&id!=='rest'?resultDescription(id,entry.result.grade):performance[1],result:entry.result&&id!=='rest'?{...entry.result,label:resultGrades[entry.result.grade].label}:null,before:Object.fromEntries(Object.keys(statNames).map(k=>[k,statValue(before,k)])),delta:Object.fromEntries(Object.keys(statNames).map(k=>[k,after[k]-statValue(before,k)])),unlocks:unlocks.filter(u=>statValue(before,u.stat)<u.value&&statValue(after,u.stat)>=u.value).map(u=>u.id)};
}
let clean=()=>{};
export function mountOutcome(root,outcome,onReady){
 clean();if(!outcome)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const scene=root.querySelector('.scene'),button=root.querySelector('[data-action="result-next"]');
 let activityFrame,frame,disposed=false,elapsed=0,last=null,started=false,done=false;
 scene.scrollIntoView({behavior:reduce?'instant':'smooth',block:'start'});
 const reveal=()=>{
  if(disposed||done)return;done=true;scene.classList.add('outcome-revealed');onReady();
  const start=performance.now(),duration=reduce?0:1100;
  const tick=()=>{if(disposed)return;const p=duration?Math.min(1,(performance.now()-start)/duration):1;
   for(const [k,v] of Object.entries(outcome.delta)){
    const value=outcome.before[k]+Math.round(v*(1-(1-p)**3));
    root.querySelectorAll(`[data-stat-value="${k}"]`).forEach(n=>n.textContent=value);
    root.querySelectorAll(`[data-stat-fill="${k}"]`).forEach(n=>n.style.width=value+'%');
   }
   if(p<1)frame=requestAnimationFrame(tick);else{button.disabled=false;button.textContent=button.dataset.label;root.querySelector('.outcome-status').textContent='';}
  };tick();
 };
 const clip=activitySprites[outcome.id];
 const advance=now=>{if(disposed||done)return;if(last!==null)elapsed+=Math.min(100,now-last);last=now;if(elapsed>=(clip?resultDuration(outcome.id,clip):1300))reveal();else activityFrame=requestAnimationFrame(advance);};
 const visibility=()=>{cancelAnimationFrame(activityFrame);last=null;if(started&&!done&&!disposed&&!document.hidden)activityFrame=requestAnimationFrame(advance);};
 document.addEventListener('visibilitychange',visibility);
 const start=()=>{if(disposed)return;started=true;scene.classList.add('activity-ready');if(reduce)reveal();else visibility();};

 const preloads=[];
 if(clip){const files=[clip.file,...(outcome.result&&resultSprites[outcome.id]?[resultSprites[outcome.id].file]:[])];let pending=files.length;
  for(const file of files){const img=new Image();preloads.push(img);const loaded=()=>{if(--pending===0)start();};img.onload=loaded;img.onerror=()=>{scene.classList.add('activity-failed');loaded();};img.src='assets/activity/'+file;}
 }else start();
 clean=()=>{disposed=true;for(const img of preloads){img.onload=null;img.onerror=null;}cancelAnimationFrame(activityFrame);cancelAnimationFrame(frame);document.removeEventListener('visibilitychange',visibility);};
}
