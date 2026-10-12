import {advancedActivities,growthDialogue} from './progression.js';
import {daySituation,morningLines,nightLines} from './dialogue-situations.js';
export const lines = {
  rest: {
    normal: [
      '은휘 안은 포근해. 여기서 조금 쉬고 나올래.',
      '밖에서 컵 놓는 소리가 들려. 눈 감고 조금만 듣고 있을래.',
      '잠깐 멈추는 걸 고를래. 움직이지 않아도 괜찮아.',
    ],
    close: [
      '은휘 안으로 돌아가 있을게. 나오고 싶어지면 내가 말해도 되지?',
    ],
    tired: [
      '몸이 무거워. 다음 휴식은 꼭 이 자리에서 하고 싶어.',
    ],
    repeat: [
      '또 은휘 안으로 돌아왔네. 이번에는 먼저 나오려고 서두르지 않을래.',
    ],
  },
  sketch: {
    normal: [
      '연필 자국이 고르게 안 나와. 한 번 더 눌러 볼래.',
      '강물 색을 고를래. 회색에 파랑을 조금 섞어 볼래.',
      '제목 글씨가 삐뚤어졌어. 작은 글씨로 다시 써야겠어.',
    ],
    close: [
      '이 색은 어둡지만, 내가 고른 색이라 이대로 남기고 싶어.',
    ],
    tired: [
      '손이 느려졌어. 색연필은 여기 두고 다음에는 잠깐 쉴래.',
    ],
    repeat: [
      '아까 강물을 그렸지. 이번엔 창틀도 그려 볼래. 같은 그림만 두 번은 싫어.',
    ],
  },
  cook: {
    normal: [
      '국에서 김이 올라와. 뚜껑을 살짝 열어 볼래.',
      '숟가락을 높이 들면 국이 튀어. 천천히 움직여야 해.',
      '빵이 짠 것 같아. 국에 담가 먹으면 맞을 거야.',
    ],
    close: [
      '국이 조금 짜졌네. 숨기지 말고 다음에는 덜 넣었다고 말하고 싶어.',
    ],
    tired: [
      '숟가락을 잡은 손이 피곤해. 냄비는 내려놓고 다음에는 쉬고 싶어.',
    ],
    repeat: [
      '이번 빵은 아까보다 덜 짜네. 소금도 쉬는 시간이 필요했나 봐.',
    ],
  },
  walk: {
    normal: [
      '낙엽 표면이 거칠어. 손으로 만져 보고 싶어.',
      '돌아오는 엘리베이터는 조용했어. 내 발소리가 좀 크게 들렸네.',
      '공원에서 본 낙엽이 생각나. 집에 와서도 손끝이 조금 거칠어.',
    ],
    close: [
      '오늘 지나친 길도 궁금했어. 다음에는 내가 길을 골라 볼래.',
    ],
    tired: [
      '다리가 무거워졌네. 다음 일정은 집에서 쉬는 걸로 고르고 싶어.',
    ],
    repeat: [
      '아까 공원에 갔지. 이번엔 다른 길을 걸어 볼래. 같은 길만 두 번은 싫어.',
    ],
  },
  talk: {
    normal: [
      '작은 소원을 말해 볼래. 오늘 하루가 조용했으면 좋겠어.',
      '실수할까 봐 두려워. 그래도 말해 볼래.',
      '말이 조금 늦게 나와도 기다려 주네. 다음 얘기도 꺼내 볼래.',
    ],
    close: [
      '실수한 걸 감추고 싶었어. 지금은 그냥 말해도 될 것 같아.',
    ],
    tired: [
      '말하다 보니 눈이 조금 감겨. 다음에는 조용히 쉬었다가 얘기할래.',
    ],
    repeat: [
      '아까는 하고 싶은 일, 이번에는 하기 싫은 일도 말해 봤어. 이것도 골라도 되지?',
    ],
  },
  chores: {
    normal: [
      '닦는 천이 서로 크기가 달라. 큰 건 식탁, 작은 건 컵 아래에 놓았어.',
      '수건 구석을 접어야 해. 네모나게 접을래.',
      '연필을 잃어버렸어. 서랍을 뒤져 볼래.',
    ],
    close: [
      '접는 모양이 조금 달라도 쓰기 편하면 되지? 내 칸은 이렇게 두고 싶어.',
    ],
    tired: [
      '접은 수건이 자꾸 풀리네. 손이 피곤해서 다음에는 쉬고 싶어.',
    ],
    repeat: [
      '아까는 수건, 이번에는 서랍이네. 찾던 연필도 여기 있었어.',
    ],
  },
  atelier: {
    normal: [
      '큰 종이 한 모서리가 비어 있어. 그 자리에 색을 칠해 볼래.',
      '색을 고를래. 파랑과 회색을 섞어 볼래.',
      '내가 원하는 마무리를 고를래. 반짝이는 색을 칠해 볼래.',
    ],
    close: [
      '빈 모서리는 그대로 두고 싶어. 다 채우지 않아도 내가 끝냈다고 말할래.',
    ],
    tired: [
      '큰 종이는 생각보다 오래 걸렸어. 붓을 씻고 다음에는 쉴래.',
    ],
    repeat: [
      '두 번째 큰 그림은 여백을 남겼어. 아까 것과 나란히 놓으면 다르게 보이네.',
    ],
  },
  picnic: {
    normal: [
      '바람이 냅킨을 들어 올렸어. 작은 돌로 눌렀더니 얌전해졌네.',
      '돗자리 모서리에 돌을 올려뒀어. 집에 돌아오기 전에 돌은 내려놓고 왔지.',
      '간식 부스러기가 떨어져. 주워야 해.',
    ],
    close: [
      '이 간식은 내가 고른 거라, 부스러기까지 다 먹고 싶어.',
    ],
    tired: [
      '돌아오니까 다리가 피곤하네. 다음에는 은휘 안에서 조금 쉬고 싶어.',
    ],
    repeat: [
      '아까도 피크닉을 했지. 이번엔 다른 간식을 가져갈래. 같은 간식만 두 번은 싫어.',
    ],
  },
};


const extraLines = {
  "rest": {
    "close": [
      "지금은 은휘 안이 편해. 쉬겠다고 먼저 말하니까 마음도 가벼워졌어.",
      "밖에서 이야기해도 들려. 대답이 늦으면 잠깐 자는 거야."
    ],
    "tired": [
      "눈을 감고 싶은 날도 내가 고르는 날이지? 오늘은 조금 더 쉴래."
    ],
    "repeat": [
      "두 번 쉬니까 창밖 소리도 다르게 들리네. 다음에는 내가 나오겠다고 말할게."
    ]
  },
  "sketch": {
    "close": [
      "강물에 칠한 색은 비밀로 해 둘까 했어. 지금은 같이 봐도 좋을 것 같아.",
      "제목을 바꾸고 싶어졌어. 처음 고른 걸 끝까지 지킬 필요는 없지?"
    ],
    "tired": [
      "연필을 자꾸 세게 누르게 되네. 손을 내려놓고 다음에는 쉴래."
    ],
    "repeat": [
      "이번에는 작은 그림으로 그렸어. 아까 것 옆에 놓으니까 두 개가 얘기하는 것 같네."
    ]
  },
  "cook": {
    "close": [
      "맛이 달라졌다고 바로 실패한 건 아니지? 내가 넣은 재료도 기억해 둘래.",
      "다음에는 국을 내가 먼저 떠 줄래. 뜨거우면 잠깐 기다리면 되니까."
    ],
    "tired": [
      "냄비에서 김이 나니까 나도 졸리네. 다음에는 따뜻한 자리에서 쉴래."
    ],
    "repeat": [
      "같은 국인데 두 번째 냄새가 조금 달라. 이번에는 넣은 순서를 기억했어."
    ]
  },
  "walk": {
    "close": [
      "낯선 길에서는 멈추고 싶었어. 기다려 주니까 다시 걸어 볼 마음이 생겼네.",
      "오늘 본 자리 중에 내 자리를 골랐어. 다음에도 거기부터 찾아볼래."
    ],
    "tired": [
      "많이 걸으니까 발끝까지 하루가 내려온 것 같아. 다음 일정은 쉬고 싶어."
    ],
    "repeat": [
      "돌아오는 길을 다르게 골랐어. 아까 못 본 나무도 있더라."
    ]
  },
  "talk": {
    "close": [
      "말하다가 마음이 바뀌어도 괜찮구나. 아까 못 꺼낸 얘기도 해 볼래.",
      "처음에는 네가 먼저 골라 주길 기다렸어. 지금은 내가 원하는 걸 조금 알겠어."
    ],
    "tired": [
      "말이 자꾸 짧아지네. 싫어서 그런 건 아니야. 다음에는 조금 쉬고 싶어."
    ],
    "repeat": [
      "이번에는 네 얘기를 듣고 싶어. 내 말만 들어서 목도 조금 피곤하겠네."
    ]
  },
  "chores": {
    "close": [
      "찾던 물건이 나오니까 좋네. 내 물건 자리는 내가 정해 두고 싶어.",
      "접은 수건 한 장은 내 칸에 둘래. 삐뚤어져도 바로 찾을 수 있으니까."
    ],
    "tired": [
      "서랍은 다 닫았어. 다음에는 손을 쉬게 해 주고 싶어."
    ],
    "repeat": [
      "두 번째 정리에서는 버리기 전에 한 번 더 봤어. 아까 못 찾은 작은 물건도 있었네."
    ]
  },
  "atelier": {
    "close": [
      "큰 종이 앞에서는 조금 무서웠어. 한 모서리씩 하니까 내 그림이 됐네.",
      "내가 멈춘 자리까지가 이번 그림이야. 다음 그림은 다른 모양으로 끝낼래."
    ],
    "tired": [
      "빈자리가 아직 보여도 오늘은 여기까지 하고 싶어. 다음에는 쉬는 걸 골라 줄래?"
    ],
    "repeat": [
      "같은 종이 크기인데 두 번째는 덜 멀어 보여. 시작할 자리도 내가 먼저 골랐어."
    ]
  },
  "picnic": {
    "close": [
      "자리만 내가 고른 줄 알았는데, 돌아올 때도 내가 말했네. 다음에도 그렇게 하고 싶어.",
      "조용한 곳이 좋았어. 다음에 같이 가면 오늘 앉았던 자리부터 보여 줄래."
    ],
    "tired": [
      "간식은 다 정리하고 왔어. 이제 다음 일정은 집에서 쉬고 싶어."
    ],
    "repeat": [
      "두 번째 자리에는 그늘이 있었어. 같은 강인데 바람은 다르게 불었네."
    ]
  }
};
for (const [id,groups] of Object.entries(extraLines)) for (const [kind,values] of Object.entries(groups)) lines[id][kind].push(...values);

for(const a of advancedActivities)lines[a.id]=lines[a.sprite];

export const greetings = {
  art: [
    '오늘은 색을 고르고 싶어. 파랑과 회색을 섞어 볼래.',
    '오늘은 큰 종이에 색을 칠하고 싶어. 한 모서리만 비워 둘래.',
    '오늘은 내가 원하는 마무리를 고르고 싶어. 반짝이는 색을 칠해 볼래.',
  ],
  cook: [
    '오늘은 국을 끓이고 싶어. 김이 올라오면 뚜껑을 열어 볼래.',
    '오늘은 빵을 구워 볼래. 짠 건 국에 담가 먹을래.',
    '오늘은 숟가락을 높이 들지 않고 천천히 먹을래.',
  ],
  courage: [
    '오늘은 바람 부는 곳까지 천천히 걸어 보고 싶어.',
    '오늘은 강물이 잘 보이는 자리를 내가 찾아볼래.',
    '오늘은 공원에서 새 길을 하나 골라 보고 싶어.',
  ],
  home: [
    '오늘은 쉬고 싶을 때 내가 먼저 말해 볼래.',
    '오늘은 조용한 방에서 숨만 고를래.',
    '오늘은 잠깐 멈추는 걸 고를래. 움직이지 않아도 괜찮아.',
  ],
};

export const nights = [
 '첫날은 여기까지네. 은휘 안에서 오늘 고른 것들을 떠올려 볼래.',
 '익숙한 자리가 하나 생겼어. 내일도 여기서 이야기해도 되지?',
 '창밖 소리가 조금 달라졌네. 나는 안에서 조용히 쉬고 있을게.',
 '다르게 고르면 다른 하루가 되는구나. 오늘 고른 건 내가 기억할래.',
 '잘 안 된 것도 말할 수 있어서 좋았어. 지금은 조금 쉬고 싶어.',
 '내일 보여 줄 때도 내 말로 이야기하고 싶어. 처음부터 외우지는 않을래.',
 '일주일이 끝났네. 내가 고른 일들이 여기 남아 있어. 이제 은휘 안에서 쉴래.'
];

export function reactionFor(s, id) {
  const growth=growthDialogue(s,id);if(growth)return growth.text;
  const counts = {};
  (s.history || []).forEach(h => {
    if (h.day === s.day) counts[h.activityId] = (counts[h.activityId] || 0) + 1;
  });
  const pool = lines[id];
  let mood;
  if ((counts[id] || 0) >= 2) mood = 'repeat';
  else if (s.energy < 25 && id !== 'rest') mood = 'tired';
  else if (s.trust >= 50) mood = 'close';
  else mood = 'normal';
  const arr = pool[mood];
  const idx = (s.day + (s.slot || 0) + (s.counts?.[id] || 0)) % arr.length;
  return arr[idx];
}

export function dialogueFor(s) {
  const hist = s.history || [];
  const latest = hist[hist.length - 1];
  if(s.phase==='night'){
    const kind=daySituation(s,true);
    if(kind)return {text:nightLines[kind],mood:kind==='disaster'||kind==='failure'?'sad':kind==='rested'?'tired':'happy'};
  }
  if (latest && latest.day === s.day && latest.reply) {
    return { text: latest.reply, mood: latest.mood || (s.energy < 25 ? 'tired' : s.trust >= 50 ? 'happy' : 'curious') };
  }
  if (s.phase === 'night' || s.phase === 'end') {
    return { text: nights[s.day - 1], mood: 'tired' };
  }
  const morning=daySituation(s);
  if(morning)return {text:morningLines[morning],mood:morning==='disaster'||morning==='failure'?'sad':morning==='tired'?'tired':'happy'};
  const growth=growthDialogue(s);if(growth)return growth;
  const g = greetings[s.goal] || greetings.home;
  return { text: g[(s.day - 1) % 3], mood: s.energy < 25 ? 'tired' : s.trust >= 50 ? 'happy' : 'curious' };
}
