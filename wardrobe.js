import {validParts,partsFor} from './wardrobe-parts.js?v=joined5';
export const shopItems=[
 {id:'indoor-lilac',category:'indoor',name:'라일락 실내복',price:20,icon:'👕',note:'실내에서 입는 포근한 새 옷',cell:2},
 {id:'outdoor-sage',category:'outdoor',name:'세이지 외출복',price:24,icon:'🧥',note:'산책과 나들이에 입는 새 옷',cell:6},
 {id:'slippers',category:'indoorShoes',name:'꽃무늬 실내화',price:10,icon:'🥿',note:'휴식할 때 기운 회복 +3',cell:1},
 {id:'sneakers',category:'outdoorShoes',name:'편한 산책 운동화',price:14,icon:'👟',note:'야외 활동의 기운 소모 -2',cell:5},
 {id:'indoor-spring',category:'indoor',season:'spring',name:'봄 · 민트 피나포어',price:18,icon:'🌷',note:'블라우스 위에 입는 가벼운 실내 원피스',cell:{season:'spring',cell:0}},
 {id:'outdoor-spring',category:'outdoor',season:'spring',name:'봄 · 노랑 트렌치',price:24,icon:'🌷',note:'하늘색 원피스와 짧은 트렌치코트',cell:{season:'spring',cell:2}},
 {id:'indoor-summer',category:'indoor',season:'summer',name:'여름 · 복숭아 반팔 세트',price:16,icon:'☀️',note:'반팔 티와 시원한 하늘색 반바지',cell:{season:'summer',cell:0}},
 {id:'outdoor-summer',category:'outdoor',season:'summer',name:'여름 · 세일러 원피스',price:22,icon:'☀️',note:'푸른 세일러 칼라가 달린 흰 원피스',cell:{season:'summer',cell:2}},
 {id:'indoor-autumn',category:'indoor',season:'autumn',name:'가을 · 밤색 니트 세트',price:22,icon:'🍁',note:'케이블 니트와 짙은 남색 편한 바지',cell:{season:'autumn',cell:0}},
 {id:'outdoor-autumn',category:'outdoor',season:'autumn',name:'가을 · 버건디 케이프',price:28,icon:'🍁',note:'후드 케이프와 초록 체크 스커트',cell:{season:'autumn',cell:2}},
 {id:'indoor-winter',category:'indoor',season:'winter',name:'겨울 · 별무늬 수면잠옷',price:24,icon:'❄️',note:'작은 푸른 별이 있는 포근한 잠옷',cell:{season:'winter',cell:0}},
 {id:'outdoor-winter',category:'outdoor',season:'winter',name:'겨울 · 하늘색 더플코트',price:32,icon:'❄️',note:'빨간 목도리와 따뜻한 코트·겨울 신발',cell:{season:'winter',cell:2}},
];
export const wardrobeDefaults=()=>({owned:['indoor-original','outdoor-original','socks','maryjanes'],indoor:'indoor-original',outdoor:'outdoor-original',indoorShoes:'socks',outdoorShoes:'maryjanes'});
const categories=Object.fromEntries(Object.entries({indoor:['indoor-original'],outdoor:['outdoor-original'],indoorShoes:['socks'],outdoorShoes:['maryjanes']}).map(([category,base])=>[category,[...base,...shopItems.filter(item=>item.category===category).map(item=>item.id)]]));
export function wardrobeFor(s){return s.wardrobe||wardrobeDefaults();}
export function validWardrobe(w){
 if(!w||typeof w!=='object'||Array.isArray(w)||!Array.isArray(w.owned)||w.owned.length>Object.values(categories).flat().length||new Set(w.owned).size!==w.owned.length)return false;
 const allowed=Object.values(categories).flat();
 return (Object.keys(w).length===(w.parts===undefined?5:6))&&(w.parts===undefined||validParts(w.parts))&&w.owned.every(id=>allowed.includes(id))&&Object.entries(categories).every(([key,ids])=>ids.includes(w[key])&&w.owned.includes(w[key]));
}
export function buyClothing(s,id){
 const item=shopItems.find(x=>x.id===id),w=wardrobeFor(s);
 if(s.phase!=='schedule'||!item||w.owned.includes(id)||s.money<item.price)return s;
 const n=structuredClone(s);n.wardrobe=structuredClone(w);n.money-=item.price;n.wardrobe.owned.push(id);n.wardrobe[item.category]=id;n.wardrobe.parts={...partsFor(n),enabled:false};const shoePart=({slippers:'part-slippers',sneakers:'part-sneakers'})[id];if(shoePart&&!n.wardrobe.parts.owned.includes(shoePart))n.wardrobe.parts.owned.push(shoePart);
 n.morale=Math.min(100,(n.morale??60)+3);n.notice=item.name+'을 샀어요. 옷장에서 갈아입을 수 있어요.';
 return n;
}
export function equipClothing(s,category,id){
 const w=wardrobeFor(s);
 if(s.phase!=='schedule'||!categories[category]?.includes(id)||!w.owned.includes(id)||w[category]===id&&w.parts?.enabled===false)return s;
 const n=structuredClone(s);n.wardrobe=structuredClone(w);n.wardrobe[category]=id;n.wardrobe.parts={...partsFor(n),enabled:false};const shoePart=({slippers:'part-slippers',sneakers:'part-sneakers'})[id];if(shoePart&&!n.wardrobe.parts.owned.includes(shoePart))n.wardrobe.parts.owned.push(shoePart);n.notice='옷을 갈아입었어요. 실내와 야외에 맞는 옷을 챙겨요.';return n;
}
export const outdoorActivities=['walk','picnic','explore','stroll'];
export function wardrobeCell(s,outdoor=false){
 const w=wardrobeFor(s);
 const item=shopItems.find(item=>item.id===w[outdoor?'outdoor':'indoor']);
 if(item?.season)return {season:item.season,cell:outdoor?2+(w.outdoorShoes==='sneakers'?1:0):(w.indoorShoes==='slippers'?1:0)};
 return outdoor?(w.outdoor==='outdoor-sage'?6:4)+(w.outdoorShoes==='sneakers'?1:0):(w.indoor==='indoor-lilac'?2:0)+(w.indoorShoes==='slippers'?1:0);
}
export function clothingName(s,outdoor=false){const w=wardrobeFor(s),id=w[outdoor?'outdoor':'indoor'];return shopItems.find(item=>item.id===id)?.name||(outdoor?'가을 외출복':'분홍 실내복');}
export function wardrobeBenefit(s,id){const w=wardrobeFor(s);if(w.parts?.enabled)return id==='rest'&&w.parts.indoor.shoes==='part-slippers'?3:outdoorActivities.includes(id)&&w.parts.outdoor.shoes==='part-sneakers'?2:0;return id==='rest'&&w.indoorShoes==='slippers'?3:outdoorActivities.includes(id)&&w.outdoorShoes==='sneakers'?2:0;}
