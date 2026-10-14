import {welcomeProject,celebrationFor} from './welcome.js';
import {castRig} from './opening-performance.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function welcomeBoard(s){
 const p=welcomeProject(s);
 return `<section class="welcome-board" aria-label="환영회 준비"><div class="welcome-heading"><div><h2>${s.day===7?'오늘은 환영회!':`환영회까지 ${p.remaining}일`}</h2><strong class="welcome-theme">${esc(p.themeName)}</strong></div><span class="welcome-icon" aria-hidden="true">${p.plan.icon}</span></div><ol class="welcome-steps">${p.stages.map((stage,i)=>`<li class="${stage.done?'done':s.day>stage.due?'catchup':''}"><span class="step-check" aria-hidden="true">${stage.done?'✓':i+1}</span><div><span>${stage.label}</span><small>${stage.done?'준비 완료':s.day>stage.due?'오늘도 이어갈 수 있어요':`${stage.due}일째까지`}</small></div><b class="stage-artifact">${i===1?Array.from({length:3},(_,n)=>`<span class="${n<stage.progress?'prepared':'waiting'}" aria-hidden="true">${({art:'🖼️',cook:'🥣',courage:'🗺️',home:'🛋️'})[s.goal]}</span>`).join(''):''}<small>${stage.progress}/${stage.total}</small></b></li>`).join('')}</ol><p class="today-task"><strong>오늘 할 일</strong>${esc(p.today)}</p>${p.pendingMistake?'<p class="project-setback">실수한 준비물은 고치거나 다른 방법으로 바꿀 수 있어요.</p>':''}</section>`;
}
export function celebrationMarkup(s){
 const gathering=celebrationFor(s);
 return `<section class="welcome-finale" aria-label="환영회"><span class="eyebrow">일곱째 날 · 다녀왔어!</span><h2>${esc(gathering.title)}</h2><p>${esc(gathering.summary)}</p><div class="family-reactions">${gathering.reactions.map(c=>`<article><div class="family-portrait" role="img" aria-label="${c.name}">${castRig(c.id,true)}</div><div><strong>${c.name}</strong><p>“${esc(c.text)}”</p></div></article>`).join('')}</div></section>`;
}
