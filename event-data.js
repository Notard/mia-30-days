import {growthEventFor} from './growth-events.js';
import {eventGrowth,statValue} from './growth.js';
import {stories} from "./story-data.js";
import {storyArcFor} from './story-arcs.js';
import {welcomeEventFor} from './welcome.js';
export function eventFor(s){return welcomeEventFor(s,baseEventFor(s));}
function baseEventFor(s){
  const arc=storyArcFor(s);
  const growth=growthEventFor(s);if(growth)return {...growth,chapter:arc?.chapter,recall:arc?.recall};
  const k = s.goal==='home' ? 'trust' : s.goal;
  const goalWord = {art:'그림',cook:'요리',courage:'나들이',home:'편안한 생활'}[s.goal]||'일상';
  const skillWord={art:'표현',cook:'생활',courage:'용기',trust:'신뢰'}[k];
  const wishes={art:'물에 비친 불빛을 그려 보고 싶어.',cook:'내가 만든 따뜻한 걸 같이 먹고 싶어.',courage:'강 옆에서 내가 자리를 골라 보고 싶어.',home:'쉬고 싶을 때 편하게 말해도 돼?'};
  const supplies={art:'색연필',cook:'수프 재료',courage:'작은 돗자리',home:'부드러운 방석'};
  const scenes = {
    1:{title:'미아가 먼저 고른 소원',text:`미아가 창가에 앉아 말해요. “${wishes[s.goal]}”`,
      choices:[
        {id:'a',label:`그 소원을 오늘부터 준비하기`,desc:`미아가 고른 ${goalWord}의 첫 단계를 함께 해요.`,delta:{[k]:4}},
        {id:'b',label:'미아와 먼저 친해지기',desc:`시간을 내어 미아와 대화. 신뢰는 쌓이지만 그 준비는 내일로.`,delta:{trust:5}}
      ]},
    2:{title:'새것을 살까, 함께 바꿔 볼까',text:`미아가 ${supplies[s.goal]}을 보고 머뭇거려요. “이거 있으면 더 편할 것 같아. 그런데 집에도 비슷한 게 있지?”`,
      choices:[
        {id:'a',label:`${supplies[s.goal]} 준비하기`,desc:`예산 8을 써서 ${goalWord} 준비를 한 단계 진전시켜요.`,delta:{money:-8,[k]:8}},
        {id:'b',label:'집에 있는 것으로 함께 꾸미기',desc:`비용 없이 머리를 맞대요. 성장은 다음 기회로 미루고 신뢰를 쌓아요.`,delta:{trust:4}}
      ]},
    3:{title:'통창을 두드리는 빗소리',text:`“비 냄새는 창문 안에서도 나네.” 미아가 빗방울을 세다가 준비하던 것을 바라봐요.`,
      choices:[
        {id:'a',label:'조용히 쉬기',desc:`기운을 회복하고, 그 준비는 내일로 미뤄.`,delta:{energy:12}},
        {id:'b',label:'실내에서 다른 방법으로 이어가기',desc:`그림은 빗방울, 요리는 따뜻한 수프, 나들이는 경로 지도. 준비를 이어가며 기운을 써요.`,delta:{[k]:6,energy:-8}}
      ]},
    4:{title:'예상과 조금 다른 결과',text:`미아가 준비하던 것을 내려놓아요. “내가 생각한 모양은 이게 아닌데… 다시 해도 돼?”`,
      choices:[
        {id:'a',label:'미아가 원하는 방법을 먼저 듣기',desc:`완성은 잠시 미루고, 미아가 다시 고를 시간을 줘요.`,delta:{trust:8}},
        {id:'b',label:'방법을 알려 주며 완성까지 이끌기',desc:`요령은 빨리 늘지만 미아가 스스로 고를 기회가 줄어요.`,delta:s.goal==='home'?{trust:7}:{[k]:10,trust:-3}}
      ]},
    5:{title:'작게 먼저 해 보는 날',text:`“사람들이 오기 전에 한 번 해 볼까?” 미아가 연습한 것을 직접 꺼내요.`,
      choices:[
        {id:'a',label:'미아가 혼자 해 보도록 곁에서 지켜보기',desc:`${skillWord} 24 또는 자립 30부터 순조롭게 해낼 수 있어요. 현재 ${s[k]} / 자립 ${statValue(s,'independence')}. ${(s[k]>=24||statValue(s,'independence')>=30)?'연습이 익숙해져 성장과 신뢰를 함께 얻어요.':'아직 낯설어 조금 배우고 기운 8을 써요.'}`,delta:(s[k]>=24||statValue(s,'independence')>=30)?(s.goal==='home'?{trust:14}:{[k]:10,trust:4}):{[k]:3,energy:-8}},
        {id:'b',label:'쉬고 준비하기',desc:`잠시 쉬고 기운을 회복한 뒤 준비를 이어가요.`,delta:{energy:15}}
      ]},
    6:{title:'내일을 위한 작은 초대',text:`미아가 접은 종이를 내밀어요. “언니도 같이 봤으면 좋겠어. 준비는 얼마나 더 해야 할까?”`,
      choices:[
        {id:'a',label:'간식과 초대장을 함께 준비하기',desc:`예산 10을 써서 카미아엘과 나눌 자리를 준비해요.`,delta:{money:-10,trust:6}},
        s.energy>=10?{id:'b',label:`집에서 ${goalWord} 마지막 연습`,desc:`예산을 아끼고 기운 10을 써서 준비를 진전시켜요.`,delta:{[k]:6,energy:-10}}:{id:'b',label:'집에 있는 간식으로 작게 준비하기',desc:'돈과 기운을 더 쓰지 않고, 내일 나눌 이야기를 함께 골라요.',delta:{trust:3}}
      ]},
    7:{title:'미아가 고르는 마지막 방식',text:`미아가 그동안 준비한 것을 살펴봐요. “조금 떨려. 다 같이 볼까, 가까이 앉아서 천천히 볼까?”`,
      choices:[
        {id:'a',label:'미아가 소개하는 작은 모임 열기',desc:`미아가 자신의 경험을 소개해요. 신뢰가 조금 더 쌓여요.`,delta:{trust:4},flag:'presented'},
        {id:'b',label:'가까이 앉아 조용히 나누기',desc:`작게 나누는 자리도 목표를 이룰 수 있어요. 부담을 덜고 기운을 회복해요.`,delta:{energy:12},flag:'quiet'}
      ]}
  };
  const base=scenes[s.day]||scenes[1];
  const today=s.history.filter(h=>h.day===s.day&&h.slot<2);
  const previous=s.history.filter(h=>h.slot===2).at(-1);
  const rest=s.energy<25||today.some(h=>h.activityId==='rest'||h.title==='은휘 안에서 쉬기');
  const bonding=(s.counts.talk||0)>=3||previous?.choiceId==='b'||today.every(h=>h.activityId==='talk');
  const trained=today.filter(h=>['sketch','cook','walk','atelier','picnic'].includes(h.activityId)).length>=2;
  const branch=rest?2:trained?0:bonding?1:0;
  const scene=stories[s.day]?.[branch];
  if(!scene)return base;
  const projects={art:'작은 그림전',cook:'따뜻한 식탁',courage:'한강 나들이',home:'편안한 우리집'};
  const expand=t=>t.replaceAll('{project}',projects[s.goal]).replaceAll('{supply}',supplies[s.goal]);
  const choices=base.choices.map((c,i)=>{
    const prose=scene.choices[i];
    const fallback=s.day===6&&i===1&&s.energy<10;
    let reply=expand(prose.reply),mood=prose.mood;
    if(s.day===5&&i===0&&(s[k]<24&&statValue(s,'independence')<30)){reply='아직 손이 자꾸 멈추네. 다음에는 조금씩 나눠서 해 볼래.';mood='shy';}
    if(fallback){reply='있는 간식도 좋아. 내일 보여 줄 건 내가 골라 둘게.';mood='happy';}
    const delta=eventGrowth(s,c);let bonus='';
    if(s.day===2&&c.id==='b'&&statValue(s,'curiosity')>=25){delta[k]=(delta[k]||0)+4;bonus=' 호기심 덕분에 남은 준비물의 새 쓰임을 찾아 성장 4도 얻어요.';}
    if(s.day===5&&c.id==='a'&&(s[k]>=24||statValue(s,'independence')>=30)){
      const earlier=s.history.find(h=>h.day===4&&h.slot===2&&!h.eventId?.startsWith('growth-'))?.choiceId;
      if(earlier==='a'){delta.independence=(delta.independence||0)+3;bonus+=' 기다려 준 기억 덕분에 자립도 3 자라요.';}
      if(earlier==='b'){delta.focus=(delta.focus||0)+3;bonus+=' 배운 순서를 떠올려 집중도 3 자라요.';}
    }
    return {...c,delta,label:fallback||!prose.label?c.label:expand(prose.label),desc:(fallback||!prose.desc?c.desc:expand(prose.desc))+bonus,reply,mood};
  });
  return {...base,id:scene.id,branch:['연습에서 이어진 이야기','마음에서 이어진 이야기','쉼에서 이어진 이야기'][branch],chapter:arc?.chapter,recall:arc?.recall,title:arc?.title||expand(scene.title),text:(arc?.text?arc.text+' ':'')+expand(scene.text),choices};
}
