export const growthDefaults={health:60,morale:60,focus:5,curiosity:5,independence:5};
export const skillKeys=['art','cook','courage','trust'];
export const growthKeys=Object.keys(growthDefaults);
export const statKeys=[...skillKeys,...growthKeys];
export const statNames={art:'표현',cook:'생활',courage:'용기',trust:'신뢰',health:'건강',morale:'기분',focus:'집중',curiosity:'호기심',independence:'자립',energy:'기운',money:'돈'};
export const statNotes={art:'18부터 작업실 활동',cook:'요리와 집안일에 익숙해져요',courage:'18부터 한강 피크닉',trust:'마음을 편하게 나누는 사이',health:'75부터 강변 몸풀기 · 밤 회복 12~22',morale:'75부터 소원 수첩 · 25 미만 성장 절반',focus:'25부터 관찰 그림 해금 · 그림·생활 +2',curiosity:'25부터 탐색길 해금 · 용기 +2',independence:'25부터 한 끼 해금 · 집안일 수입 +3'};
export const activityGrowth={rest:{health:7,morale:5,focus:2},sketch:{focus:6,curiosity:3,morale:2,health:-1},cook:{independence:5,focus:3,morale:2,health:-2},walk:{health:3,curiosity:7,morale:4},talk:{morale:8,curiosity:2},chores:{independence:7,focus:3,morale:-4,health:-2},atelier:{focus:9,curiosity:4,morale:-2,health:-2},picnic:{curiosity:9,independence:3,health:2,morale:7}};
Object.assign(activityGrowth,{observe:{focus:7,curiosity:4,morale:1,health:-1},explore:{curiosity:7,independence:4,health:2,morale:3},meal:{independence:7,focus:4,morale:3,health:-2},stroll:{health:5,morale:5},wishbook:{morale:4,focus:3,independence:3}});
const cap=(v,max=100)=>Math.max(0,Math.min(max,v));
export const statValue=(s,k)=>s[k]??growthDefaults[k]??0;
export function upgradeState(s){
 if(s.version===3)return structuredClone(s);
 const n=structuredClone(s);Object.assign(n,growthDefaults);n.version=3;
 // Recover the new traits from the already saved experiences, preserving turns.
 for(const h of n.history){const d=activityGrowth[h.activityId]||{};for(const k of growthKeys)n[k]=cap(n[k]+(d[k]||0));}
 return n;
}
export function activityDelta(s,a,grade='success'){
 const delta={money:-a.cost,energy:-a.energy,...a.gains,...activityGrowth[a.id]};
 if(delta.art>0&&statValue(s,'focus')>=25)delta.art+=2;
 if(delta.cook>0&&statValue(s,'focus')>=25)delta.cook+=2;
 if(delta.courage>0&&statValue(s,'curiosity')>=25)delta.courage+=2;
 if(a.id==='chores'&&statValue(s,'independence')>=25)delta.money+=3;
 if(s.energy<25||statValue(s,'morale')<25)for(const k of ['art','cook','courage','focus','curiosity','independence'])if(delta[k]>0)delta[k]=Math.floor(delta[k]/2);
 if(a.id!=='rest'&&grade!=='success'){
  const factor=grade==='great_success'?1.6:grade==='failure'?.35:-.25;
  for(const k of ['art','cook','courage','trust','focus','curiosity','independence','health'])if(delta[k]>0)delta[k]=factor<0?-Math.max(1,Math.ceil(delta[k]*-factor)):Math.max(1,Math.round(delta[k]*factor));
  if(delta.money>0)delta.money=grade==='disaster'?0:Math.round(delta.money*(grade==='great_success'?1.5:.5));
  if(grade==='failure'||grade==='disaster'){delta.energy-=(grade==='failure'?2:5);delta.morale=Math.min(delta.morale||0,grade==='failure'?-4:-9);if(grade==='disaster')delta.health=Math.min(delta.health||0,-3);}
  else delta.morale=(delta.morale||0)+3;
 }
 return Object.fromEntries(Object.entries(delta).map(([k,v])=>[k,cap(statValue(s,k)+v,k==='money'?200:100)-statValue(s,k)]));
}
export function eventGrowth(s,c){
 const d={...c.delta};
 d.morale=(d.trust||0)>0?4:(d.trust||0)<0?-5:(d.energy||0)>0?3:0;
 d.health=(d.energy||0)>0?3:(d.energy||0)<0?-2:0;
 d.focus=(d.art||0)>0||(d.cook||0)>0?3:0;
 d.curiosity=s.day===2&&c.id==='b'?5:s.day===3&&c.id==='b'?4:(d.courage||0)>0?3:0;
 d.independence=s.day===4?(c.id==='a'?6:-3):s.day===5&&c.id==='a'?7:2;
 return d;
}
export function growthProfile(s){
 const traits=['focus','curiosity','independence'].sort((a,b)=>statValue(s,b)-statValue(s,a));
 const top=traits[0],value=statValue(s,top);
 const profiles={focus:['차근차근 몰입하는 미아','같은 일을 조금 더 오래 붙잡는 힘이 생겼어요. 다음에는 더 큰 그림이나 차분히 만드는 요리에 도전해 볼 수 있어요.'],curiosity:['새로운 것을 발견하는 미아','산책길과 준비물에서 새로운 쓰임을 찾아내요. 다음에는 미아가 고른 길을 함께 따라가 보기로 했어요.'],independence:['스스로 해보는 미아','정리와 준비를 자기 손으로 해보는 경험이 쌓였어요. 도움을 청할 때와 혼자 해볼 때도 조금씩 고르게 됐어요.']};
 const [title,text]=value>=25?profiles[top]:['취향을 찾는 미아','아직 가장 좋아하는 방식을 알아가는 중이에요. 다음 일주일에도 쉬어 가며 여러 일을 함께 골라 봐요.'];
 return {title,text,top,value};
}

export function activityRanges(s,a){const grades=a.id==='rest'?['success']:['great_success','success','failure','disaster'];const variants=grades.map(g=>activityDelta(s,a,g));const keys=[...new Set(variants.flatMap(d=>Object.keys(d)))];return Object.fromEntries(keys.map(k=>[k,{min:Math.min(...variants.map(d=>d[k]||0)),max:Math.max(...variants.map(d=>d[k]||0))}]).filter(([,r])=>r.min||r.max));}
