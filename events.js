import {upgradeState,statValue} from './growth.js';
import {eventFor} from './event-data.js';
export {eventFor};
export function chooseEvent(s,id){
 if(s.phase!=='event')return s;
 const event=eventFor(s),choice=event.choices.find(c=>c.id===id);
 if(!choice||['money','energy'].some(k=>s[k]+(choice.delta[k]||0)<0))return s;
 const n=upgradeState(s),delta={};
 for(const [k,v] of Object.entries(choice.delta)){
  n[k]=Math.max(0,Math.min(k==='money'?200:100,n[k]+v));delta[k]=n[k]-statValue(s,k);
 }
 if(choice.flag)n.flags[choice.flag]=true;
 const mood=(choice.delta.trust||0)<0||n.day===4&&id==='b'&&event.id!=='welcome-setback'?'sad':n.energy<25?'tired':choice.mood;
 n.history.push({day:n.day,slot:2,title:event.title,text:choice.label+' — '+choice.desc+' 미아: “'+choice.reply+'”',delta,eventId:event.id,choiceId:id,reply:choice.reply,mood});
 n.eventChoice=id;n.notice=choice.desc;n.phase='night';return n;
}
export function nextDay(s){
 if(s.phase!=='night')return s;
 const n=upgradeState(s);
 if(n.day===7){n.phase='end';return n;}
 n.day++;n.slot=0;n.phase='schedule';n.eventChoice=null;
 const recovery=n.health<40?12:n.health>=80?22:18;
 const gain=Math.min(recovery,100-n.energy);n.energy+=gain;n.health=Math.min(100,n.health+2);n.morale=Math.min(100,n.morale+2);
 n.notice=`${n.day}일째. 밤사이 기운 ${gain}, 건강·기분 최대 2 회복. 오늘은 무엇을 해 볼까요?`;return n;
}
