import {workActivities} from './work.js?v=month7';
import {advancedActivities} from './progression.js?v=month7';
export const activitySprites={
 sketch:{file:'mia-drawing-v02.png',label:'미아가 책상에서 연필로 그림을 그리는 모습',duration:4200,columns:4,rows:2,base:0,mask:'drawing',prepare:[0,1],loop:[2,3,4,3],finish:[6,7],contact:[1,2,3,4]},
 atelier:{file:'mia-drawing-v02.png',label:'미아가 연습한 색으로 작품을 그리는 모습',duration:4800,columns:4,rows:2,base:0,mask:'drawing',prepare:[0,1],loop:[2,3,4,3],finish:[5,6,7],contact:[1,2,3,4]},
 cook:{file:'mia-cooking-v02.png',label:'미아가 냄비에 담긴 수프를 젓는 모습',duration:4200,columns:4,rows:2,base:0,mask:'cooking',prepare:[0,1],loop:[2,3,4,5,4,3],finish:[6,7],contact:[1,2,3,4,5]},
 rest:{file:'mia-resting-v02.png',label:'미아가 은휘 인형 안에서 담요를 덮고 쉬는 모습',duration:4200,columns:4,rows:2,base:2,mask:'resting',prepare:[0,1],loop:[2,3,2,3],finish:[4,5],contact:[]},
 talk:{file:'mia-talking-v02.png',label:'미아가 의자에서 듣고 손짓하며 이야기하는 모습',duration:4200,columns:4,rows:2,base:0,mask:'talking',prepare:[0,1],loop:[2,3,5,4,5,3],finish:[6,7],contact:[],frameMs:220},
 chores:{file:'mia-cleaning-v02.png',label:'미아가 천을 쥔 손과 팔을 움직여 탁자를 닦는 모습',duration:4200,columns:4,rows:2,base:0,mask:'cleaning',prepare:[0,1],loop:[2,3,5,3],finish:[6,7],contact:[1,2,3,5],frameMs:180},
 walk:{file:'mia-walking-v04.png',label:'미아가 한강 공원에서 발을 딛고 부드럽게 산책하는 모습',duration:3950,outdoor:true,columns:4,rows:3,base:0,mask:'walking',prepare:[0],loop:[0,1,2,3,4,8,7,5,6,9,11],finish:[0],contact:[0,1,2,3,4,5,6,7,8,9,11],frameMs:125},
 picnic:{file:'mia-picnic-v02.png',label:'미아가 한강 피크닉에서 간식을 집어 먹고 내려놓는 모습',duration:4800,outdoor:true,columns:4,rows:2,base:0,mask:'picnic',prepare:[0,1],loop:[2,3,4,5,3,2],finish:[6,7],contact:[1,4,6],frameMs:260}
};
Object.assign(activitySprites,{
 observe:{file:'mia-observe-v01.png',label:'미아가 색을 관찰하고 종이에 선을 그은 뒤 여백을 가리키는 모습',duration:4800,columns:4,rows:2,base:0,zoom:.88,mask:'observing',prepare:[0,1],loop:[2,3,4,3,2,5],finish:[6,7],contact:[2,3,4],frameMs:220},
 meal:{file:'mia-meal-v01.png',label:'미아가 컵과 수건을 놓고 식탁의 접시를 정돈하는 모습',duration:4800,columns:4,rows:2,base:0,zoom:.88,mask:'setting',once:true,prepare:[0,1],loop:[2,3,4,5,6],finish:[6,7],contact:[1,3,4,5,6],frameMs:550},
 explore:{file:'mia-explore-v01.png',label:'미아가 지도를 살피고 손가락으로 탐색할 방향을 가리키는 모습',duration:4600,outdoor:true,columns:4,rows:2,base:0,zoom:.88,frameClips:{5:'inset(0 0 0 15%)'},mask:'exploring',prepare:[0,1],loop:[2,3,5,3,6],finish:[6,7],contact:[1,2,6],frameMs:400},
 stroll:{file:'mia-stroll-v01.png',label:'미아가 발을 딛고 팔과 몸을 천천히 늘려 몸을 푸는 모습',duration:4800,outdoor:true,columns:4,rows:2,base:0,zoom:.88,mask:'stretching',prepare:[0,1],loop:[2,3,4,5,4,3,2],finish:[6,7],contact:[],frameMs:440},
 wishbook:{file:'mia-wishbook-v01.png',label:'미아가 소원 수첩을 펼쳐 가리키고 상대에게 보여주는 모습',duration:4600,columns:4,rows:2,base:0,zoom:.88,mask:'notebook',prepare:[0,1],loop:[2,3,4,5,4,3],finish:[6,7],contact:[1,2,3,4,5,6],frameMs:380}
});
for(const a of workActivities)activitySprites[a.id]={...activitySprites[a.sprite],label:a.name+' 활동을 준비하는 미아'};
export function spriteMarkup(id){const c=activitySprites[id];return c?`<div class="activity-sprite" data-clip="${id}" data-mask="${c.mask||'still'}" style="--activity-sheet:url('assets/activity/${c.file}');--sheet-size:${(c.columns||2)*100}% ${(c.rows||2)*100}%" role="img" aria-label="${c.label}"><span class="activity-base" aria-hidden="true"></span><span class="activity-frame" aria-hidden="true"></span><span class="activity-effect" aria-hidden="true"></span><span class="activity-result-effect" aria-hidden="true"></span></div>`:'';}
