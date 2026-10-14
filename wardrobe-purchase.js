const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function purchaseQuote(s,item){const remaining=s.money-item.price;return {price:item.price,balance:s.money,remaining,canBuy:remaining>=0&&s.phase==='schedule'};}
export function purchaseDialog(s,item){
 const q=purchaseQuote(s,item);
 return `<dialog id="purchase-confirm" class="purchase-dialog" aria-labelledby="purchase-title"><h2 id="purchase-title">${esc(item.name)}</h2><dl class="purchase-amounts"><div><dt>가격</dt><dd>${q.price}</dd></div><div><dt>현재 돈</dt><dd>${q.balance}</dd></div><div><dt>구매 후 남는 돈</dt><dd class="${q.canBuy?'':'purchase-short'}">${q.remaining}</dd></div></dl><p class="purchase-status" role="status">${q.canBuy?'구매할 수 있어요.':`돈이 ${Math.max(0,-q.remaining)} 부족해요.`}</p><div class="actions"><button data-action="purchase-cancel" autofocus>취소</button><button class="primary" data-action="purchase-confirm" ${q.canBuy?'':'disabled'}>구매하기</button></div></dialog>`;
}
