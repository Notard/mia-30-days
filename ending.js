import {growthProfile,statValue} from './growth.js';
import {balancedScene,endingScenes} from './ending-scenes.js';
import {storyEpilogueFor} from './story-arcs.js';
import {welcomeProject,celebrationFor} from './welcome.js';

const titles={art:'작은 그림전',cook:'함께 만든 식탁',courage:'한강의 작은 탐험',home:'편안한 우리집'};
const paths={balanced:'여러 경험이 모인 날',self:'스스로 준비한 날',open:'함께 연 작은 모임',quiet:'가까이 나눈 하루',rest:'쉬어 가는 마무리',lesson:'함께 고르는 연습',learning:'마음을 알아가는 중',novice:'다음 소원을 찾은 날'};

export function endingFor(s){
 const goal=s.goal||'art',art=statValue(s,'art'),cook=statValue(s,'cook'),courage=statValue(s,'courage');
 const trust=statValue(s,'trust'),energy=statValue(s,'energy'),health=statValue(s,'health');
 const main=goal==='home'?trust:statValue(s,goal),quiet=!!s.flags?.quiet;
 const project=welcomeProject(s);
 const full=s.welcomeVersion===1?project.ready&&trust>=35&&energy>=25:goal==='home'?trust>=55&&energy>=25:main>=40&&trust>=35&&energy>=25;
 const dayFiveChoice=s.history?.find(h=>h.day===5&&h.slot===2)?.choiceId;
 const selfLed=statValue(s,'independence')>=40&&dayFiveChoice==='a';
 const balanced=[art,cook,courage].every(v=>v>=18)&&trust>=45&&health>=60;

 let path;
 if(energy<25)path='rest';
 else if(full)path=balanced?'balanced':selfLed?'self':quiet?'quiet':'open';
 else if(goal==='home')path='learning';
 else if(main>=40&&trust<35)path='lesson';
 else path='novice';

 const scene=path==='balanced'?balancedScene:endingScenes[goal][path];
 const grade=['balanced','self','open','quiet'].includes(path)?'S':path==='rest'?'A':path==='lesson'||path==='learning'?'B':'C';
 const achievements=[];
 if(art>=18)achievements.push('작업실 활동 열림');
 if(courage>=18)achievements.push('피크닉 열림');
 if(trust>=55)achievements.push('신뢰의 동행');
 if([art,cook,courage].every(v=>v>=18))achievements.push('균형 잡힌 하루');
 if((s.counts?.rest||0)>=4)achievements.push('쉼의 습관');
 const growth=growthProfile(s);
 if(growth.value>=25)achievements.push(growth.title);
 if(health>=80)achievements.push('몸을 돌보는 습관');
 if(statValue(s,'morale')>=80)achievements.push('마음이 편안한 일주일');
 const id=path==='open'||path==='quiet'?`${goal}-full-${path}`:`${goal}-${path}`;
 const epilogue=storyEpilogueFor(s);
 return {growth,id,goal,path,reached:full,celebration:celebrationFor(s),badge:paths[path],title:`${titles[goal]} — ${scene.title}`,text:scene.text+(epilogue?' '+epilogue:''),grade,achievements};
}
