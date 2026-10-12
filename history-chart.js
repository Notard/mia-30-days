import {statNames} from './growth.js';
import {resultGrades} from './activity-results.js';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function historyChart(delta){
 const changes=Object.entries(delta||{}).filter(([,value])=>Number.isInteger(value)&&value!==0);
 if(!changes.length)return '<p class="history-unchanged">수치 변화 없음</p>';
 return `<div class="history-chart" aria-label="수치 변화 그래프">${changes.map(([key,value])=>{
  const direction=value>0?'up':'down',amount=Math.abs(value),width=Math.min(50,amount*2);
  return `<div class="history-change ${direction}"><span class="history-stat">${esc(statNames[key]||key)}</span><span class="history-bar" aria-hidden="true"><i style="--bar-width:${width}%"></i></span><strong>${value>0?'+':''}${value}</strong></div>`;
 }).join('')}</div>`;
}

export function historyEntry(entry,{showDay=false}={}){
 const grade=entry.activityId==='rest'?'회복':entry.result?.grade?resultGrades[entry.result.grade]?.label:'';
 const choice=entry.eventId?String(entry.text||'').split(' — ')[0]:'';
 const reply=entry.reply||String(entry.text||'').match(/미아:\s*“([^”]+)”/)?.[1]||'';
 return `<article class="entry history-entry"><div class="history-heading"><strong>${showDay?`${Number(entry.day)}일 · `:''}${esc(entry.title)}</strong>${grade?`<span class="history-grade">${esc(grade)}</span>`:''}</div>${choice?`<p class="history-choice">${esc(choice)}</p>`:''}${reply?`<p class="history-reply">미아 “${esc(reply)}”</p>`:''}${historyChart(entry.delta)}</article>`;
}
