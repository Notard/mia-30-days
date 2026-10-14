import {statValue} from './growth.js?v=month7';
import {traitReplies} from './progression.js?v=month7';
export const growthStories={
 'health-low':{title:'덮어 둔 스케치북',text:'미아가 한강이 보이는 창가에 스케치북을 덮어 둬요. 손을 잠깐 쉬게 하고 오늘의 남은 일을 작게 나누려 해요.',a:'은휘 안에서 충분히 쉬기',b:'앉아서 준비물만 함께 정리하기'},
 'morale-low':{title:'지웠다 쓴 소원 한 줄',text:'미아가 수첩에 쓴 소원을 지우려다 멈춰요. 서두르지 않고 마음을 말할지, 작은 연습으로 다시 시작할지 함께 골라요.',a:'지우기 전에 마음부터 듣기',b:'작은 색 하나만 함께 고르기'},
 focus:{title:'비워 둔 그림의 모서리',text:'미아가 창가 그림의 빈 모서리를 손가락으로 짚어요. 끝까지 채우는 대신 어디에서 멈출지를 직접 정해 보려 해요.',a:'미아가 고른 여백을 남기기',b:'다른 색으로 작은 비교 그림 그리기'},
 curiosity:{title:'지도에 없는 작은 그늘',text:'미아가 한강 지도를 펼치고 손가락으로 경로를 따라가요. 눈이 반짝이며 익숙한 길 옆의 작은 그늘도 새 경로로 연결해 보려 해요.',a:'미아의 새 경로를 함께 살피기',b:'익숙한 길과 나란히 비교하기'},
 independence:{title:'순서가 바뀐 식탁 준비',text:'미아가 식탁에 놓을 컵과 수건을 자기 순서대로 늘어놓아요. 곁에서 기다릴지, 함께 확인할지 정할 차례예요.',a:'준비 순서를 미아에게 맡기기',b:'함께 확인하고 역할 나누기'},
 'health-high':{title:'창가에서 본 짧은 산책길',text:'미아가 창밖 한강 길을 따라 손가락을 움직여요. 짧게 다녀올 만큼 기운이 남았지만, 편안한 시간을 더 가져도 좋아요.',a:'짧은 강변 산책 다녀오기',b:'창가에서 편하게 쉬기'},
 'morale-high':{title:'수첩 뒤의 다음 소원',text:'미아가 소원 수첩을 꺼내며 오늘 기분을 이야기해요. 다음에 해보고 싶은 일을 말로 나눌지, 그림 한 장으로 남길지 고르려 해요.',a:'다음 소원을 함께 이야기하기',b:'소원을 작은 그림에 남기기'}
};
export const eventReplies={...traitReplies,focus:[traitReplies.focus[0],'제목을 바꾸고 싶어졌어. 처음 고른 걸 끝까지 지킬 필요는 없지?'],independence:[traitReplies.independence[0],'접는 모양이 조금 달라도 쓰기 편하면 되지? 내 칸은 이렇게 두고 싶어.'],'health-high':[traitReplies['health-high'][0],'지금은 은휘 안이 편해. 쉬겠다고 먼저 말하니까 마음도 가벼워졌어.'],'morale-low':[traitReplies['morale-low'][0],'연필 자국이 고르게 안 나와. 한 번 더 눌러 볼래.'],'morale-high':[traitReplies['morale-high'][0],'강물에 칠한 색은 비밀로 해 둘까 했어. 지금은 같이 봐도 좋을 것 같아.']};
const requirements={'health-low':['health',40,'below'],'morale-low':['morale',25,'below'],focus:['focus',25],curiosity:['curiosity',25],independence:['independence',25],'health-high':['health',80],'morale-high':['morale',80]};
export function growthEventFor(s){
 if(![3,4,6].includes(s.day))return null;
 const seen=new Set(s.history.filter(h=>h.slot===2).map(h=>h.eventId));
 const eligible=Object.keys(growthStories).filter(id=>{const [k,t,mode]=requirements[id];return !seen.has('growth-'+id)&&(mode==='below'?statValue(s,k)<t:statValue(s,k)>=t);});
 const urgent=eligible.find(id=>id.endsWith('-low'));
 const trait=urgent||eligible.sort((a,b)=>{const [ka,ta]=requirements[a],[kb,tb]=requirements[b];return (statValue(s,kb)-tb)/(100-tb)-(statValue(s,ka)-ta)/(100-ta);})[0];
 if(!trait)return null;
 const story=growthStories[trait],k=s.goal==='home'?'trust':s.goal;
 const add=(base,stat,amount)=>({...base,[stat]:(base[stat]||0)+amount});
 const rewards={
  'health-low':[{energy:16,health:8,morale:4},{health:3,morale:3,independence:3,trust:3}],
  'morale-low':[{morale:10,trust:6},add({morale:5,focus:3},k,3)],
  focus:[add({focus:5,trust:3},k,7),add({curiosity:6,focus:2},k,4)],
  curiosity:[{curiosity:6,courage:7,independence:3},{focus:5,courage:4,trust:3}],
  independence:[add({independence:7,trust:4},k,6),{trust:7,focus:4,independence:2}],
  'health-high':[{health:3,morale:5,courage:6},{energy:14,health:4,morale:4}],
  'morale-high':[{trust:8,independence:4,morale:3},add({focus:5,morale:3},k,5)]
 };
 const [stat,threshold,mode]=requirements[trait],value=statValue(s,stat);
 const choices=rewards[trait].map((delta,i)=>({id:i?'b':'a',label:i?story.b:story.a,desc:'',delta,reply:eventReplies[trait][i],mood:trait==='health-low'?'tired':trait==='morale-low'&&i===1?'shy':trait==='curiosity'?'curious':'happy'}));
 for(const c of choices)c.desc='미아의 상태에 맞춰 함께 고른 방법이에요. 아래의 성장과 회복을 얻어요.';
 return {id:'growth-'+trait,title:story.title,text:story.text,branch:'성장에서 이어진 이야기',condition:{stat,threshold,mode,value},choices};
}
