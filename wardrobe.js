export const shopItems=[
 {id:'indoor-lilac',category:'indoor',name:'라일락 실내복',price:20,icon:'👕',note:'실내에서 입는 포근한 새 옷',cell:2},
 {id:'outdoor-sage',category:'outdoor',name:'세이지 외출복',price:24,icon:'🧥',note:'산책과 나들이에 입는 새 옷',cell:6},
 {id:'slippers',category:'indoorShoes',name:'꽃무늬 실내화',price:10,icon:'🥿',note:'휴식할 때 기운 회복 +3',cell:1},
 {id:'sneakers',category:'outdoorShoes',name:'편한 산책 운동화',price:14,icon:'👟',note:'야외 활동의 기운 소모 -2',cell:5},
];
export const wardrobeDefaults=()=>({owned:['indoor-original','outdoor-original','socks','maryjanes'],indoor:'indoor-original',outdoor:'outdoor-original',indoorShoes:'socks',outdoorShoes:'maryjanes'});
const categories={indoor:['indoor-original','indoor-lilac'],outdoor:['outdoor-original','outdoor-sage'],indoorShoes:['socks','slippers'],outdoorShoes:['maryjanes','sneakers']};
export function wardrobeFor(s){return s.wardrobe||wardrobeDefaults();}
export function validWardrobe(w){
 if(!w||typeof w!=='object'||Array.isArray(w)||!Array.isArray(w.owned)||w.owned.length>8||new Set(w.owned).size!==w.owned.length)return false;
 const allowed=Object.values(categories).flat();
 return Object.keys(w).length===5&&w.owned.every(id=>allowed.includes(id))&&Object.entries(categories).every(([key,ids])=>ids.includes(w[key])&&w.owned.includes(w[key]));
}
export function buyClothing(s,id){
 const item=shopItems.find(x=>x.id===id),w=wardrobeFor(s);
 if(s.phase!=='schedule'||!item||w.owned.includes(id)||s.money<item.price)return s;
 const n=structuredClone(s);n.wardrobe=structuredClone(w);n.money-=item.price;n.wardrobe.owned.push(id);n.wardrobe[item.category]=id;
 n.morale=Math.min(100,(n.morale??60)+3);n.notice=item.name+'을 샀어요. 옷장에서 갈아입을 수 있어요.';
 return n;
}
export function equipClothing(s,category,id){
 const w=wardrobeFor(s);
 if(s.phase!=='schedule'||!categories[category]?.includes(id)||!w.owned.includes(id)||w[category]===id)return s;
 const n=structuredClone(s);n.wardrobe=structuredClone(w);n.wardrobe[category]=id;n.notice='옷을 갈아입었어요. 실내와 야외에 맞는 옷을 챙겨요.';return n;
}
export const outdoorActivities=['walk','picnic','explore','stroll'];
export function wardrobeCell(s,outdoor=false){
 const w=wardrobeFor(s);
 return outdoor?(w.outdoor==='outdoor-sage'?6:4)+(w.outdoorShoes==='sneakers'?1:0):(w.indoor==='indoor-lilac'?2:0)+(w.indoorShoes==='slippers'?1:0);
}
export function clothingName(s,outdoor=false){const w=wardrobeFor(s);return outdoor?(w.outdoor==='outdoor-sage'?'세이지 외출복':'가을 외출복'):(w.indoor==='indoor-lilac'?'라일락 실내복':'분홍 실내복');}
export function wardrobeBenefit(s,id){const w=wardrobeFor(s);return id==='rest'&&w.indoorShoes==='slippers'?3:outdoorActivities.includes(id)&&w.outdoorShoes==='sneakers'?2:0;}
