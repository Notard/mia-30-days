import {rollActivityResult,resultGrades,resultDescription} from './activity-results.js';
import {advancedActivities,growthDialogue} from './progression.js';
import {statKeys,statNames,activityDelta,upgradeState,statValue} from './growth.js';
import {reactionFor} from "./dialogue.js";
import {resultLineFor} from './dialogue-situations.js';
import {startProfiles} from './start-profiles.js';

export const activities = [
  { id: 'rest', name: '은휘 안에서 쉬기', icon: '🧸', desc: '미아가 은휘 인형 안에서 기운을 회복해요.', cost: 0, energy: -24, gains: {} },
  { id: 'sketch', name: '스케치북 그리기', icon: '🎨', desc: '미아와 함께 그림을 그립니다.', cost: 6, energy: 15, gains: { art: 9 } },
  { id: 'cook', name: '간단한 요리', icon: '🍳', desc: '미아와 함께 요리를 해봅니다.', cost: 8, energy: 18, gains: { cook: 9 } },
  { id: 'walk', name: '공원 산책', icon: '🌳', desc: '미아와 손을 잡고 산책합니다.', cost: 4, energy: 20, gains: { courage: 9 } },
  { id: 'talk', name: '마음 나누기', icon: '💬', desc: '미아와 하루의 이야기를 나눕니다.', cost: 0, energy: 8, gains: { trust: 7 } },
  { id: 'chores', name: '집안일 돕기', icon: '🧹', desc: '미아와 함께 집안일을 합니다.', cost: -12, energy: 18, gains: { cook: 3 } },
  { id: 'atelier', name: '작업실에서 큰 그림', icon: '🖌️', desc: '연습한 색을 한 장의 작품으로 엮어 봐요.', cost: 12, energy: 22, gains: { art: 15 }, need: { stat: 'art', value: 18 } },
  { id: 'picnic', name: '한강 피크닉', icon: '🧺', desc: '미아가 직접 고른 자리에서 작은 나들이를 해요.', cost: 10, energy: 24, gains: { courage: 15 }, need: { stat: 'courage', value: 18 } },
  ...advancedActivities,
];

export function newGame(goal) {
  const g = Object.hasOwn(startProfiles,goal) ? goal : 'art';
  const state = {
    version: 3, day: 1, slot: 0, phase: 'schedule', goal: g,
    money: 70, energy: 70, art: 0, cook: 0, courage: 0, trust: 20,
    health:60,morale:60,focus:5,curiosity:5,independence:5,
    history: [], counts: {}, flags: {},
    notice: '미아와 보낼 일주일을 계획해 주세요.', eventChoice: null,
  };
  for(const [stat,bonus] of Object.entries(startProfiles[g].bonus))state[stat]+=bonus;
  return state;
}

export function availability(s, a) {
  if (s.phase !== 'schedule') return { ok: false, reason: '일정 단계가 아닙니다.' };
  if (a.id !== 'rest') {
    if (s.money < a.cost) return { ok: false, reason: '돈이 부족합니다.' };
    if (a.energy > 0 && s.energy < a.energy) return { ok: false, reason: '체력이 부족합니다.' };
    if (a.need && s[a.need.stat] < a.need.value) return { ok: false, reason: `${statNames[a.need.stat]} ${a.need.value}부터 열려요. 현재 ${statValue(s,a.need.stat)}` };
  }
  const tired = s.energy < 25||statValue(s,'morale')<25;
  if (tired && Object.keys(a.gains).some(k=>['art','cook','courage'].includes(k))) return { ok: true, reason: '기운이나 기분이 낮아 이번 배움은 절반이에요.' };
  return { ok: true, reason: '' };
}

export function applyActivity(s, id, random=Math.random) {
  const a = activities.find((x) => x.id === id);
  if (!a) return s;
  const av = availability(s, a);
  if (!av.ok) return s;
  const n = upgradeState(s),result=rollActivityResult(n,a,random),delta=activityDelta(n,a,result.grade);
  for(const [k,v] of Object.entries(delta))n[k]=statValue(n,k)+v;
  n.counts[id] = (n.counts[id] || 0) + 1;
  const parts = [];
  if (delta.money) parts.push(`돈 ${delta.money}`);
  if (delta.energy) parts.push(`체력 ${delta.energy}`);
  for (const k of statKeys) if (delta[k]) parts.push(`${statNames[k]} ${delta[k]>0?'+':''}${delta[k]}`);
  let reply=reactionFor({...n,slot:n.slot+1,history:[...n.history,{day:n.day,activityId:id}]},id);
  const growth=growthDialogue(n,id);
  reply=resultLineFor(id,result.grade)||reply;

  const mood=['failure','disaster','great_success'].includes(result.grade)?resultGrades[result.grade].mood:growth?.mood||(id==='rest'?'tired':n.energy<25?'tired':id==='talk'&&n.trust<50?'shy':n.trust>=50?'happy':'curious');
  n.history.push({ activityId:id,reply,mood,result, day: n.day, slot: n.slot, title: a.name, text: `${id==='rest'?'회복':resultGrades[result.grade].label} · ${a.desc} ${parts.join(', ')} 미아: “${reply}”`, delta });
  n.notice = `${a.name} · ${id==='rest'?'회복':resultGrades[result.grade].label} · ${parts.join(' · ')}${av.reason?' — '+av.reason:''}`;
  n.slot++;
  if (n.slot === 2) n.phase = 'event';
  return n;
}
