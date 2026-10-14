import {workActivities} from './work.js?v=month7';
import {statValue,growthProfile} from './growth.js?v=month7';
export const advancedActivities=[
 {id:'observe',name:'빛과 여백 관찰하기',icon:'🔎',desc:'집중해서 창가의 색과 비워 둘 자리를 골라 그림에 담아요.',cost:7,energy:17,gains:{art:11},need:{stat:'focus',value:25},sprite:'sketch',caption:'창밖의 빛을 살피며 여백을 남겨 그려요.'},
 {id:'explore',name:'미아가 고른 탐색길',icon:'🗺️',desc:'미아가 지도를 보고 익숙한 길과 다른 길을 비교하며 걸어요.',cost:6,energy:22,gains:{courage:12},need:{stat:'curiosity',value:25},sprite:'walk',caption:'지도를 짚고 미아가 고른 탐색 방향을 함께 살펴요.'},
 {id:'meal',name:'혼자 차리는 한 끼',icon:'🥣',desc:'컵과 수건, 접시를 놓는 준비 순서를 미아에게 맡겨요.',cost:9,energy:20,gains:{cook:12,trust:2},need:{stat:'independence',value:25},sprite:'cook',caption:'미아가 정한 순서로 컵과 수건을 놓고 식탁을 준비해요.'},
 {id:'stroll',name:'강변에서 가볍게 몸풀기',icon:'🌿',desc:'발을 딛고 팔을 가볍게 늘리며 몸과 마음을 돌봐요.',cost:2,energy:10,gains:{courage:4},need:{stat:'health',value:75},sprite:'walk',caption:'강변에서 발을 딛고 팔과 몸을 천천히 늘려요.'},
 {id:'wishbook',name:'소원 수첩 나누기',icon:'📓',desc:'좋아하는 일과 다음에 해보고 싶은 일을 미아가 먼저 골라요.',cost:0,energy:10,gains:{trust:10},need:{stat:'morale',value:75},sprite:'talk',caption:'미아의 다음 소원을 듣고 함께 고를 시간을 가져요.'}
];
export const unlocks=[{id:'art',name:'작업실에서 큰 그림',stat:'art',value:18},{id:'courage',name:'한강 피크닉',stat:'courage',value:18},...advancedActivities.map(a=>({id:a.id,name:a.name,...a.need})),...workActivities.filter(a=>a.need).map(a=>({id:a.id,name:a.name,...a.need}))];
export const traitReplies={
 'health-low':['몸이 무거워. 다음 휴식은 꼭 이 자리에서 하고 싶어.','눈을 감고 싶은 날도 내가 고르는 날이지? 오늘은 조금 더 쉴래.'],
 'morale-low':['실수할까 봐 두려워. 그래도 말해 볼래.','잠깐 멈추는 걸 고를래. 움직이지 않아도 괜찮아.'],
 focus:['빈 모서리는 그대로 두고 싶어. 다 채우지 않아도 내가 끝냈다고 말할래.','같은 국인데 두 번째 냄새가 조금 달라. 이번에는 넣은 순서를 기억했어.'],
 curiosity:['오늘 지나친 길도 궁금했어. 다음에는 내가 길을 골라 볼래.','돌아오는 길을 다르게 골랐어. 아까 못 본 나무도 있더라.'],
 independence:['찾던 물건이 나오니까 좋네. 내 물건 자리는 내가 정해 두고 싶어.','다음에는 국을 내가 먼저 떠 줄래. 뜨거우면 잠깐 기다리면 되니까.'],
 'health-high':['낯선 길에서는 멈추고 싶었어. 기다려 주니까 다시 걸어 볼 마음이 생겼네.','오늘 본 자리 중에 내 자리를 골랐어. 다음에도 거기부터 찾아볼래.'],
 'morale-high':['처음에는 네가 먼저 골라 주길 기다렸어. 지금은 내가 원하는 걸 조금 알겠어.','말하다가 마음이 바뀌어도 괜찮구나. 아까 못 꺼낸 얘기도 해 볼래.']
};
// Keep exact approved dubbed lines; do not substitute another line's audio.
export function growthDialogue(s,id=null){
 if(id==='meal'&&s.energy>=25&&statValue(s,'health')>=40&&statValue(s,'morale')>=25)return {text:'접는 모양이 조금 달라도 쓰기 편하면 되지? 내 칸은 이렇게 두고 싶어.',mood:'happy',trait:'independence'};
 if(id==='stroll'&&s.energy>=25&&statValue(s,'health')>=40&&statValue(s,'morale')>=25)return {text:'오늘은 바람 부는 곳까지 천천히 걸어 보고 싶어.',mood:'happy',trait:'health-high'};
 let trait;
 if(statValue(s,'health')<40)trait='health-low';
 else if(statValue(s,'morale')<25)trait='morale-low';
 else if(s.energy<25&&id!=='rest')return null;
 else if(!id&&growthProfile(s).value>=25)trait=growthProfile(s).top;
 else if(id==='observe'||(!id||['sketch','atelier','cook'].includes(id))&&statValue(s,'focus')>=25)trait='focus';
 else if(['explore','stroll'].includes(id)||(!id||['walk','picnic'].includes(id))&&statValue(s,'curiosity')>=25)trait='curiosity';
 else if(id==='meal'||(!id||['chores','cook'].includes(id))&&statValue(s,'independence')>=25)trait='independence';
 else if(id==='wishbook'||statValue(s,'morale')>=80)trait='morale-high';
 else if(statValue(s,'health')>=80&&(!id||id==='walk'))trait='health-high';
 if(!trait)return null;
 const pool=traitReplies[trait];let index=(s.day+(s.slot||0)+(s.counts?.[id]||0))%pool.length;
 if(trait==='focus')index=id?(['cook','meal'].includes(id)?1:0):((s.counts?.cook||0)>(s.counts?.sketch||0)+(s.counts?.atelier||0)+(s.counts?.observe||0)?1:0);
 if(trait==='independence')index=id?(['cook','meal'].includes(id)?1:0):((s.counts?.cook||0)+(s.counts?.meal||0)>(s.counts?.chores||0)?1:0);
 return {text:pool[index],mood:trait==='health-low'?'tired':trait==='morale-low'?'sad':trait==='curiosity'?'curious':'happy',trait};
}
