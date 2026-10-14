export const workActivities=[
 {id:'recycle',name:'재활용품 모으기',icon:'♻️',desc:'동네를 돌며 깨끗한 병과 종이를 모아 분류해요.',cost:0,energy:14,gains:{cook:2,curiosity:3,independence:4},income:8,skill:'curiosity',sprite:'explore'},
 {id:'errand',name:'장보기 심부름',icon:'🛍️',desc:'곁에서 목록과 예산을 확인하며 동네 심부름을 해요.',cost:0,energy:18,gains:{courage:3,focus:3,independence:5},income:14,skill:'independence',need:{stat:'independence',value:12},sprite:'explore'},
 {id:'postcards',name:'그림 엽서 판매',icon:'💌',desc:'작은 그림을 그려 동네 장터에서 엽서로 팔아요.',cost:3,energy:16,gains:{art:4,focus:3,trust:1},income:12,skill:'art',need:{stat:'art',value:12},sprite:'sketch'},
 {id:'art-sale',name:'완성한 그림 판매',icon:'🖼️',desc:'연습한 실력으로 작품을 완성하고 가격을 붙여 팔아요.',cost:6,energy:22,gains:{art:5,focus:4,courage:2},income:24,skill:'art',need:{stat:'art',value:35},sprite:'atelier'},
 {id:'food-sale',name:'작은 음식 장터',icon:'🧁',desc:'재료를 사서 간식을 만들고 함께 장터에서 팔아요.',cost:10,energy:22,gains:{cook:5,focus:3,independence:4},income:20,skill:'cook',need:{stat:'cook',value:18},sprite:'cook'},
 {id:'commission',name:'단골 그림 주문',icon:'🎁',desc:'단골이 부탁한 풍경을 그려 약속한 작품을 전달해요.',cost:8,energy:24,gains:{art:6,focus:4,trust:3},income:36,skill:'art',need:{stat:'art',value:55},sprite:'atelier'},
];
export const workAliases=Object.fromEntries(workActivities.map(a=>[a.id,a.sprite]));
export const successfulJobs=s=>(s.history||[]).filter(h=>workAliases[h.activityId]&&['success','great_success'].includes(h.result?.grade));
export function workIncome(s,a,grade='success'){
 const repeat=successfulJobs(s).filter(h=>h.activityId===a.id).length;
 const gross=a.income+Math.floor((s[a.skill]||0)/(a.skill==='art'||a.skill==='cook'?4:12))+Math.min(8,repeat*2);
 return Math.round(gross*({great_success:1.5,success:1,failure:.25,disaster:0}[grade]??1));
}
const replies={
 recycle:['병 뚜껑은 따로 모았어. 분류하니까 봉투가 훨씬 가벼워.','종이를 묶는 매듭이 풀렸어. 다음에는 두 번 묶어야겠네.','바닥에 떨어진 것부터 다시 줍자. 오늘은 여기까지 할래.'],
 errand:['목록에 있던 걸 전부 찾았어. 거스름돈도 같이 세어 볼래.','비슷한 봉투를 골랐네. 다음에는 이름도 끝까지 읽어 볼래.','길을 다시 확인하느라 늦었어. 다음엔 작은 심부름부터 할래.'],
 postcards:['내가 고른 색을 누군가 집에 가져갔어. 다음 그림도 그려 보고 싶어.','엽서 모서리가 접혔어. 멀쩡한 것부터 골라서 내놓을래.','잉크가 번졌네. 오늘 것은 연습장에 붙여 두자.'],
 'art-sale':['그림값을 내가 적어 봤어. 이 그림 좋아한다고 말해 줬어.','액자 크기를 잘못 쟀어. 다시 맞춘 다음에 보여 줄래.','그림을 끝내지 못했어. 급하게 팔기보다 다시 그려 볼래.'],
 'food-sale':['우리 간식을 또 찾았어. 다음에도 같은 맛을 낼 수 있게 적어 둘래.','모양이 무너진 것도 있네. 잘 나온 것만 골라서 내놓자.','오늘은 너무 구워졌어. 팔지 않고 순서부터 다시 살펴볼래.'],
 commission:['부탁한 다리도 넣었어. 약속한 그림을 건네니까 안심돼.','말해 준 풍경을 조금 다르게 그렸네. 한 번 더 물어볼래.','마감에 맞추지 못했어. 다음엔 할 수 있는 양부터 약속할래.'],
};
export function workReply(s,id,grade){
 const pool=replies[id];if(!pool)return null;
 if(grade==='great_success')return '오늘은 생각보다 잘 됐어! '+pool[0];
 if(grade==='failure')return pool[1];if(grade==='disaster')return pool[2];
 if(s.energy<25)return '잘 마쳤어. 그런데 몸이 무거워. 다음에는 조금 쉬고 싶어.';
 if(successfulJobs(s).filter(h=>h.activityId===id).length>=2)return '지난번에 온 사람이 기억하고 다시 찾아줬어. '+pool[0];
 return pool[0];
}
export function monthProject(s){
 const jobs=successfulJobs(s),groups={art:['postcards','art-sale','commission'],cook:['food-sale'],courage:['errand','recycle'],home:['errand','recycle','food-sale']}[s.goal];
 const main=jobs.filter(h=>groups.includes(h.activityId)),variety=new Set(jobs.map(h=>h.activityId)).size;
 const ready=main.length>=6&&variety>=2;
 return {jobs,main:main.length,variety,ready,earned:(s.history||[]).filter(h=>workAliases[h.activityId]).reduce((sum,h)=>sum+(h.delta.money||0),0)};
}
export function monthConclusion(s){
 const p=monthProject(s),full=p.ready&&s.trust>=35&&s.energy>=25;
 const theme={art:'미아의 그림 가게',cook:'미아의 간식 장터',courage:'동네에서 믿고 맡기는 심부름',home:'스스로 꾸리는 작은 생활'}[s.goal];
 return {id:'month-'+s.goal+'-'+(full?'complete':s.energy<25?'rest':'learning'),path:full?'open':s.energy<25?'rest':'novice',reached:full,grade:full?'S':s.energy<25?'A':'B',badge:'30일의 작은 장터',title:theme+' — '+(full?'다음 주문이 기다리는 날':'다음에 이어갈 작은 약속'),text:full?'연습한 일을 누군가에게 건네고, 번 돈으로 필요한 것을 골랐어요. 미아는 다음 주문을 받기 전에 쉴 날짜부터 수첩에 적었어요.':'모든 준비를 끝내지는 못했지만 잘 맞는 일과 쉬어야 할 때를 알아갔어요. 다음에는 무엇을 만들고 어떤 옷을 입을지 미아가 먼저 골라 보기로 했어요.',extraAchievements:[`잘 마친 돈벌이 ${p.jobs.length}번 · 주제 활동 ${p.main}/6`,`돈벌이 순수입 ${p.earned} · 경험한 일 ${p.variety}종`]};
}
