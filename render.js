import {advancedActivities,unlocks} from './progression.js';
import {statNames,statNotes,statKeys,activityDelta,statValue} from './growth.js';
import {spriteMarkup,activitySprites} from './activity-sprites.js';
import {dialogueFor} from "./dialogue.js";
import {historyEntry} from './history-chart.js';
import { activities, availability, eventFor } from "./engine.js";
const esc=(v)=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const num=(v)=>{const n=Number(v);return Number.isFinite(n)?Math.round(n):0;};
const clamp=(v)=>Math.max(0,Math.min(100,num(v)));
const NAMES={...statNames,home:"우리집"};
const name=(k)=>NAMES[k]||esc(k);
function fx(k,v){const n=num(v);if(!n)return"";return`${name(k)} ${n>0?"+":""}${n}`;}
function fxHtml(d){if(!d)return"";const p=Object.keys(d).map(k=>fx(k,d[k])).filter(Boolean);return p.length?`<div class="effects">${p.join(" · ")}</div>`:"";}
export function renderGame(s,goal,outcome=null){
const reaction=outcome?{text:outcome.reply,mood:outcome.entry.mood||'neutral'}:dialogueFor(s);
const clipId=outcome?.id||(s.phase==='night'?'rest':null);
const clip=activitySprites[clipId];
const shown=outcome?{...s,...outcome.before}:s;
const expression=['happy','sad','tired'].includes(reaction.mood)?reaction.mood:'neutral';
const faceLabel={happy:'기쁜 미아',sad:'서운한 미아',tired:'피곤한 미아',neutral:'차분한 미아'}[expression];
const day=num(s.day);const hist=s.history||[];const last=hist.filter(h=>h.day===s.day&&h.slot<2).at(-1);const lt=last?String(last.title||""):"";
const isRest=outcome?outcome.id==='rest':s.phase==="night"||s.phase==="end"||/rest|쉬/.test(lt);
const room=/cook|chores|요리|집안/.test(lt)?"kitchen":"living";
const energy=num(shown.energy),money=num(shown.money),home=num(s.home);
const needTrust=s.goal!=="home";
const dots=Array.from({length:7},(_,i)=>{const d=i+1;const c=d===day?" current":d<day?" done":"";return`<span class="day-dot${c}">${d}일</span>`;}).join("");
const stats=statKeys.map(k=>{const v=clamp(statValue(shown,k));return`<div class="stat"><div class="stat-head">${name(k)} <strong data-stat-value="${k}">${v}</strong></div><div class="track"><div class="fill" data-stat-fill="${k}" style="width:${v}%"></div></div><div class="stat-note">${esc(statNotes[k])}</div></div>`;}).join("");
const goalHtml=`<div class="goal-summary"><strong>${esc(goal.title)}</strong> ${name(goal.stat)} ${num(goal.target)}${needTrust?" · 신뢰 35":""} · 기운 25</div>`;
const notice=s.notice&&!outcome?`<div class="notice" style="margin-bottom:16px">${esc(s.notice)}</div>`:"";
let body="";
const ev=s.phase==="event"?eventFor(s):null;
if(outcome){
 const label=s.phase==='event'?'오늘의 사건 보기':s.phase==='night'?'오늘의 기록 보기':'다음 일정 고르기';
 body=`<div class="outcome-card"><span class="pill">${outcome.id==='event'?'선택의 결과':'함께한 활동'}</span><h2 tabindex="-1">${esc(outcome.title)}</h2>${outcome.result?`<div class="result-grade ${outcome.result.grade}">${outcome.result.label}</div>`:`<div class="result-grade">${outcome.id==='rest'?'회복':'완료'}</div>`}<div class="outcome-changes">${Object.entries(outcome.delta).filter(([,v])=>v).map(([k,v],i)=>`<div class="outcome-change ${v>0?'gain':'cost'}" style="--delay:${i*130}ms"><span class="result-stat-name">${name(k)}<small>기준 ${outcome.before[k]}</small></span><div class="result-number"><strong data-stat-value="${k}">${outcome.before[k]}</strong><b class="result-arrow" aria-hidden="true">${(v>0?'↑':'↓').repeat(Math.abs(v)>=10?2:1)}</b><em class="result-delta" aria-label="${v>0?'증가':'감소'} ${Math.abs(v)}">${v>0?'+':''}${v}</em></div></div>`).join('')}</div>${outcome.unlocks.map(k=>`<p class="unlock">🔓 ${esc(unlocks.find(u=>u.id===k)?.name||k)}</p>`).join('')}<p class="outcome-status" role="status">활동 중…</p><button class="primary" data-action="result-next" data-label="${label}" disabled>활동 중…</button></div>`;
}else if(s.phase==="night"||s.phase==="end"){
const entries=hist.filter(h=>num(h.day)===day).map(h=>historyEntry(h)).join("");
const nl=day>=7?"일주일 돌아보기":"다음날";
body=`<h2>오늘의 기록</h2>${entries||`<div class="entry">오늘은 조용했어.</div>`}<button class="primary" data-action="next">${nl}</button>`;
}else if(ev){
const choices=(ev.choices||[]).map(c=>{const d=c.delta||{};const lack=money+num(d.money)<0||energy+num(d.energy)<0;return`<button class="choice" data-action="event" data-id="${esc(c.id)}" ${lack?"disabled":""}><strong>${esc(c.label)}</strong>${c.desc?`<small>${esc(c.desc)}</small>`:""}${s.day===5&&c.id==='a'?`<small>${s.goal==='home'?'신뢰':name(s.goal)} 24 또는 자립 30부터 더 순조로워요. 현재 ${s[s.goal==='home'?'trust':s.goal]} / 자립 ${s.independence}</small>`:''}${fxHtml(d)}</button>`;}).join("");
body=`<div class="event"><div class="story-tags">${ev.chapter?`<span class="story-chapter">${esc(ev.chapter)}</span>`:''}<span class="pill">${esc(ev.branch)}</span></div><h2>${esc(ev.title)}</h2>${ev.recall?`<p class="story-recall">↳ ${esc(ev.recall)}</p>`:''}<p>${esc(ev.text)}</p>${ev.condition?`<p class="notice">${name(ev.condition.stat)} ${ev.condition.value} · ${ev.condition.mode==='below'?`${ev.condition.threshold} 미만이라 쉬어 가는 이야기`:`${ev.condition.threshold}부터 만나는 이야기`}</p>`:''}<div class="choices">${choices}</div></div>`;
}else{
const slot=s.slot===1?"오후":"오전";
const warn=energy<25||s.morale<25?`<div class="warning">${energy<25?'기운':'기분'}이 낮아 배움의 성장이 절반이에요. 휴식이나 대화로 돌봐 주세요.</div>`:"";
const activityCard=a=>{const av=availability(s,a)||{ok:false,reason:"불가"};const d=activityDelta(s,a);const lack=money+num(d.money)<0||energy+num(d.energy)<0;const dis=!av.ok||lack;const lock=!av.ok?`<div class="lock">${esc(av.reason||"지쳐서 못 해")}</div>`:lack?`<div class="lock">지쳐서 못 해</div>`:"";
const effects=Object.entries(d).filter(([,v])=>v).map(([k,v])=>{const large=Math.abs(v)>=10;const arrow=(v>0?'↑':'↓').repeat(large?2:1);return `<span class="effect-hint ${v>0?'up':'down'}" aria-label="${name(k)} ${large?'크게':'조금'} ${v>0?'증가':'감소'}">${name(k)} <b aria-hidden="true">${arrow}</b></span>`;}).join('');
return `<button class="activity" data-action="act" data-id="${esc(a.id)}" ${dis?"disabled":""}><strong>${esc(a.icon||"")} ${esc(a.name)}</strong><div class="effect-hints">${effects}</div>${lock}</button>`;};
const acts=activities.filter(a=>!advancedActivities.some(n=>n.id===a.id)).map(activityCard).join("");const advanced=advancedActivities.map(activityCard).join("");
body=`<div class="section-head"><h2>${day}일째 · ${slot} 일정</h2><span class="pill">하루 두 번</span></div>${warn}<div class="activities">${acts}</div><h3 style="margin-top:24px">성장으로 열리는 활동</h3><p class="muted">성장 수치가 기준에 도달하면 새로운 경험을 고를 수 있어요.</p><div class="activities">${advanced}</div>`;
}
return`<div class="week">${dots}</div><div class="resources" style="margin-bottom:18px"><span>남은 돈 <strong data-stat-value="money">${money}</strong></span><span>기운 <strong data-stat-value="energy">${energy}</strong></span></div><div class="game-layout"><div class="left-column"><div class="scene ${outcome?'has-outcome':''} ${clip?'has-activity-sprite':''} ${clip?.outdoor?'outdoor-activity':''}" data-result="${outcome?.result?.grade||''}" data-performance="${outcome?esc(outcome.id):''}" data-room="${room}" data-rest="${isRest}" data-mood="${esc(reaction.mood)}" data-expression="${expression}"><div class="scene-tag">${clip?.outdoor?'한강 공원 · 가을 나들이':'한강이 내려다보이는 펜트하우스'}</div><div class="mia"></div>${spriteMarkup(clipId)}${outcome?`<div class="performance-prop" aria-hidden="true">${outcome.icon}</div><div class="performance-caption">${esc(outcome.caption)}</div>`:''}<span class="mood-tag">${({happy:'조금 들뜬 마음',sad:'조금 서운한 마음',shy:'조심스러운 마음',curious:'궁금한 마음',tired:'쉬어 가는 마음'})[reaction.mood]||'미아의 마음'}</span>${isRest?`<div class="resting">은휘 안에서 쉬는 중</div>`:""}<div class="bubble" role="status" aria-live="polite"><div class="face" data-expression="${expression}" role="img" aria-label="${faceLabel}"></div><div class="bubble-copy"><strong>미아</strong> ${esc(reaction.text)}</div></div></div><div class="card"><h2>미아의 성장</h2><p class="muted">활동과 사건이 몸과 마음, 배움의 습관을 함께 키워요.</p><div class="stats">${stats}</div><div style="margin-top:18px">${goalHtml}</div></div></div><div class="right-column"><div class="card">${notice}${body}</div></div></div>`;
}
