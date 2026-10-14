import {workActivities} from './work.js?v=month7';
import {statValue} from './growth.js?v=month7';
export const resultGrades={great_success:{label:'대성공',factor:1.6,mood:'happy'},success:{label:'성공',factor:1,mood:'happy'},failure:{label:'실패',factor:.35,mood:'sad'},disaster:{label:'대실패',factor:-.25,mood:'tired'}};
const skills={sketch:['focus','art'],cook:['focus','cook'],walk:['health','courage'],talk:['morale','trust'],chores:['independence','cook'],atelier:['focus','art'],picnic:['curiosity','courage'],observe:['focus','art'],explore:['curiosity','courage'],meal:['independence','cook'],stroll:['health','courage'],wishbook:['morale','trust']};
for(const a of workActivities)skills[a.id]=[a.skill,'focus'];
export function activityChances(s,a){
 if(a.id==='rest')return {great_success:0,success:100,failure:0,disaster:0};
 const [primary,secondary]=skills[a.id]||['focus','trust'];
 const readiness=.4*statValue(s,primary)+.2*statValue(s,secondary)+.15*s.energy+.15*statValue(s,'morale')+.1*statValue(s,'health');
 const fatigued=s.energy<25||statValue(s,'morale')<25;
 const failure=Math.round(34-readiness*.25)+(fatigued?5:0),disaster=Math.round(12-readiness*.1)+(fatigued?4:0),great_success=Math.round(6+readiness*.22);
 return {great_success,success:100-great_success-failure-disaster,failure,disaster};
}
export function rollActivityResult(s,a,random=Math.random){
 const chances=activityChances(s,a);if(a.id==='rest')return {grade:'success',roll:0,chances};const roll=Math.max(0,Math.min(.999999999,random()));
 let edge=0,grade='great_success';for(const key of ['disaster','failure','success','great_success']){edge+=chances[key]/100;if(roll<edge){grade=key;break;}}
 return {grade,roll,chances};
}
export function resultDescription(id,grade){
 const task={observe:'빛과 여백을 살피는 연습',meal:'컵과 수건을 놓는 순서',explore:'지도를 보고 경로를 고르는 연습',stroll:'천천히 몸을 푸는 시간',wishbook:'다음 소원을 함께 고르는 시간',sketch:'색과 선을 고르는 연습',cook:'재료와 순서를 익히는 연습',walk:'새로운 길을 걷는 연습',talk:'서로의 마음을 듣는 시간',chores:'물건의 자리를 정하는 연습',atelier:'큰 그림을 완성하는 연습',picnic:'직접 나들이를 준비하는 연습',recycle:'재활용품을 분류하는 일',errand:'장보기 심부름',postcards:'그림 엽서를 만들어 파는 일','art-sale':'완성한 그림을 파는 일','food-sale':'간식을 만들어 파는 일',commission:'단골의 그림 주문'}[id]||'함께한 활동';
 return {great_success:`${task}이 뜻밖에 잘 풀렸어요. 평소보다 더 많이 배웠어요.`,success:`${task}을 차근차근 마쳤어요.`,failure:`${task}에서 잠깐 막혔어요. 조금 배웠지만 기운과 기분이 더 줄었어요.`,disaster:`${task}을 끝내지 못했어요. 성장 수치와 몸·마음이 줄어 쉬어 갈 시간이 필요해요.`}[grade];
}
