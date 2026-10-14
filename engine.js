import {advancedActivities} from './progression.js';
import {growthKeys,statKeys} from './growth.js';
import {validWardrobe} from './wardrobe.js';
export {activities,availability,newGame,applyActivity as act} from './actions.js';
export {eventFor,chooseEvent,nextDay} from './events.js';
export {endingFor} from './ending.js';

const goals=['art','cook','courage','home'];
const phases=['schedule','event','night','end'];
const bounded=(v,max)=>Number.isInteger(v)&&v>=0&&v<=max;
export function validateState(s){
  if(!s||typeof s!=='object'||![2,3].includes(s.version)||!goals.includes(s.goal)||!phases.includes(s.phase))return false;
  if(s.welcomeVersion!==undefined&&s.welcomeVersion!==1||s.wardrobe!==undefined&&!validWardrobe(s.wardrobe))return false;
  if(!bounded(s.day,7)||s.day<1||!bounded(s.slot,2))return false;
  if(s.phase==='schedule'&&s.slot===2||s.phase!=='schedule'&&s.slot!==2||s.phase==='end'&&s.day!==7)return false;
  if(s.version===3&&!growthKeys.every(k=>bounded(s[k],100)))return false;
  if(s.version===2&&!growthKeys.every(k=>s[k]===undefined||bounded(s[k],100)))return false;
  if(!['energy','art','cook','courage','trust'].every(k=>bounded(s[k],100))||!bounded(s.money,200))return false;
  if(!Array.isArray(s.history)||s.history.length>21||typeof s.notice!=='string'||s.notice.length>1000)return false;
  if(!s.counts||!s.flags||typeof s.counts!=='object'||typeof s.flags!=='object')return false;
  if(!Object.entries(s.counts).every(([k,v])=>['rest','sketch','cook','walk','talk','chores','atelier','picnic',...advancedActivities.map(a=>a.id)].includes(k)&&bounded(v,14)))return false;
  if(Object.values(s.counts).reduce((a,b)=>a+b,0)!==(s.day-1)*2+s.slot)return false;
  if(!Object.entries(s.flags).every(([k,v])=>['presented','quiet'].includes(k)&&typeof v==='boolean'))return false;
  const completedEvent=s.phase==='night'||s.phase==='end';
  if(s.history.length!==(s.day-1)*3+s.slot+(completedEvent?1:0))return false;
  if(completedEvent?!['a','b'].includes(s.eventChoice):s.eventChoice!==null)return false;
  return s.history.every(h=>h&&(!h.result||['great_success','success','failure','disaster'].includes(h.result.grade)&&Number.isFinite(h.result.roll)&&h.result.roll>=0&&h.result.roll<1&&h.result.chances&&Object.keys(h.result.chances).length===4&&['great_success','success','failure','disaster'].every(k=>bounded(h.result.chances[k],100))&&Object.values(h.result.chances).reduce((a,b)=>a+b,0)===100)&&['reply','eventId','choiceId','activityId','mood'].every(k=>h[k]===undefined||typeof h[k]==='string'&&h[k].length<500)&&bounded(h.day,7)&&h.day>=1&&bounded(h.slot,2)&&typeof h.title==='string'&&h.title.length<200&&typeof h.text==='string'&&h.text.length<1500&&h.delta&&typeof h.delta==='object'&&Object.entries(h.delta).every(([k,v])=>['money','energy',...statKeys].includes(k)&&Number.isInteger(v)&&Math.abs(v)<=200));
}
