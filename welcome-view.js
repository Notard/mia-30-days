import {monthBoard} from './month-story.js?v=month7';
import {monthProject} from './work.js?v=month7';
import {welcomeProject,celebrationFor} from './welcome.js?v=month7';
import {castRig} from './opening-performance.js?v=month7';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function welcomeBoard(s){
 if(s.duration===30&&s.day>7)return monthBoard(s);
 const p=welcomeProject(s);
 return `<section class="welcome-board" aria-label="환영회 준비"><div class="welcome-heading"><div><h2>${s.day===7?'오늘은 환영회!':`환영회까지 ${p.remaining}일`}</h2><strong class="welcome-theme">${esc(p.themeName)}</strong></div><span class="welcome-icon" aria-hidden="true">${p.plan.icon}</span></div><ol class="welcome-steps">${p.stages.map((stage,i)=>`<li class="${stage.done?'done':s.day>stage.due?'catchup':''}"><span class="step-check" aria-hidden="true">${stage.done?'✓':i+1}</span><div><span>${stage.label}</span><small>${stage.done?'준비 완료':s.day>stage.due?'오늘도 이어갈 수 있어요':`${stage.due}일째까지`}</small></div><b class="stage-artifact">${i===1?Array.from({length:3},(_,n)=>`<span class="${n<stage.progress?'prepared':'waiting'}" aria-hidden="true">${({art:'🖼️',cook:'🥣',courage:'🗺️',home:'🛋️'})[s.goal]}</span>`).join(''):''}<small>${stage.progress}/${stage.total}</small></b></li>`).join('')}</ol><p class="today-task"><strong>오늘 할 일</strong>${esc(p.today)}</p>${p.pendingMistake?'<p class="project-setback">실수한 준비물은 고치거나 다른 방법으로 바꿀 수 있어요.</p>':''}</section>`;
}
export function celebrationMarkup(s){
 const gathering=s.duration===30?monthCelebration(s):celebrationFor(s);
 return `<section class="welcome-finale" aria-label="환영회"><span class="eyebrow">${s.duration===30?'서른째 날 · 작은 장터':'일곱째 날 · 다녀왔어!'}</span><h2>${esc(gathering.title)}</h2><p>${esc(gathering.summary)}</p><div class="family-reactions">${gathering.reactions.map(c=>`<article><div class="family-portrait" role="img" aria-label="${c.name}">${castRig(c.id,true)}</div><div><strong>${c.name}</strong><p>“${esc(c.text)}”</p></div></article>`).join('')}</div></section>`;
}
function monthCelebration(s){
 const p=monthProject(s),theme={art:'그림',cook:'간식',courage:'동네 심부름',home:'생활'}[s.goal];
 const shown=p.main>=6?`${theme} 일을 여섯 번 넘게 마쳤어.`:`${theme} 일을 ${p.main}번 해 봤어.`;
 return {title:p.ready?'미아가 직접 연 작은 장터':'미아가 고른 다음 약속',summary:`잘 마친 주제 활동 ${p.main}/6 · 경험한 돈벌이 ${p.variety}/2종 · 순수입 ${p.earned}`,
 reactions:[{id:'camiael',name:'카미아엘',text:p.ready?'짐의 고귀한 장부에도 이 수입을 적어 두겠느니라.':'짐의 장부에 다음 약속을 위한 칸을 남겨 두겠느니라.'},{id:'seira',name:'세이라',text:`${shown} 재료값도 빼고 남은 돈을 같이 세어 보자.`},{id:'arika',name:'아리카',text:p.ready?'아리카도 손님 할래! 제일 먼저 뭘 고르면 돼?':'다음에는 아리카가 가게 앞에 이름표 붙여 줄게!'}]};
}
