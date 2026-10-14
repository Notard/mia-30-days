import {changePart,removePart} from './wardrobe-parts.js?v=head4';
import {statNames,statKeys} from './growth.js';
import {AUTO_KEY,MANUAL_KEY,readSlot,encodeSave} from './save-slots.js';
import {titleScreen,openingScreen,openingScenes,loadScreen} from './title-screen.js';
import {bookPromo} from './promo.js';
import {mountActivityBlend} from './activity-blend.js';
import {outcomeFor,mountOutcome} from './outcome.js';
import {newGame,act,chooseEvent,nextDay,endingFor,validateState} from './engine.js';
import {renderGame} from './render.js?v=head4';
import {historyEntry} from './history-chart.js';
import {startProfiles} from './start-profiles.js';
import {mountOpeningPerformance} from './opening-performance.js';
import {mountCharacterMotion} from './character-motion.js';
import {stopSpeech,mountSpeech,voiceEnabled,toggleVoice,replaySpeech} from './speech.js';
import {musicEnabled,toggleMusic,mountMusic} from './music.js';
import {celebrationMarkup} from './welcome-view.js';
import {buyClothing,equipClothing,shopItems} from './wardrobe.js?v=head4';
import {wardrobeDialog} from './wardrobe-view.js?v=head4';
const goals={
 art:{title:'작은 그림전',icon:'🎨',stat:'art',target:40,desc:'창밖의 빛을 그림으로 남기기. 연습을 쌓으면 작업실에서 큰 작품을 그릴 수 있어요.'},
 cook:{title:'함께 만든 식탁',icon:'🍲',stat:'cook',target:40,desc:'미아가 고른 음식을 함께 만들기. 요리와 집안일로 손에 익히고 재료비를 마련해요.'},
 courage:{title:'한강의 작은 탐험',icon:'🌿',stat:'courage',target:40,desc:'낯선 풍경을 스스로 만나기. 산책에 익숙해지면 피크닉을 준비할 수 있어요.'},
 home:{title:'편안한 우리집',icon:'🧸',stat:'trust',target:55,desc:'쉬고 싶은 때와 하고 싶은 일을 말할 수 있는 사이. 편안한 생활도 하나의 성장이에요.'}
};
const labels=statNames;
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const root=document.getElementById('app'),key=AUTO_KEY;
let state=null,saved=null,selected='art',storageError='',album=[],outcome=null,screen='menu',openingIndex=0,slots=[],savedNotice='',goalToast='',goalToastTimer=null,closetMode=null,closetOutdoor=false,closetSeason='spring';
function flashGoalHint(){goalToast=startProfiles[selected].hint;clearTimeout(goalToastTimer);goalToastTimer=setTimeout(()=>{goalToast='';root.querySelector('.goal-toast')?.remove();},3400);}
function refreshSlots(){
 try{slots=[{id:'auto',label:'자동 저장',...readSlot(localStorage,AUTO_KEY)},{id:'manual',label:'직접 저장',...readSlot(localStorage,MANUAL_KEY)}];saved=slots[0].save?.state||null;if(slots.some(s=>s.invalid))storageError='읽을 수 없는 저장 기록이 있어요. 다른 기록으로 이어갈 수 있어요.';}
 catch{slots=[];storageError='이 브라우저에서는 저장을 사용할 수 없어요. 창을 닫기 전 일지를 내려받아 주세요.';}
}
refreshSlots();
try{const data=JSON.parse(localStorage.getItem('mia-week-album-v2')||'[]');if(Array.isArray(data)&&data.length<=40&&data.every(e=>e&&typeof e.id==='string'&&e.id.length<100&&typeof e.title==='string'&&e.title.length<100&&goals[e.goal]&&typeof e.reached==='boolean'))album=data;}catch{}
function save(){try{localStorage.setItem(key,encodeSave(state));saved=state;refreshSlots();if(state.phase==='end'){const e=endingFor(state),reached=e.reached;const id=state.goal+':'+e.id;if(!album.some(a=>a.id===id))album.push({id,title:e.title,goal:state.goal,reached});localStorage.setItem('mia-week-album-v2',JSON.stringify(album));}}catch{storageError='자동 저장을 하지 못했어요. 창을 닫기 전 일지를 내려받아 주세요.';}}
function collection(){return album.length?`<section class="card" style="margin-top:20px"><div class="section-head"><h2>발견한 일주일</h2><span class="pill">목표 달성 ${new Set(album.filter(e=>e.reached).map(e=>e.goal)).size} / 4</span></div><div class="delta">${album.map(e=>`<span>${goals[e.goal].icon} ${esc(e.title)}${e.reached?' ✓':''}</span>`).join('')}</div></section>`:'';}
function diary(entries){return entries.length?entries.slice().reverse().map(h=>historyEntry(h,{showDay:true})).join(''):'<p class="muted">함께 고른 활동이 이곳에 쌓여요.</p>';}
function intro(){return `<section class="intro"><div class="card intro-copy"><div class="eyebrow">A LITTLE WEEK, A LITTLE GROWTH</div><h2>미아와 보내는<br>첫 번째 일주일</h2><p>“이번에는 내가 해 보고 싶은 것도 골라도 돼?”</p><p>7일 뒤, 카미아엘·세이라·아리카가 돌아와요. 미아와 환영회 주제를 고르고, 선물을 완성하고, 초대할 자리를 준비해요. 하루 두 번의 활동과 돈을 어떻게 나눌지 골라 주세요.</p><div class="goals">${Object.entries(goals).map(([id,g])=>`<button class="goal ${selected===id?'selected':''}" data-action="goal" data-id="${id}" aria-pressed="${selected===id}"><strong>${g.icon} ${g.title}</strong><small>${g.desc}</small></button>`).join('')}</div><p class="intro-note">2일째까지 주제 · 4일째까지 주요 준비 · 6일째까지 자리와 초대. 늦어져도 다음 날 이어갈 수 있어요. 준비 세 단계와 신뢰 35, 기운 25를 챙기면 환영회를 편안하게 열 수 있어요.</p><div class="actions"><button class="primary" data-action="start">이 목표로 오프닝 시작</button><button data-action="menu">메인 메뉴</button>${saved?'<p class="muted">첫날을 시작하면 자동 저장이 새 일주일로 바뀌어요. 직접 저장한 기록은 남아요.</p>':''}</div></div><div class="scene"><div class="scene-tag">한강이 내려다보이는 펜트하우스</div><div class="mia" role="img" aria-label="승인 실내복을 입은 미아"></div><div class="bubble"><strong>미아</strong>물에 비친 불빛, 색연필로 그려 보고 싶어. 따뜻한 것도 같이 먹고.</div></div></section>`;}
function ending(){const e=endingFor(state);return `<section class="card ending" data-goal="${esc(e.goal)}" data-path="${esc(e.path)}"><div class="ending-ribbon"><span class="ending-emblem" aria-hidden="true">${goals[e.goal].icon}</span><div><div class="eyebrow">SEVEN DAYS TOGETHER</div><strong>${esc(e.badge)}</strong></div><div class="grade">${esc(e.grade)}</div></div><figure class="ending-illustration"><img src="assets/endings/${esc(e.goal)}.png" alt="${esc(goals[e.goal].title)}의 일주일을 마친 미아의 그림" width="1536" height="1024"></figure><h2>${esc(e.title)}</h2><p>${esc(e.text)}</p>${celebrationMarkup(state)}<h3>${esc(e.growth.title)}</h3><p>${esc(e.growth.text)}</p><div class="stats">${statKeys.map(k=>`<div><div class="stat-head"><span>${labels[k]}</span><strong>${state[k]}</strong></div><div class="track"><div class="fill" style="width:${state[k]}%"></div></div></div>`).join('')}</div><p class="muted">남은 돈 ${state.money} · 기운 ${state.energy}</p><ul>${e.achievements.map(a=>`<li>${esc(a)}</li>`).join('')||'<li>함께 보낸 일주일을 일지에 남겼어요.</li>'}</ul><div class="actions"><button class="primary" data-action="retry">같은 목표로 다시 해보기</button><button data-action="goals">다른 목표 고르기</button><button data-action="download">일지 내려받기</button></div></section>`;}
function render(){const previous=root.querySelector('.scene')?.dataset.expression|| (root.querySelector('.scene')?'neutral':null);root.innerHTML=`<main class="wrap screen-${screen}"><header class="topbar"><div><div class="eyebrow">용세권 · 작은 성장 이야기</div><h1>미아와 일주일</h1></div><nav><button data-action="voice" aria-pressed="${voiceEnabled()}">${voiceEnabled()?'음성 끄기':'음성 켜기'}</button><button data-action="music" aria-pressed="${musicEnabled()}">${musicEnabled()?'음악 끄기':'음악 켜기'}</button><button data-action="replay">다시 듣기</button><button data-action="help">놀이 방법</button>${screen==='game'?`<button data-action="closet-open" ${state.phase!=='schedule'||outcome?'disabled':''}>옷장·상점</button><button data-action="manual-save">저장</button><button data-action="load-menu">불러오기</button><button data-action="menu">메인 메뉴</button>`:''}</nav></header>${storageError?`<p class="error" role="status">${esc(storageError)}</p>`:''}${savedNotice?`<p class="save-notice" role="status">${esc(savedNotice)}</p>`:''}${screen==='menu'?titleScreen(slots.some(s=>s.save)):screen==='load'?loadScreen(slots,goals,!!state):screen==='opening'?openingScreen(openingIndex):screen==='goals'?intro():(state.phase==='end'?ending():`${renderGame(state,goals[state.goal],outcome)}`)}${screen==='goals'&&goalToast?`<div class="goal-toast" role="status">${esc(goalToast)}</div>`:''}${screen==='menu'||screen==='game'?collection():''}${screen==='menu'||screen==='game'&&state?.phase==='end'?bookPromo():''}${screen==='game'&&!outcome?`<section class="card" style="margin-top:20px"><div class="section-head"><h2>함께 쓴 일지</h2><button data-action="download">내려받기</button></div><div class="journal">${diary(state.history)}</div></section>`:''}<footer class="footer">본편과 별개인 일주일 체험 이야기 · 자동 저장은 현재 브라우저에만 남아요</footer></main><dialog id="help"><button class="close" data-action="close">닫기</button><div class="help"><h2>작은 선택을 쌓아 보세요</h2><section><h3>하루 두 번의 활동</h3><p>오전과 오후에 한 활동씩 골라요. 이후 하루의 사건을 선택하고 오늘의 기록을 확인한 뒤 다음 날로 넘어가요. 일곱째 날에는 돌아온 식구들과 미아가 준비한 환영회를 열어요.</p></section><section><h3>기운과 돈을 나눠 쓰기</h3><p>활동에는 기운과 비용이 들어요. 기운 또는 기분이 25보다 낮으면 배움의 성장이 절반으로 줄어요. 휴식은 무료로 기운 24를 회복해요. 밤에는 건강에 따라 기운 12~22와 건강·기분 2를 회복해요. 집안일은 기운을 써 돈 12를 마련해요.</p></section><section><h3>연습하면 선택지가 늘어요</h3><p>표현 18이면 작업실 활동, 용기 18이면 피크닉이 열려요. 사건의 선택은 비용과 결과를 읽고 골라요. 목표만 몰아 키우기보다 신뢰와 쉬는 시간도 살펴 주세요.</p></section><section><h3>몸과 마음, 배움의 습관</h3><p>건강은 밤의 회복량, 기분은 배움의 성장량에 영향을 줘요. 집중 25부터 그림·생활 성장 +2, 호기심 25부터 용기 성장 +2와 준비물 재활용 보너스가 생겨요. 자립 25부터 집안일 수입 +3, 자립 30부터 혼자 해보기 사건을 잘 마칠 수 있어요. 집중·호기심·자립 25부터 관찰 그림·탐색길·혼자 차리는 한 끼가 열려요. 건강·기분 75부터 강변 몸풀기·소원 수첩도 열려요. 성장한 성향과 몸·마음의 상태에 따라 대사와 새로운 사건이 달라지고, 가장 잘 자란 성향도 결말에 남아요.</p></section><section><h3>대성공부터 대실패까지</h3><p>집중·재능·기운·건강·기분이 활동별 확률에 영향을 줘요. 카드의 ↑·↓는 작은 변화, ↑↑·↓↓는 큰 변화예요. 보통 성공했을 때를 기준으로 보여주며 실제 변화는 판정에 따라 달라져요. 대성공은 더 많이 배우고, 실패는 조금 배우며 기분이 내려가요. 대실패는 성장 수치와 몸·마음도 줄어 쉬어 갈 시간이 필요해요. 비용은 사용하고 집안일 수입도 결과에 따라 달라져요. 휴식은 언제나 회복하므로 기운이 바닥나도 다시 시작할 수 있어요. 판정과 실제 결과는 선택 즉시 저장돼요.</p></section><section><h3>선택을 기억하는 미아</h3><p>같은 날에도 연습·대화·휴식 이력에 따라 다른 사건을 만나요. 같은 활동을 반복하거나 기운이 낮을 때, 친해진 뒤에는 미아의 대답도 달라져요. 사건에서 고른 선택에 대한 미아의 답은 일지에도 남아요.</p></section><section><h3>정답 한 가지로 끝나지 않아요</h3><p>주제, 주요 준비 3단계, 자리와 초대를 완성하고 신뢰 35·기운 25를 챙기면 환영회 목표를 달성해요. 성공한 목표 활동은 준비 +1, 대성공이나 심화 활동은 +2예요. 다른 경험 두 번은 영감 +1, 실수 뒤의 방법 바꾸기도 준비에 도움이 돼요. 미달이어도 발견한 취향과 다음에 해볼 일이 결말에 남아요. 미아는 쉬는 동안 은휘 인형 안으로 돌아가요.</p></section></div></dialog>${closetMode&&screen==='game'?wardrobeDialog(state,closetMode,closetOutdoor,closetSeason):''}`;
 if(closetMode&&screen==='game'){const closet=root.querySelector('#closet');closet.showModal();closet.addEventListener('cancel',()=>{closetMode=null;});}
 mountMusic(root,screen,state);
 mountCharacterMotion(root,previous);
 mountOpeningPerformance(root);
 mountActivityBlend(root);
 if(outcome&&screen==='game')stopSpeech();else mountSpeech(root);
 mountOutcome(root,screen==='game'?outcome:null,()=>mountSpeech(root));
 if(screen!=='game')window.scrollTo({top:0,behavior:'instant'});
 if(screen==='opening')root.querySelector('.opening-story p')?.focus({preventScroll:true});
 const mia=root.querySelector('.mia');if(mia){mia.setAttribute('role','img');mia.setAttribute('aria-label',root.querySelector('.face')?.getAttribute('aria-label')||'승인 실내복을 입은 미아');}
}
function beginWeek(){state=newGame(selected);screen='game';outcome=null;save();}
root.addEventListener('click',e=>{const b=e.target.closest('button[data-action]');if(!b||b.disabled)return;const a=b.dataset.action,id=b.dataset.id;
 savedNotice='';
 if(a==='closet-open'&&state?.phase==='schedule'&&!outcome){closetMode='assemble';closetOutdoor=false;}
 if(['part-buy','part-dress','part-remove'].includes(a)&&closetMode&&!outcome){const place=closetOutdoor?'outdoor':'indoor';const next=a==='part-remove'?removePart(state,id,place):changePart(state,id,place,a==='part-buy');if(next===state)return;state=next;save();}
 if(a==='closet-close')closetMode=null;
 if(a==='closet-tab')closetMode=['assemble','wardrobe','shop'].includes(id)?id:'assemble';
 if(a==='closet-preview')closetOutdoor=id==='outdoor';
 if(a==='closet-season'&&['all','basic','spring','summer','autumn','winter'].includes(id))closetSeason=id;
 if(['buy','dress'].includes(a)&&closetMode&&!outcome){const next=a==='buy'?buyClothing(state,id):equipClothing(state,b.dataset.category,id);if(next===state)return;state=next;if(a==='buy'){closetMode='wardrobe';closetOutdoor=['outdoor','outdoorShoes'].includes(shopItems.find(item=>item.id===id)?.category);}save();}
 if(a==='menu'){closetMode=null;screen='menu';outcome=null;refreshSlots();}
 if(a==='new-menu'){screen='goals';flashGoalHint();}
 if(a==='load-menu'){refreshSlots();screen='load';outcome=null;}
 if(a==='return-game'&&state)screen='game';
 if(a==='load-slot'){refreshSlots();const slot=slots.find(s=>s.id===id);if(slot?.save){state=JSON.parse(JSON.stringify(slot.save.state));selected=state.goal;screen='game';outcome=null;save();}}
 if(a==='manual-save'&&state){try{localStorage.setItem(MANUAL_KEY,encodeSave(state));refreshSlots();savedNotice='기록을 직접 저장했어요. 메인 메뉴의 불러오기에서 다시 열 수 있어요.';}catch{storageError='저장하지 못했어요. 일지를 내려받아 주세요.';}}
 if(a==='opening-back'){if(openingIndex)openingIndex--;else screen='goals';}
 if(a==='opening-next'){if(openingIndex<openingScenes.length-1)openingIndex++;else beginWeek();}
 if(a==='opening-skip')beginWeek();
 if(a==='voice'){const on=toggleVoice();b.textContent=on?'음성 끄기':'음성 켜기';b.setAttribute('aria-pressed',String(on));return;}
 if(a==='music'){const on=toggleMusic();b.textContent=on?'음악 끄기':'음악 켜기';b.setAttribute('aria-pressed',String(on));return;}
 if(a==='replay'){replaySpeech();return;}
 if(a==='help'){document.getElementById('help').showModal();return;}
 if(a==='close'){document.getElementById('help').close();return;}
 if(a==='download'){const text=`미아와 일주일 — ${goals[state.goal].title}\n\n`+state.history.map(h=>`${h.day}일 ${h.title}\n${h.text}\n${Object.entries(h.delta).map(([k,v])=>`${labels[k]} ${v>0?'+':''}${v}`).join(' · ')}`).join('\n\n')+(state.phase==='end'?`\n\n${endingFor(state).title}\n${endingFor(state).text}`:'');const blob=new Blob([text],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='미아와_일주일_일지.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return;}
 if(a==='goal'&&goals[id]){selected=id;flashGoalHint();}
 if(a==='continue'){state=JSON.parse(JSON.stringify(saved));screen='game';}
 if(a==='start'){openingIndex=0;screen='opening';outcome=null;goalToast='';clearTimeout(goalToastTimer);}
 if(a==='reset'||a==='goals'){if(state.phase!=='end'&&!confirm('진행 중인 일주일을 그만두고 목표를 다시 고를까요?'))return;state=null;screen='goals';}
 if(a==='retry'){selected=state.goal;openingIndex=0;screen='opening';}
 if(a==='act'&&!outcome){const before=state;state=act(state,id);outcome=outcomeFor(before,state,id);save();}
 if(a==='event'&&!outcome){const before=state;state=chooseEvent(state,id);outcome=outcomeFor(before,state,'event');save();}
 if(a==='result-next'){outcome=null;}
 if(['start','continue','reset','goals','retry','next'].includes(a))outcome=null;
 if(a==='next'){state=nextDay(state);save();}
 render();
 if(a==='goal'&&goals[id])root.querySelector(`.goal[data-id="${id}"]`)?.focus({preventScroll:true});
});
render();

window.addEventListener('musicchange',()=>{const b=root.querySelector('[data-action=music]');if(b){b.textContent=musicEnabled()?'음악 끄기':'음악 켜기';b.setAttribute('aria-pressed',String(musicEnabled()));}});
