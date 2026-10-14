// Garments use measured crop bounds and body anchors from the atlas.
export const partItems=[
 {id:'top-rose',slot:'top',name:'분홍 포근한 맨투맨',cell:1,price:0},
 {id:'top-mint',slot:'top',name:'민트 카디건',cell:2,price:14},
 {id:'top-blue',slot:'top',name:'하늘색 맨투맨',cell:3,price:14},
 {id:'bottom-cream',slot:'bottom',name:'크림 편안한 바지',cell:4,price:0},
 {id:'bottom-navy',slot:'bottom',name:'남색 편안한 바지',cell:5,price:12},
 {id:'bottom-green',slot:'bottom',name:'초록 스커트',cell:6,price:12},
 {id:'bottom-wine',slot:'bottom',name:'버건디 스커트',cell:7,price:12},
 {id:'part-slippers',slot:'shoes',name:'분홍 실내화',cell:8,price:10,place:'indoor'},
 {id:'part-sneakers',slot:'shoes',name:'편안한 운동화',cell:9,price:14,place:'outdoor'},
 {id:'bag-pink',slot:'bag',name:'분홍 크로스백',cell:10,price:8},
 {id:'bag-blue',slot:'bag',name:'하늘색 크로스백',cell:11,price:8},
];
export const partSlots={top:'상의',bottom:'하의',shoes:'신발',bag:'가방'};
export function defaultParts(){return {enabled:true,owned:['top-rose','bottom-cream'],indoor:{top:'top-rose',bottom:'bottom-cream',shoes:'none',bag:'none'},outdoor:{top:'top-rose',bottom:'bottom-cream',shoes:'none',bag:'none'}};}
export function partsFor(s){if(s.wardrobe?.parts)return s.wardrobe.parts;const p=defaultParts(),w=s.wardrobe;for(const [old,id,place] of [['slippers','part-slippers','indoor'],['sneakers','part-sneakers','outdoor']])if(w?.owned.includes(old)){p.owned.push(id);if(w[place+'Shoes']===old)p[place].shoes=id;}return p;}
export function validParts(p){
 if(!p||typeof p!=='object'||Object.keys(p).length!==4||typeof p.enabled!=='boolean'||!Array.isArray(p.owned)||p.owned.length>partItems.length||new Set(p.owned).size!==p.owned.length||!p.owned.every(id=>partItems.some(i=>i.id===id)))return false;
 return ['indoor','outdoor'].every(place=>{const look=p[place];return look&&Object.keys(look).length===4&&Object.keys(partSlots).every(slot=>look[slot]==='none'||p.owned.includes(look[slot])&&partItems.some(i=>i.id===look[slot]&&i.slot===slot&&(!i.place||i.place===place)));});
}
export function changePart(s,id,place='indoor',buy=false){
 if(s.phase!=='schedule'||!['indoor','outdoor'].includes(place))return s;
 const p=partsFor(s),item=partItems.find(i=>i.id===id);
 if(!item||item.place&&item.place!==place||buy&&(p.owned.includes(id)||s.money<item.price)||!buy&&!p.owned.includes(id))return s;
 const n=structuredClone(s);n.wardrobe={...(n.wardrobe||{owned:['indoor-original','outdoor-original','socks','maryjanes'],indoor:'indoor-original',outdoor:'outdoor-original',indoorShoes:'socks',outdoorShoes:'maryjanes'}),parts:structuredClone(p)};n.wardrobe.parts.enabled=true;
 if(buy){n.money-=item.price;n.wardrobe.parts.owned.push(id);}
 n.wardrobe.parts[place][item.slot]=id;n.notice=item.name+(buy?'을 샀어요.':'으로 갈아입었어요.');return n;
}
export function removePart(s,slot,place='indoor'){
 if(s.phase!=='schedule'||!Object.hasOwn(partSlots,slot)||!['indoor','outdoor'].includes(place))return s;
 const n=structuredClone(s);n.wardrobe={...(n.wardrobe||{owned:['indoor-original','outdoor-original','socks','maryjanes'],indoor:'indoor-original',outdoor:'outdoor-original',indoorShoes:'socks',outdoorShoes:'maryjanes'}),parts:structuredClone(partsFor(s))};n.wardrobe.parts.enabled=true;n.wardrobe.parts[place][slot]='none';n.notice=slot==='bag'?'가방을 내려놓았어요.':'편안한 기본 이너웨어로 바꿨어요.';return n;
}
// Asset registration: crop bounds in the atlas and destination in base canvas.
// Keeping these explicit prevents garments from jumping when switching items.
export const partRegistration=[
 [0,0,256,650,0,0,256,650],
 [256,165,256,235,15,174,244,194],
 [512,165,256,235,15,174,244,194],
 [768,165,256,235,15,174,244,194],
 [0,685,256,400,35,318,200,270],
 [256,685,256,400,35,318,200,270],
 [512,685,256,270,35,318,200,198],
 [768,685,256,270,35,318,200,198],
 [0,1380,256,130,66,576,159,68],
 [256,1380,256,130,66,576,159,68],
 [512,1130,256,280,80,179,173,257],
 [768,1130,256,280,80,179,173,257],
];
export function partLayer(cell,clip=''){
 const [x,y,w,h,dx,dy,dw,dh]=partRegistration[cell];
 return `<span class="paper-layer" style="${clip}left:${dx/256*100}%;top:${dy/650*100}%;width:${dw/256*100}%;height:${dh/650*100}%;background-size:${1024/w*100}% ${1536/h*100}%;background-position:${x/(1024-w)*100}% ${y/(1536-h)*100}%" aria-hidden="true"></span>`;
}
export function assembledAvatar(s,outdoor=false,classes=''){
 const p=partsFor(s),look=p[outdoor?'outdoor':'indoor'];
 const cells=['bottom','top','shoes','bag'].map(slot=>partItems.find(i=>i.id===look[slot])?.cell).filter(c=>c!==undefined);
 const label=Object.values(look).map(id=>partItems.find(i=>i.id===id)?.name).filter(Boolean).join(' · ')||'편안한 반팔 티와 반바지';
 const coveredBottom=look.bottom!=='none';
 let base=coveredBottom?partLayer(0,'clip-path:polygon(0 0,100% 0,100% 50%,0 50%);')+partLayer(0,'clip-path:polygon(0 63.5%,100% 63.5%,100% 100%,0 100%);')+partLayer(0,'clip-path:polygon(0 50%,27% 50%,27% 63.5%,0 63.5%);')+partLayer(0,'clip-path:polygon(84% 50%,100% 50%,100% 63.5%,84% 63.5%);'):partLayer(0);
 if(look.top!=='none'){
  // Hide the base T-shirt, keeping the head, hands and front braids visible.
  const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 650"><rect width="256" height="650" fill="white"/><rect x="60" y="192" width="165" height="135" fill="black"/><rect x="86" y="192" width="29" height="51" fill="white"/><rect x="165" y="192" width="30" height="51" fill="white"/></svg>';
  const mask=`mask-image:url('data:image/svg+xml,${encodeURIComponent(svg)}');mask-mode:luminance;`;
  base=base.replaceAll('style="',`style="${mask}`);
 }
 return `<div class="wardrobe-avatar paper-doll ${classes}" role="img" aria-label="${label} 차림의 미아">${base}${cells.map(cell=>partLayer(cell)).join('')}</div>`;
}
export function partsDialog(s,outdoor=false){
 const p=partsFor(s),place=outdoor?'outdoor':'indoor',look=p[place];
 return `<dialog id="closet" class="closet-dialog"><div class="closet-header"><h2>미아의 조립 옷장</h2><button data-action="closet-close">닫기</button></div><p class="closet-budget">남은 돈 <strong>${s.money}</strong></p><div class="closet-layout"><div class="closet-preview">${assembledAvatar(s,outdoor,'closet-avatar')}<div class="closet-tabs"><button data-action="closet-preview" data-id="indoor" aria-pressed="${!outdoor}">실내</button><button data-action="closet-preview" data-id="outdoor" aria-pressed="${outdoor}">외출</button></div></div><div><nav class="closet-tabs"><button data-action="closet-tab" data-id="assemble" aria-pressed="true">조합하기</button><button data-action="closet-tab" data-id="wardrobe">기존 계절 의상</button><button data-action="closet-tab" data-id="shop">기존 의상 상점</button></nav>${Object.entries(partSlots).map(([slot,name])=>`<section class="closet-category part-category"><h3>${name}</h3><button data-action="part-remove" data-id="${slot}" aria-pressed="${look[slot]==='none'}">${({top:'기본 반팔',bottom:'기본 반바지',shoes:'양말만',bag:'가방 없음'})[slot]}</button>${partItems.filter(i=>i.slot===slot&&(!i.place||i.place===place)).map(i=>{const owned=p.owned.includes(i.id);return `<button data-action="${owned?'part-dress':'part-buy'}" data-id="${i.id}" aria-pressed="${look[slot]===i.id}" ${!owned&&s.money<i.price?'disabled':''}>${i.name}<small>${owned?(look[slot]===i.id?'착용 중':'입기'):`돈 ${i.price} · 구매`}</small></button>`;}).join('')}</section>`).join('')}<p class="muted closet-note">기본은 비치지 않는 반팔 티·넉넉한 반바지·양말이에요. 실내와 외출 조합은 따로 기억해요. 활동 애니메이션에는 활동복을 입어요.</p></div></div></dialog>`;
}
