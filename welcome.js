const plans={
 art:{name:'작은 그림전',icon:'🎨',themes:['물빛 그림전','우리 식구 그림전'],labels:['그림 주제 고르기','걸어 둘 작품 완성하기','전시 자리와 초대 준비하기'],main:['sketch','atelier','observe','postcards','art-sale','commission'],support:['walk','talk','wishbook'],recommend:'스케치북 그리기',object:'완성한 그림',alternative:'찢어진 모서리를 살린 콜라주'},
 cook:{name:'따뜻한 식탁',icon:'🍲',themes:['따뜻한 수프 식탁','작은 간식 식탁'],labels:['메뉴 정하기','함께 먹을 음식 준비하기','식탁과 초대 준비하기'],main:['cook','meal','food-sale'],support:['chores','talk'],recommend:'간단한 요리',object:'준비한 음식',alternative:'남은 재료로 만든 작은 간식'},
 courage:{name:'한강 환영 나들이',icon:'🌿',themes:['강물이 보이는 길','나무 그늘 탐험길'],labels:['나들이 길 고르기','경로를 돌아보고 지도 완성하기','돗자리와 초대 준비하기'],main:['walk','picnic','explore','stroll'],support:['talk','sketch'],recommend:'공원 산책',object:'직접 만든 경로 지도',alternative:'쉬는 자리를 더한 짧은 경로'},
 home:{name:'편안한 환영 자리',icon:'🧸',themes:['창가 이야기 자리','거실 작은 놀이 자리'],labels:['함께할 놀이 고르기','편안한 자리와 놀이 준비하기','자리 배치와 초대 준비하기'],main:['talk','wishbook','chores'],support:['rest','sketch','cook'],recommend:'마음 나누기',object:'직접 꾸민 자리',alternative:'부담 없이 쉬며 이야기하는 자리'},
};
const chosen=(s,day)=>s.history?.find(h=>h.day===day&&h.slot===2);
const good=h=>!h.result||['success','great_success'].includes(h.result.grade);
export function welcomeProject(s){
 const plan=plans[s.goal]||plans.art,history=s.history||[],themeChoice=chosen(s,1);
 const main=history.filter(h=>h.activityId&&plan.main.includes(h.activityId));
 let work=main.reduce((n,h)=>n+(good(h)?(h.result?.grade==='great_success'||['atelier','observe','meal','picnic','explore','wishbook'].includes(h.activityId)?2:1):0),0);
 const support=history.filter(h=>h.activityId&&plan.support.includes(h.activityId)&&good(h)).length;
 if(support>=2)work++;
 const repair=history.find(h=>h.eventId==='welcome-setback');
 if(repair)work++;
 if(chosen(s,5)?.choiceId==='a')work++;
 work=Math.min(3,work);
 const setup=!!chosen(s,6),theme=!!themeChoice;
 const failed=main.filter(h=>!good(h)).at(-1);
 const pendingMistake=!!failed&&!repair&&work<3;
 const stages=[{label:plan.labels[0],done:theme,progress:theme?1:0,total:1,due:2},{label:plan.labels[1],done:work>=3,progress:work,total:3,due:4},{label:plan.labels[2],done:setup,progress:setup?1:0,total:1,due:6}];
 const ready=stages.every(x=>x.done);
 let today=!theme?'오늘 저녁 미아와 환영회 주제를 골라요.':work<3?`${plan.recommend}로 준비 ${work}/3을 이어가요.`:!setup?s.day<6?'주요 준비는 끝났어요. 6일째 초대 전에 기운과 돈을 챙겨요.':'오늘 저녁에 환영회 자리와 초대를 마무리해요.':'준비 완료! 미아와 쉬거나 마지막 연습을 해요.';
 if(!theme)today='오늘 저녁 미아와 환영회 주제를 골라요.';
 if(s.energy<25)today='먼저 쉬어서 기운을 회복해요. 준비는 이어갈 수 있어요.';
 if(s.day===7)today=ready?'오늘은 환영회! 미아가 소개할 방식만 고르면 돼요.':'오늘은 작은 환영회! 남은 일정으로 준비를 보완하거나 있는 것을 나눠요.';
 return {plan,theme,themeName:theme?plan.themes[themeChoice.choiceId==='b'?1:0]:'아직 고르는 중',work,setup,stages,ready,today,pendingMistake,variant:repair?.choiceId==='b'?'adapted':'original',repair,remaining:Math.max(0,7-s.day),recommended:s.energy<25?['rest']:work<3?plan.main:!theme?['talk']:['rest','talk']};
}

export function welcomeEventFor(s,base){
 const p=welcomeProject(s),plan=p.plan,k=s.goal==='home'?'trust':s.goal;
 const change=(i,updates)=>({...base.choices[i],...updates});
 if(s.day===1)return {...base,title:'7일 뒤, 미아가 준비하는 환영회',text:'카미아엘·세이라·아리카가 돌아오는 날, 미아가 직접 준비한 선물을 보여 주기로 했어요. 어떤 주제로 시작할까요?',chapter:'첫 약속',choices:[change(0,{label:plan.themes[0]+' 준비하기',desc:'이 주제로 준비를 시작해요.'}),change(1,{label:plan.themes[1]+' 준비하기',desc:'미아와 이야기를 나누며 주제를 정해요.'})]};
 if(s.day===2)return {...base,title:p.themeName+'의 준비물',text:`${p.themeName}에 쓸 준비물을 펼쳐요. 새것을 살 수도, 집에 있는 것을 함께 바꿔 쓸 수도 있어요. 어느 쪽이든 환영회 준비를 이어갈 수 있어요.`};
 if(s.day===4&&p.pendingMistake){
  const repairs={art:['그림을 차근차근 고쳐 보기','찢어진 부분을 콜라주로 바꾸기'],cook:['조리 순서를 다시 확인하기','남은 재료로 메뉴 바꾸기'],courage:['막힌 구간의 우회길 확인하기','더 짧고 편한 길로 바꾸기'],home:['자리 배치를 다시 살펴보기','쉬며 이야기하는 모임으로 바꾸기']}[s.goal];
  return {...base,id:'welcome-setback',title:'실수 뒤에도 준비는 계속돼요',condition:null,chapter:'다른 방법을 찾아서',text:`${plan.object} 준비가 생각대로 되지 않았어요. 같은 방법을 다듬을지, ${plan.alternative}로 바꿀지 미아와 골라요. 두 선택 모두 준비가 한 단계 진전돼요.`,choices:[change(0,{label:repairs[0],desc:'준비 +1 · 순서를 익혀요.',delta:{[k]:4,focus:3},mood:'curious'}),change(1,{label:repairs[1],desc:'준비 +1 · 다른 모양의 선물을 만들어요.',delta:{trust:4,curiosity:3},mood:'happy'})]};
 }
 if(s.day===6)return {...base,id:'welcome-invitation',condition:null,chapter:'돌아올 사람들을 기다리며',title:'내일의 환영회 자리를 만들어요',text:`${p.work>=3?plan.object+'이 준비됐어요.':'아직 다 끝나지 않았지만 있는 준비물부터 모아요.'} 장식에 돈을 쓸지, 집에 있는 물건으로 소박하게 꾸밀지 골라요.`,choices:[change(0,{label:'간식과 장식을 사서 꾸미기',desc:'돈 10 · 환영회 자리 준비 완료',delta:{money:-10,trust:6,morale:3}}),change(1,{label:'집에 있는 것으로 함께 꾸미기',desc:'비용 없이 환영회 자리 준비 완료',delta:{trust:3,independence:3}})]};
 if(s.day===7){const gathering=celebrationFor(s);return {...base,chapter:'드디어 환영회',title:'다녀왔어! 미아의 환영회',text:gathering.arrival,recall:`${p.themeName} · ${p.stages.filter(x=>x.done).length}/3 준비 완료`,choices:[change(0,{label:'미아가 직접 소개하기',desc:p.ready?'준비한 선물을 미아가 보여 줘요.':'완성한 부분부터 미아가 보여 줘요.'}),change(1,{label:'가까이 앉아 함께 나누기',desc:'조용한 모임도 같은 환영회예요. 기운을 회복해요.'})]};}
 return base;
}

export function celebrationFor(s){
 const p=welcomeProject(s),quiet=!!s.flags?.quiet,tired=s.energy<25;
 const item=p.variant==='adapted'?p.plan.alternative:p.plan.object;
 const arrival=`현관에서 카미아엘·세이라·아리카의 목소리가 들려요. ${p.ready?`미아가 ${p.themeName} 자리에 ${item}을 꺼내 놓아요.`:`미아는 다 끝내지 못한 준비물 중 보여 주고 싶은 부분부터 꺼내요.`} ${tired?'오늘은 앉아서 천천히 나누기로 해요.':'미아가 소개할 방식을 고를 차례예요.'}`;
 const reactions={
  art:['짐의 초상화 자리는 어디 있느냐? 아, 이 조그만 동그라미가 짐이었느냐.','테이프도 작품의 일부라고 적어 두면 되겠네.','아리카 그림은 이만큼 크게 그려 줘! 종이 더 붙이면 되잖아!'],
  cook:['짐이 첫 숟갈을 맡겠느니라. 조금 뜨겁구나. 짐은 잠시 기다리겠느니라.','남은 재료도 다 썼네. 내일 아침 몫은 이 그릇에 남겨 두자.','아리카 접시가 제일 커! 어, 이건 다 같이 먹는 접시야?'],
  courage:['짐이 앞장서겠느니라. 갈림길부터는 미아가 앞장서거라.','돌아오는 길까지 표시했네. 쉬는 자리도 잊지 않았고.','아리카가 먼저 도착했어! 어, 여기는 돌아오는 길이야?'],
  home:['짐의 왕좌도 마련했느냐? 이 작은 쿠션이구나. 짐은 옆으로 앉겠느니라.','미아 자리부터 남겨 둔 게 좋네. 컵은 내가 가져올게.','아리카도 앉을래! 쿠션이… 아리카 밑으로 들어갔어!'],
 };
 const cast=['camiael','seira','arika'],names=['카미아엘','세이라','아리카'];
 return {ready:p.ready,title:tired?'앉아서 나눈 작은 환영회':p.ready?`${p.themeName}, 준비한 것을 나눈 날`:'완성한 만큼 나눈 환영회',arrival,summary:`${item} · ${quiet?'가까이 앉아 함께 나누기':'미아가 직접 소개하기'} · 준비 ${p.stages.filter(x=>x.done).length}/3`,reactions:cast.map((id,i)=>({id,name:names[i],text:p.ready?reactions[s.goal][i]:['짐은 끝낸 것부터 보겠느니라. 다음 이야기도 기다리겠느니라.','남은 준비는 다음에 이어 하면 돼. 오늘 한 것도 보여 줘.','아리카는 지금 있는 것도 좋아! 다음에는 같이 준비할래.'][i]}))};
}
